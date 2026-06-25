import { Scadenza } from "../types";
import { SCADENZE_MOCK } from "../mockData";

const STORAGE_KEY = "servizidigitali_scadenze";

/**
 * Gestisce la persistenza locale dell'elenco scadenze dell'utente.
 */
export class ScadenzeRepository {
  /**
   * Carica le scadenze memorizzate in locale. Se assenti, inizializza con i dati mock.
   */
  static getScadenze(): Scadenza[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveScadenze(SCADENZE_MOCK);
        return SCADENZE_MOCK;
      }
      return JSON.parse(data) as Scadenza[];
    } catch (error) {
      console.error("Errore durante il caricamento delle scadenze locali:", error);
      return SCADENZE_MOCK;
    }
  }

  /**
   * Salva l'elenco delle scadenze nel database locale.
   */
  static saveScadenze(scadenze: Scadenza[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scadenze));
    } catch (error) {
      console.error("Errore durante la scrittura delle scadenze locali:", error);
    }
  }

  /**
   * Rimuove le scadenze salvate in locale (reset).
   */
  static clearScadenze(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante il reset delle scadenze locali:", error);
    }
  }
}
