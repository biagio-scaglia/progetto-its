import { MessageIntent } from "./intentClassifier";

const GREETING_REPLIES = [
  "Ciao! Come posso esserti utile oggi?",
  "Buongiorno! Di cosa hai bisogno?",
  "Salve! Sono pronto ad aiutarti con i servizi digitali.",
  "Eccomi! Come posso aiutarti?"
];

const SMALL_TALK_REPLIES = [
  "Sto bene, grazie! Come posso aiutarti?",
  "Tutto bene, grazie. Dimmi pure.",
  "Bene, grazie! Sono qui per aiutarti."
];

const THANKS_REPLIES = [
  "Prego! Sono a tua disposizione.",
  "Di nulla! Se hai altre domande, chiedi pure.",
  "Grazie a te! Spero di esserti stato utile."
];

const FAREWELL_REPLIES = [
  "Arrivederci! A presto.",
  "Ciao! Buona giornata e a risentirci.",
  "A presto! Se avrai ancora bisogno di aiuto, sono qui."
];

const CAPABILITY_REPLIES = [
  "Posso aiutarti a orientarti ed ottenere servizi pubblici digitali italiani (come SPID, CIE, ISEE, cambi di residenza), verificare le tue scadenze o archiviare i tuoi documenti locali.",
  "Ti posso guidare passo-passo nelle procedure di attivazione di SPID e CIE, aiutarti con le scadenze importanti o memorizzare in sicurezza documenti ed attestati ISEE.",
  "Sono qui per supportarti nella compilazione di pratiche locali, ricordarti le scadenze e indicarti i passaggi ufficiali per i servizi pubblici online."
];

export class SocialResponses {
  /**
   * Generates a random response from a pre-defined array.
   */
  private static getRandomReply(replies: string[]): string {
    const idx = Math.floor(Math.random() * replies.length);
    return replies[idx];
  }

  /**
   * Generates a natural conversational reply for social intents (0ms bypass).
   */
  static generateSocialReply(intent: MessageIntent): string {
    switch (intent) {
      case "greeting":
        return this.getRandomReply(GREETING_REPLIES);
      case "small_talk":
        return this.getRandomReply(SMALL_TALK_REPLIES);
      case "thanks":
        return this.getRandomReply(THANKS_REPLIES);
      case "farewell":
        return this.getRandomReply(FAREWELL_REPLIES);
      case "capability_question":
        return this.getRandomReply(CAPABILITY_REPLIES);
      case "ambiguous":
        return "Non sono sicuro di aver capito. Potresti riformulare la tua richiesta o dirmi con quale servizio digitale (es. SPID, CIE, residenza) hai bisogno di aiuto?";
      default:
        return "Sono a tua disposizione. Dimmi pure di cosa hai bisogno.";
    }
  }

  /**
   * Splits a combined message (e.g. "Ciao, come faccio lo SPID?") into greeting and domain question parts.
   */
  static splitGreetingAndQuestion(message: string): { greeting: string; question: string } {
    const text = message.trim();
    const lower = text.toLowerCase();
    
    // Find index of first punctuation separator
    const splitIndex = text.search(/[,;!.]/);
    
    if (splitIndex !== -1 && splitIndex < 15) { // Ensure greeting part is short
      const greetingPart = text.substring(0, splitIndex + 1).trim();
      const questionPart = text.substring(splitIndex + 1).trim();
      
      if (questionPart.length > 2) {
        return { greeting: greetingPart, question: questionPart };
      }
    }
    
    // Fallback search based on greeting words
    const greetings = ["ciao", "buongiorno", "buonasera", "salve", "ehi", "buondì", "buondi"];
    for (const g of greetings) {
      if (lower.startsWith(g)) {
        const gLength = g.length;
        const questionPart = text.substring(gLength).replace(/^[,\s;!.]+/, "").trim();
        if (questionPart.length > 2) {
          const rawGreeting = text.substring(0, gLength);
          // Capitalize first letter of raw greeting
          const capitalizedGreeting = rawGreeting.charAt(0).toUpperCase() + rawGreeting.slice(1);
          return { greeting: `${capitalizedGreeting}!`, question: questionPart };
        }
      }
    }
    
    return { greeting: "Ciao!", question: text };
  }
}
