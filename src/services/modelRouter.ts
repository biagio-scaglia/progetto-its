import { SettingsService } from "./settingsService";
import { QwenProvider } from "../providers/qwenProvider";
import { PromptBuilder } from "./promptBuilder";
import { RetrievalResult, RagService } from "./ragService";
import { TechnicalRoutingReason } from "../utils/routingReason";
import { InputGuard } from "../security/inputGuard";
import { RagGuard } from "../security/ragGuard";
import { OutputGuard } from "../security/outputGuard";
import { COPY_SECURITY, COPY_ERRORS } from "../config/microcopy";
import { ContextBuilder } from "../rag/contextBuilder";
import { extractUsedSources, formatSourcesForUi } from "../rag/citations";

export interface GenerationResult {
  text: string;
  modelUsed: "qwen" | "errore";
  reason: TechnicalRoutingReason;
  durationMs: number;
  ragActive: boolean;
  // Safety Metadata
  inputRiskScore?: number;
  ragRiskScore?: number;
  quarantinedChunksCount?: number;
  outputBlocked?: boolean;
  fontiUsate?: any[];
}

export class ModelRouter {
  /**
   * Decides if RAG query rewriting is needed based on query characteristics.
   */
  static shouldRewriteRetrievalQuery(query: string, retrievedDocs: RetrievalResult[]): boolean {
    const settings = SettingsService.getSettings();
    if (!settings.useQwenRewriting) return false;

    // Condition 1: Multiple documents found, requiring cross-document synthesis
    if (retrievedDocs.length > 1) {
      return true;
    }

    // Condition 2: Search term is very short, suggesting query rewrite might help
    if (query.trim().length < 15) {
      return true;
    }

    // Condition 3: Prompt contains intent for comparison or overall summary
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes("sintesi") || lowercaseQuery.includes("confronto") || lowercaseQuery.includes("tutti")) {
      return true;
    }

