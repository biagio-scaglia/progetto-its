import { Documento } from "../types";
import { DOCUMENTI_MOCK } from "../mockData";

const STORAGE_KEY = "servizidigitali_documenti";

/**
 * Gestisce la persistenza locale dell'archivio documenti del cittadino.
 */
export class DocumentiRepository {
  /**
   * Carica i documenti memorizzati in locale. Se assenti, inizializza con i dati mock.
   */
  static getDocumenti(): Documento[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveDocumenti(DOCUMENTI_MOCK);
        return DOCUMENTI_MOCK;
      }
      return JSON.parse(data) as Documento[];
    } catch (error) {
      console.error("Errore durante il caricamento dei documenti locali:", error);
      return DOCUMENTI_MOCK;
    }
  }

  /**
   * Salva l'elenco aggiornato dei documenti nel database locale.
   */
  static saveDocumenti(documenti: Documento[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documenti));
    } catch (error) {
      console.error("Errore durante la scrittura dei documenti locali:", error);
    }
  }

  /**
   * Rimuove i documenti salvati in locale (reset).
   */
  static clearDocumenti(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante il reset dei documenti locali:", error);
    }
  }
}
