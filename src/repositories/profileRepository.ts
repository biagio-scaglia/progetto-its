import { ProfiloUtente } from "../types";

// Chiave di persistenza in localStorage
const STORAGE_KEY = "servizidigitali_profilo_utente";

// Timestamp per limitare la frequenza delle scritture (rate-limiting a livello di persistenza)
let lastWriteTime = 0;
const WRITE_THROTTLE_MS = 500; // Mezzo secondo di intervallo minimo tra scritture consecutive

/**
 * Rileva la presenza di caratteri emoji all'interno di una stringa.
 */
export function contieneEmoji(testo: string): boolean {
  const emojiRegex = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
  return emojiRegex.test(testo);
}

/**
 * Rimuove le emoji da una stringa.
 */
export function rimuoviEmoji(testo: string): string {
  const emojiRegex = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
  return testo.replace(emojiRegex, "").trim();
}

export class ProfileRepository {
  /**
   * Recupera il profilo utente salvato localmente.
   * Se non esiste alcun profilo, ritorna null.
   */
  static getProfile(): ProfiloUtente | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      if (this.validaStruttura(parsed)) {
        return parsed as ProfiloUtente;
      }
      return null;
    } catch (error) {
      console.error("Errore durante la lettura del profilo locale:", error);
      return null;
    }
  }

  /**
   * Salva o aggiorna il profilo utente applicando validazioni e rate-limiting.
   */
  static saveProfile(profilo: ProfiloUtente): void {
    // 1. Rate-limiting anti-spam delle scritture
    const ora = Date.now();
    if (ora - lastWriteTime < WRITE_THROTTLE_MS) {
      console.warn("Scrittura profilo ignorata per rate-limiting (richieste troppo frequenti).");
      return;
    }
    lastWriteTime = ora;

    // 2. Validazione di base
    if (!profilo.nome.trim() || !profilo.cognome.trim() || !profilo.comune.trim()) {
      throw new Error("I campi Nome, Cognome e Comune sono obbligatori per il funzionamento dell'app.");
    }

    // 3. Controllo rigoroso contro le emoji (requisito vincolante)
    if (
      contieneEmoji(profilo.nome) || 
      contieneEmoji(profilo.cognome) || 
      contieneEmoji(profilo.comune) || 
      (profilo.provincia && contieneEmoji(profilo.provincia)) ||
      (profilo.email && contieneEmoji(profilo.email)) ||
      (profilo.cellulare && contieneEmoji(profilo.cellulare))
    ) {
      throw new Error("Non e' consentito l'uso di simboli grafici o emoji nei campi del profilo.");
    }

    // 4. Validazione formato email se presente
    if (profilo.email && profilo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profilo.email.trim())) {
        throw new Error("L'indirizzo email inserito non ha un formato valido.");
      }
    }

    // 5. Validazione numero di cellulare se presente (numeri, spazi e +)
    if (profilo.cellulare && profilo.cellulare.trim()) {
      const cellRegex = /^\+?[0-9\s\-]+$/;
      if (!cellRegex.test(profilo.cellulare.trim())) {
        throw new Error("Il numero di cellulare puo' contenere solo cifre, spazi, trattini o il prefisso '+'.");
      }
    }

    // 6. Persistenza locale
    try {
      const cleanProfile: ProfiloUtente = {
        nome: profilo.nome.trim(),
        cognome: profilo.cognome.trim(),
        comune: profilo.comune.trim(),
        provincia: profilo.provincia?.trim().toUpperCase(),
        email: profilo.email?.trim(),
        cellulare: profilo.cellulare?.trim(),
        onboardingCompletato: profilo.onboardingCompletato,
        consensoPrivacy: profilo.consensoPrivacy,
        consensoGeolocalizzazione: profilo.consensoGeolocalizzazione,
        dataRegistrazione: profilo.dataRegistrazione || new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProfile));
    } catch (error) {
      console.error("Impossibile scrivere il profilo in localStorage:", error);
      throw new Error("Errore hardware di scrittura locale della configurazione.");
    }
  }

  /**
   * Elimina completamente il profilo locale e le impostazioni associate.
   */
  static clearProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante la cancellazione del profilo locale:", error);
    }
  }

  /**
   * Rimuove in modo permanente tutti i dati dell'applicazione dal dispositivo.
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("servizidigitali_percorsi");
      localStorage.removeItem("servizidigitali_documenti");
      localStorage.removeItem("servizidigitali_scadenze");
      localStorage.removeItem("servizidigitali_chat");
    } catch (error) {
      console.error("Errore durante il reset completo di tutti i dati applicativi:", error);
    }
  }

  /**
   * Helper per verificare la validità formale dell'oggetto caricato.
   */
  private static validaStruttura(obj: any): boolean {
    return (
      obj &&
      typeof obj === "object" &&
      typeof obj.nome === "string" &&
      typeof obj.cognome === "string" &&
      typeof obj.comune === "string" &&
      typeof obj.onboardingCompletato === "boolean" &&
      typeof obj.consensoPrivacy === "boolean" &&
      typeof obj.consensoGeolocalizzazione === "boolean"
    );
  }
}
