import { Messaggio } from "../types";
import { RagService } from "./ragService";
import { ModelRouter } from "./modelRouter";
import { IntentClassifier } from "./intentClassifier";
import { SocialResponses } from "./socialResponses";
import { COPY_SUGGESTIONS } from "../config/microcopy";

export class ChatService {
  /**
   * Processes a user message, runs local index updates, pre-classifies query intent,
   * routes to instant conversational response or RAG/LLM local pipeline,
   * detects contextual application deep links, and yields the final message pair.
   */
  static async processMessage(
    inputText: string,
    history: Messaggio[]
  ): Promise<{ userMessage: Messaggio; assistantMessage: Messaggio }> {
    const timestamp = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

    // 1. Create user message
    const userMessage: Messaggio = {
      id: `msg-user-${Date.now()}`,
      mittente: "utente",
      testo: inputText,
      timestamp
    };

    // 2. Incremental refresh of the RAG index
    RagService.refreshIndex();

    // 3. Pre-classify intent
    const intent = IntentClassifier.classifyIntent(inputText);

    let finalAnswer = "";
    let modelUsed: "phi" | "qwen" | "errore" | "llama.cpp" | undefined = undefined;
    let reason: string | undefined = undefined;
    let ragActive = false;
    let durationMs = 0;
    let inputRiskScore = 0;
    let ragRiskScore = 0;
    let outputBlocked = false;
    let quarantinedChunksCount = 0;
    let fontiUsate: any[] | undefined = undefined;
    let cacheHit: "none" | "exact" | "semantic" = "none";

    const isSocialOrGreeting = ["greeting", "small_talk", "thanks", "farewell", "capability_question", "ambiguous"].includes(intent);

    if (isSocialOrGreeting) {
      // Bypasses Ollama and RAG completely for social / capability replies (0ms, extremely natural)
      finalAnswer = SocialResponses.generateSocialReply(intent);
      reason = "social_bypass";
      durationMs = 0;
    } else if (intent === "domain_question_with_greeting") {
      // MISTO: Saluto + Domanda
      const { greeting, question } = SocialResponses.splitGreetingAndQuestion(inputText);
      
      // Clean query input for RAG history context: replaces combined query with only question to focus the LLM
      const updatedHistory = [...history, { ...userMessage, testo: question }].map(m => ({
        role: m.mittente === "utente" ? "utente" as const : "assistente" as const,
        testo: m.testo
      }));

      // Generate answer using only the question part
      const result = await ModelRouter.generateAnswerSecure(updatedHistory, question);
      
      // Prepend greeting ack to the generated LLM text
      finalAnswer = `${greeting} ${result.text}`;
      modelUsed = result.modelUsed;
      reason = result.reason;
      ragActive = result.ragActive;
      durationMs = result.durationMs;
      inputRiskScore = result.inputRiskScore || 0;
      ragRiskScore = result.ragRiskScore || 0;
      quarantinedChunksCount = result.quarantinedChunksCount || 0;
      outputBlocked = result.outputBlocked || false;
      fontiUsate = result.fontiUsate;
      cacheHit = result.cacheHitType || "none";
    } else {
      // PURE DOMAIN QUESTION
      const updatedHistory = [...history, userMessage].map(m => ({
        role: m.mittente === "utente" ? "utente" as const : "assistente" as const,
        testo: m.testo
      }));

      const result = await ModelRouter.generateAnswerSecure(updatedHistory, inputText);
      
      finalAnswer = result.text;
      modelUsed = result.modelUsed;
      reason = result.reason;
      ragActive = result.ragActive;
      durationMs = result.durationMs;
      inputRiskScore = result.inputRiskScore || 0;
      ragRiskScore = result.ragRiskScore || 0;
      quarantinedChunksCount = result.quarantinedChunksCount || 0;
      outputBlocked = result.outputBlocked || false;
      fontiUsate = result.fontiUsate;
      cacheHit = result.cacheHitType || "none";
    }

    // 4. Contextual app deep-linking analyzer based on the answer/query text
    let linkInterno: string | undefined;
    let linkTesto: string | undefined;
    let suggerimenti: string[] = [
      "Come posso iniziare una guida?",
      "Quali sono le mie scadenze?",
      "Dove trovo i miei documenti?"
    ];

    const lowercaseAnswer = finalAnswer.toLowerCase();
    const lowercaseQuery = inputText.toLowerCase();

    if (lowercaseAnswer.includes("scadenz") || lowercaseAnswer.includes("calendar") || lowercaseQuery.includes("scadenz")) {
      linkInterno = "scadenze";
      linkTesto = "Apri Calendario Scadenze";
      suggerimenti = ["Come inserisco una scadenza?", "Quali guide ci sono?"];
    } else if (lowercaseAnswer.includes("document") || lowercaseAnswer.includes("archivio") || lowercaseQuery.includes("document")) {
      linkInterno = "documenti";
      linkTesto = "Apri Archivio Documenti";
      suggerimenti = ["Ho caricato il codice fiscale?", "Quali requisiti servono?"];
    } else if (lowercaseAnswer.includes("catalogo") || lowercaseAnswer.includes("guida") || lowercaseQuery.includes("guida")) {
      linkInterno = "servizi";
      linkTesto = "Catalogo delle Guide";
      suggerimenti = ["Come inizio la guida SPID?", "Quali documenti ho già caricato?"];
    } else if (lowercaseAnswer.includes("profilo") || lowercaseAnswer.includes("comune") || lowercaseQuery.includes("comune")) {
      linkInterno = "profilo";
      linkTesto = "Apri Profilo Utente";
      suggerimenti = ["Come cambio residenza?", "Impostazioni di SDIT"];
    } else if (lowercaseAnswer.includes("impostazioni") || lowercaseQuery.includes("timeout") || lowercaseQuery.includes("ollama")) {
      linkInterno = "impostazioni";
      linkTesto = "Impostazioni di SDIT";
      suggerimenti = [COPY_SUGGESTIONS.configEngine, COPY_SUGGESTIONS.recommendedSettings];
    }

    // 5. Create assistant message with observation metadata
    const assistantMessage: Messaggio = {
      id: `msg-ast-${Date.now()}`,
      mittente: "assistente",
      testo: finalAnswer,
      timestamp,
      linkInterno,
      linkTesto,
      suggerimenti,
      modelloUsato: modelUsed,
      motivoRouting: reason,
      ragAttivo: ragActive,
      durataMs: durationMs,
      inputRiskScore,
      ragRiskScore,
      quarantinedChunksCount,
      outputBlocked,
      fontiUsate,
      cacheHitType: cacheHit
    };

    return {
      userMessage,
      assistantMessage
    };
  }
}
