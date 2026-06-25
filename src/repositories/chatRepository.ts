import { Messaggio } from "../types";
import { ASSISTENTE_INITIAL_MESSAGGI } from "../mockData";

const STORAGE_KEY = "servizidigitali_chat";

/**
 * Gestisce la persistenza locale della cronologia chat con l'Assistente.
 */
export class ChatRepository {
  /**
   * Carica la cronologia dei messaggi. Se assente, inizializza con i messaggi di default.
   */
  static getMessaggi(): Messaggio[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveMessaggi(ASSISTENTE_INITIAL_MESSAGGI);
        return ASSISTENTE_INITIAL_MESSAGGI;
      }
      return JSON.parse(data) as Messaggio[];
    } catch (error) {
      console.error("Errore durante il caricamento dei messaggi locali:", error);
      return ASSISTENTE_INITIAL_MESSAGGI;
    }
  }

  /**
   * Salva la cronologia completa dei messaggi nel database locale.
   */
  static saveMessaggi(messaggi: Messaggio[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messaggi));
    } catch (error) {
      console.error("Errore durante la scrittura dei messaggi locali:", error);
    }
  }

  /**
   * Rimuove la cronologia dei messaggi salvata in locale (reset).
   */
  static clearMessaggi(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante il reset della chat locale:", error);
    }
  }
}