    return false;
  }

  /**
   * Orchestrates the query rewriting step using the local Qwen model.
   */
  static async rewriteRetrievalQueryIfNeeded(query: string): Promise<string> {
    try {
      const rewritePrompt = PromptBuilder.buildQueryRewritePrompt(query);
      const messages = [{ role: "user", content: rewritePrompt }];
      
      const { text } = await QwenProvider.generateWithQwen(messages, {
        temperature: 0.1,
        timeout: 5000 
      });

      console.log(`[ModelRouter] Query rewritten: "${query}" -> "${text.trim()}"`);
      return text.trim() || query;
    } catch (e) {
      console.warn("[ModelRouter] Query rewriting failed, using original query:", e);
      return query;
    }
  }

  /**
   * Main generation entry point: handles prompt construction, executes local Qwen model,
   * and validates output against prompt injection/leaks.
   */
  static async generateAnswerSecure(
    chatHistory: { role: "utente" | "assistente"; testo: string }[],
    originalQuery: string
  ): Promise<GenerationResult> {
    const settings = SettingsService.getSettings();
    const startTime = Date.now();

    let queryForGeneration = originalQuery;
    let inputRiskScore = 0;
    let outputBlocked = false;

    // 1. Layer 1: Input Guard
    if (settings.safeMode) {
      const inputAnalysis = InputGuard.detectPromptInjection(originalQuery, settings.protectionLevel);
      inputRiskScore = inputAnalysis.score;

      if (inputAnalysis.decision === "block") {
        const duration = Date.now() - startTime;
        this.logMinimalMetadata(duration, "errore", inputRiskScore, 0, 0, 0, true);
        return {
          text: COPY_SECURITY.inputBlocked,
          modelUsed: "errore",
          reason: "system_error",
          durationMs: duration,
          ragActive: false,
          inputRiskScore,
          outputBlocked: true
        };
      } else if (inputAnalysis.decision === "sanitize") {
        queryForGeneration = inputAnalysis.sanitizedInput;
      }
    }

    // 2. Initial RAG search (hybrid: vector + TF-IDF)
    let retrieved = await RagService.retrieveHybrid(queryForGeneration);
    // 3. Local Query Rewriting check
    if (settings.useQwenRewriting && this.shouldRewriteRetrievalQuery(queryForGeneration, retrieved)) {
      const optimizedQuery = await this.rewriteRetrievalQueryIfNeeded(queryForGeneration);
      if (optimizedQuery !== queryForGeneration) {
        retrieved = await RagService.retrieveHybrid(optimizedQuery);
        queryForGeneration = optimizedQuery;
      }
    }

    // 4. Layer 2: RAG Guard
    let ragRiskScore = 0;
    let quarantinedChunksCount = 0;
    if (settings.safeMode && retrieved.length > 0) {
      const ragAnalysis = RagGuard.inspectRetrievedChunks(retrieved, settings.protectionLevel);
      retrieved = ragAnalysis.safeChunks;
      quarantinedChunksCount = ragAnalysis.quarantinedChunks.length;
      ragRiskScore = ragAnalysis.quarantinedChunks.reduce((max, chunk) => Math.max(max, chunk.riskScore), 0);
    }

    // 5. Build prompt structure (incorporating RAG context if found)
    const ragActive = retrieved.length > 0;
    const context = ContextBuilder.buildCitationAwareContext(retrieved);
    
    // Map chatHistory to providers message format (last 5 messages for context)
    const providerMessages = chatHistory.slice(-5).map(m => ({
      role: m.role === "utente" ? "user" : "assistant",
      content: m.testo
    }));

    // The last user message content is replaced by our RAG structure or simple prompt
    const userPrompt = ragActive 
      ? PromptBuilder.buildRagPrompt(queryForGeneration, context)
      : queryForGeneration;

    // Update the last user message with our prompt
    if (providerMessages.length > 0 && providerMessages[providerMessages.length - 1].role === "user") {
      providerMessages[providerMessages.length - 1].content = userPrompt;
    } else {
      providerMessages.push({ role: "user", content: userPrompt });
    }

    let finalAnswer = "";
    let modelUsed: "qwen" | "errore" = "errore";
    let finalReason: TechnicalRoutingReason = "qwen_generation";

    try {
      console.log(`[ModelRouter] Executing local Qwen model (${settings.qwenModel})...`);
      const systemPrompt = PromptBuilder.getQwenSystemPrompt();
      const { text } = await QwenProvider.generateWithQwen(providerMessages, { systemPrompt });
      finalAnswer = text;
      modelUsed = "qwen";

      // 6. Layer 5: Output Guard
      if (settings.safeMode) {
        const outputAnalysis = OutputGuard.validateModelOutput(finalAnswer, context, settings.protectionLevel);
        finalAnswer = outputAnalysis.sanitizedOutput;
        if (!outputAnalysis.isValid) {
          outputBlocked = true;
        }
      }

      const duration = Date.now() - startTime;
      this.logMinimalMetadata(duration, modelUsed, inputRiskScore, ragRiskScore, retrieved.length, quarantinedChunksCount, outputBlocked);

      let fontiUsate: any[] = [];
      if (ragActive && !outputBlocked) {
        const used = extractUsedSources(finalAnswer, retrieved);
        fontiUsate = formatSourcesForUi(used);
      }

      return {
        text: finalAnswer,
        modelUsed,
        reason: finalReason,
        durationMs: duration,
        ragActive,
        inputRiskScore,
        ragRiskScore,
        quarantinedChunksCount,
        outputBlocked,
        fontiUsate
      };

    } catch (finalError: any) {
      console.error("[ModelRouter] Local model execution failed:", finalError);
      const duration = Date.now() - startTime;
      this.logMinimalMetadata(duration, "errore", inputRiskScore, ragRiskScore, retrieved.length, quarantinedChunksCount, false);

      return {
        text: COPY_ERRORS.connectionError,
        modelUsed: "errore",
        reason: "system_error",
        durationMs: duration,
        ragActive: false,
        inputRiskScore,
        ragRiskScore,
        quarantinedChunksCount,
        outputBlocked: false
      };
    }
  }

  /**
   * Minimal logging mechanism that keeps privacy-first (no message contents logged).
   */
  private static logMinimalMetadata(
    durationMs: number,
    modelUsed: string,
    inputRiskScore: number,
    ragRiskScore: number,
    chunksCount: number,
    quarantinedChunksCount: number,
    outputBlocked: boolean
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      modelUsed,
      durationMs,
      inputRiskScore,
      ragRiskScore,
      chunksCount,
      quarantinedChunksCount,
      outputBlocked
    };
    console.log("[AI-SECURITY-LOG]", JSON.stringify(logData));
  }
}
