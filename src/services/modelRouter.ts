import { SettingsService } from "./settingsService";
import { PhiProvider } from "../providers/phiProvider";
import { QwenProvider } from "../providers/qwenProvider";
import { PromptBuilder } from "./promptBuilder";
import { detectComplexity } from "../utils/detectComplexity";
import { RetrievalResult, RagService } from "./ragService";
import { TechnicalRoutingReason } from "../utils/routingReason";

export interface GenerationResult {
  text: string;
  modelUsed: "phi" | "qwen" | "errore";
  reason: TechnicalRoutingReason;
  durationMs: number;
  ragActive: boolean;
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
    retrievedDocs: RetrievalResult[]
  ): { model: "phi" | "qwen"; reason: TechnicalRoutingReason } {
    const settings = SettingsService.getSettings();

    if (mode === "phi") {
      return { model: "phi", reason: "user_forced_phi" };
    }
    if (mode === "qwen") {
      return { model: "qwen", reason: "user_forced_qwen" };
    }

    // If auto mode:
    // 1. Route to Qwen if prompt is semantically complex
    if (settings.useQwenComplex && detectComplexity(prompt)) {
      return { model: "qwen", reason: "complexity_routed_qwen" };
    }

    // 2. Route to Qwen if RAG requires advanced processing
    if (this.shouldUseQwenForRag(prompt, retrievedDocs)) {
      return { model: "qwen", reason: "rag_query_rewrite_qwen" };
    }

    // 3. Fast path default: Phi
    return { model: "phi", reason: "phi_default_fast_path" };
  }

  /**
   * Orchestrates the query rewriting step if Qwen is available.
   */
  static async tryQueryRewrite(query: string): Promise<string> {
    try {
      const rewritePrompt = PromptBuilder.buildQueryRewritePrompt(query);
      const messages = [{ role: "user", content: rewritePrompt }];
      
      const { text } = await QwenProvider.generateWithQwen(messages, {
        temperature: 0.1,
        // Short timeout for rewriting step so it doesn't block the UI
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
   * and runs fallback logic on errors.
   */
  static async generateAnswer(
    chatHistory: { role: "utente" | "assistente"; testo: string }[],
    mode: "auto" | "phi" | "qwen",
    originalQuery: string
  ): Promise<GenerationResult> {
    const settings = SettingsService.getSettings();
    const startTime = Date.now();

    // 1. Initial local RAG search with the original query
    let retrieved = RagService.retrieve(originalQuery);
    let queryForGeneration = originalQuery;

    // 2. Local Query Rewriting check
    let queryRewritten = false;
    if (mode === "auto" && settings.useQwenRewriting && this.shouldUseQwenForRag(originalQuery, retrieved)) {
      // Query rewrite step using Qwen
      const optimizedQuery = await this.tryQueryRewrite(originalQuery);
      if (optimizedQuery !== originalQuery) {
        retrieved = RagService.retrieve(optimizedQuery);
        queryForGeneration = optimizedQuery;
        queryRewritten = true;
      }
    }

    // 3. Determine base model routing
    let { model, reason } = this.routeModel(mode, queryForGeneration, retrieved);

    // 4. Construct prompt structure (incorporating RAG context if found)
    const ragActive = retrieved.length > 0;
    const context = RagService.buildRagContext(retrieved);
    
    // Map chatHistory to providers message format
    const providerMessages = chatHistory.slice(-5).map(m => ({
      role: m.role === "utente" ? "user" : "assistant",
      content: m.testo
    }));

    // The last user message content is replaced by our RAG structure or simple prompt
    const userPrompt = ragActive 
      ? PromptBuilder.buildRagPrompt(originalQuery, context)
      : originalQuery;

    // Update the last user message with our prompt
    if (providerMessages.length > 0 && providerMessages[providerMessages.length - 1].role === "user") {
      providerMessages[providerMessages.length - 1].content = userPrompt;
    } else {
      providerMessages.push({ role: "user", content: userPrompt });
    }

    // 5. Try generating response with chosen model and trigger fallback if necessary
    try {
      if (model === "phi") {
        try {
          console.log(`[ModelRouter] Executing chosen model: Phi (${settings.phiModel}), Reason: ${reason}`);
          const systemPrompt = PromptBuilder.getPhiSystemPrompt();
          const { text } = await PhiProvider.generateWithPhi(providerMessages, { systemPrompt });
          
          return {
            text,
            modelUsed: "phi",
            reason,
            durationMs: Date.now() - startTime,
            ragActive
          };
        } catch (phiError) {
          if (mode === "auto") {
            // Fallback: Phi failed, try Qwen
            console.warn("[ModelRouter] Phi failed. Falling back to Qwen...", phiError);
            const systemPrompt = PromptBuilder.getQwenSystemPrompt();
            const { text } = await QwenProvider.generateWithQwen(providerMessages, { systemPrompt });
            
            return {
              text,
              modelUsed: "qwen",
              reason: "phi_failed_qwen_fallback",
              durationMs: Date.now() - startTime,
              ragActive
            };
          }
          throw phiError;
        }
      } else {
        // Chosen model is Qwen
        try {
          console.log(`[ModelRouter] Executing chosen model: Qwen (${settings.qwenModel}), Reason: ${reason}`);
          const systemPrompt = PromptBuilder.getQwenSystemPrompt();
          const { text } = await QwenProvider.generateWithQwen(providerMessages, { systemPrompt });
          
          return {
            text,
            modelUsed: "qwen",
            reason: queryRewritten && reason === "phi_default_fast_path" ? "rag_query_rewrite_qwen" : reason,
            durationMs: Date.now() - startTime,
            ragActive
          };
        } catch (qwenError) {
          if (mode === "auto") {
            // Fallback: Qwen failed or unavailable, try Phi
            console.warn("[ModelRouter] Qwen failed. Falling back to Phi...", qwenError);
            const systemPrompt = PromptBuilder.getPhiSystemPrompt();
            const { text } = await PhiProvider.generateWithPhi(providerMessages, { systemPrompt });
            
            return {
              text,
              modelUsed: "phi",
              reason: "qwen_unavailable_phi_retry",
              durationMs: Date.now() - startTime,
              ragActive
            };
          }
          throw qwenError;
        }
      }
    } catch (finalError: any) {
      console.error("[ModelRouter] All local model paths failed:", finalError);
      return {
        text: `Errore di connessione locale:\n${finalError.message || "Impossibile contattare il server Ollama."}\n\nAssicurati che Ollama sia in esecuzione (http://localhost:11434) e che i modelli '${settings.phiModel}' e '${settings.qwenModel}' siano stati installati eseguendo nel terminale:\nollama run ${settings.phiModel}\nollama run ${settings.qwenModel}`,
        modelUsed: "errore",
        reason: "system_error",
        durationMs: Date.now() - startTime,
        ragActive: false
      };
    }
  }
}
