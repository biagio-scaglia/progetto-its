import { Messaggio } from "../types";
import { RagService } from "./ragService";
import { ModelRouter } from "./modelRouter";

export class ChatService {
  /**
   * Processes a user message, runs local index updates, queries the ModelRouter,
   * detects contextual application deep links, and yields the final message pair.
   */
  static async processMessage(
    inputText: string,
    history: Messaggio[],
    modelMode: "auto" | "phi" | "qwen"
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

    // 3. Prepare chat history format for the router
    const updatedHistory = [...history, userMessage].map(m => ({
      role: m.mittente === "utente" ? "utente" as const : "assistente" as const,
      testo: m.testo
    }));

    // 4. Generate answer via local model router
    const result = await ModelRouter.generateAnswer(updatedHistory, modelMode, inputText);

    // 5. Contextual app deep-linking analyzer (maintaining simulated parity)
    let linkInterno: string | undefined;
    let linkTesto: string | undefined;
    let suggerimenti: string[] = [
      "Come posso iniziare una guida?",
      "Quali sono le mie scadenze?",
      "Dove trovo i miei documenti?"
    ];

    const lowercaseAnswer = result.text.toLowerCase();
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
      suggerimenti = ["Come configuro Ollama?", "Che modello consigli?"];
    }

    // 6. Create assistant message with observation metadata
    const assistantMessage: Messaggio = {
      id: `msg-ast-${Date.now()}`,
      mittente: "assistente",
      testo: result.text,
      timestamp,
      linkInterno,
      linkTesto,
      suggerimenti,
      modelloUsato: result.modelUsed,
      motivoRouting: result.reason,
      ragAttivo: result.ragActive,
      durataMs: result.durationMs
    };

    return {
      userMessage,
      assistantMessage
    };
  }
}
