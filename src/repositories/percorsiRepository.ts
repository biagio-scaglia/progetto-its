import { Percorso } from "../types";
import { PERCORSI_MOCK } from "../mockData";

const STORAGE_KEY = "servizidigitali_percorsi";

/**
 * Gestisce la persistenza locale dei percorsi di guida del cittadino.
 */
export class PercorsiRepository {
  /**
   * Carica i percorsi memorizzati in locale. Se assenti, inizializza con i dati mock.
   */
  static getPercorsi(): Percorso[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.savePercorsi(PERCORSI_MOCK);
        return PERCORSI_MOCK;
      }
      return JSON.parse(data) as Percorso[];
    } catch (error) {
      console.error("Errore durante il caricamento dei percorsi locali:", error);
      return PERCORSI_MOCK;
    }
  }

  /**
   * Salva l'elenco aggiornato dei percorsi nel database locale.
   */
  static savePercorsi(percorsi: Percorso[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(percorsi));
    } catch (error) {
      console.error("Errore durante la scrittura dei percorsi locali:", error);
    }
  }

  /**
   * Rimuove i percorsi salvati in locale (reset).
   */
  static clearPercorsi(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante il reset dei percorsi locali:", error);
    }
  }
}
