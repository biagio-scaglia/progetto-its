import { SettingsService } from "./settingsService";
import { PhiProvider } from "../providers/phiProvider";
import { QwenProvider } from "../providers/qwenProvider";
import { PromptBuilder } from "./promptBuilder";
import { detectComplexity } from "../utils/detectComplexity";
import { RetrievalResult, RagService } from "./ragService";
import { TechnicalRoutingReason } from "../utils/routingReason";
import { InputGuard } from "../security/inputGuard";
import { RagGuard } from "../security/ragGuard";
import { OutputGuard } from "../security/outputGuard";

export interface GenerationResult {
  text: string;
  modelUsed: "phi" | "qwen" | "errore";
  reason: TechnicalRoutingReason;
  durationMs: number;
  ragActive: boolean;
  // Safety Metadata
  inputRiskScore?: number;
  ragRiskScore?: number;
  quarantinedChunksCount?: number;
  outputBlocked?: boolean;
}

export class ModelRouter {
  /**
   * Decides if Qwen is needed for query rewriting or cross-document synthesis.
   */
  static shouldUseQwenForRag(query: string, retrievedDocs: RetrievalResult[]): boolean {
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
   * Selection engine: routes the query to Phi or Qwen and provides the technical reason.
   */
  static routeModel(
    mode: "auto" | "phi" | "qwen",
    prompt: string,
    retrievedDocs: RetrievalResult[],
    promptRisk = 0,
    ragRisk = 0
  ): { model: "phi" | "qwen"; reason: TechnicalRoutingReason } {
    const settings = SettingsService.getSettings();

    if (mode === "phi") {
      return { model: "phi", reason: "user_forced_phi" };
    }
    if (mode === "qwen") {
      return { model: "qwen", reason: "user_forced_qwen" };
    }

    // If auto mode:
    // 1. Force Qwen for second opinion if safety risk is borderline/elevated
    if (settings.safeMode && settings.useQwenSecondOpinion && (promptRisk >= 0.35 || ragRisk >= 0.35)) {
      return { model: "qwen", reason: "complexity_routed_qwen" }; // Route to advanced model for safety
    }

    // 2. Route to Qwen if prompt is semantically complex
    if (settings.useQwenComplex && detectComplexity(prompt)) {
      return { model: "qwen", reason: "complexity_routed_qwen" };
    }

    // 3. Route to Qwen if RAG requires advanced processing
    if (this.shouldUseQwenForRag(prompt, retrievedDocs)) {
      return { model: "qwen", reason: "rag_query_rewrite_qwen" };
    }

    // 4. Fast path default: Phi
    return { model: "phi", reason: "phi_default_fast_path" };
  }

  /**
   * Orchestrates the query rewriting step if Qwen is available.
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
   * Main generation entry point: routes, handles prompt construction, executes local models,
   * runs fallback logic on errors, and validates output against prompt injection/leaks.
   */
  static async generateAnswerSecure(
    chatHistory: { role: "utente" | "assistente"; testo: string }[],
    mode: "auto" | "phi" | "qwen",
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
        // Minimal log
        this.logMinimalMetadata(duration, "errore", inputRiskScore, 0, 0, 0, true);
        return {
          text: "Nota di sicurezza: La tua richiesta ha attivato le policy di sicurezza di SDIT e non può essere elaborata.",
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

    // 2. Initial local RAG search with the query
    let retrieved = RagService.retrieve(queryForGeneration);
    let queryRewritten = false;

    // 3. Local Query Rewriting check
    if (mode === "auto" && settings.useQwenRewriting && this.shouldUseQwenForRag(queryForGeneration, retrieved)) {
      const optimizedQuery = await this.rewriteRetrievalQueryIfNeeded(queryForGeneration);
      if (optimizedQuery !== queryForGeneration) {
        retrieved = RagService.retrieve(optimizedQuery);
        queryForGeneration = optimizedQuery;
        queryRewritten = true;
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

    // 5. Determine base model routing
    const { model, reason } = this.routeModel(mode, queryForGeneration, retrieved, inputRiskScore, ragRiskScore);

    // 6. Construct prompt structure (incorporating RAG context if found)
    const ragActive = retrieved.length > 0;
    const context = RagService.buildRagContext(retrieved);
    
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
    let modelUsed: "phi" | "qwen" | "errore" = "errore";
    let finalReason = reason;

    // 7. Try generating response with chosen model and trigger fallback if necessary
    try {
      if (model === "phi") {
        try {
          console.log(`[ModelRouter] Executing chosen model: Phi (${settings.phiModel}), Reason: ${reason}`);
          const systemPrompt = PromptBuilder.getPhiSystemPrompt();
          const { text } = await PhiProvider.generateWithPhi(providerMessages, { systemPrompt });
          finalAnswer = text;
          modelUsed = "phi";
        } catch (phiError) {
          if (mode === "auto") {
            // Fallback: Phi failed, try Qwen
            console.warn("[ModelRouter] Phi failed. Falling back to Qwen...", phiError);
            const systemPrompt = PromptBuilder.getQwenSystemPrompt();
            const { text } = await QwenProvider.generateWithQwen(providerMessages, { systemPrompt });
            finalAnswer = text;
            modelUsed = "qwen";
            finalReason = "phi_failed_qwen_fallback";
          } else {
            throw phiError;
          }
        }
      } else {
        // Chosen model is Qwen
        try {
          console.log(`[ModelRouter] Executing chosen model: Qwen (${settings.qwenModel}), Reason: ${reason}`);
          const systemPrompt = PromptBuilder.getQwenSystemPrompt();
          const { text } = await QwenProvider.generateWithQwen(providerMessages, { systemPrompt });
          finalAnswer = text;
          modelUsed = "qwen";
          finalReason = queryRewritten && reason === "phi_default_fast_path" ? "rag_query_rewrite_qwen" : reason;
        } catch (qwenError) {
          if (mode === "auto") {
            // Fallback: Qwen failed or unavailable, try Phi
            console.warn("[ModelRouter] Qwen failed. Falling back to Phi...", qwenError);
            // Fallback to Phi with extra-restrictive policy prompt
            const systemPrompt = PromptBuilder.getPhiSystemPrompt();
            const { text } = await PhiProvider.generateWithPhi(providerMessages, { systemPrompt });
            finalAnswer = text;
            modelUsed = "phi";
            finalReason = "qwen_unavailable_phi_retry";
          } else {
            throw qwenError;
          }
        }
      }

      // 8. Layer 5: Output Guard
      if (settings.safeMode) {
        const outputAnalysis = OutputGuard.validateModelOutput(finalAnswer, context, settings.protectionLevel);
        finalAnswer = outputAnalysis.sanitizedOutput;
        if (!outputAnalysis.isValid) {
          outputBlocked = true;
        }
      }

      const duration = Date.now() - startTime;
      this.logMinimalMetadata(duration, modelUsed, inputRiskScore, ragRiskScore, retrieved.length, quarantinedChunksCount, outputBlocked);

      return {
        text: finalAnswer,
        modelUsed,
        reason: finalReason,
        durationMs: duration,
        ragActive,
        inputRiskScore,
        ragRiskScore,
        quarantinedChunksCount,
        outputBlocked
      };

    } catch (finalError: any) {
      console.error("[ModelRouter] All local model paths failed:", finalError);
      const duration = Date.now() - startTime;
      this.logMinimalMetadata(duration, "errore", inputRiskScore, ragRiskScore, retrieved.length, quarantinedChunksCount, false);

      return {
        text: `Errore di connessione locale:\n${finalError.message || "Impossibile contattare il server Ollama."}\n\nAssicurati che Ollama sia in esecuzione (http://localhost:11434) e che i modelli '${settings.phiModel}' e '${settings.qwenModel}' siano stati installati eseguendo nel terminale:\nollama run ${settings.phiModel}\nollama run ${settings.qwenModel}`,
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
