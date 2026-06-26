export type MessageIntent =
  | "small_talk"
  | "greeting"
  | "thanks"
  | "farewell"
  | "capability_question"
  | "domain_question"
  | "domain_question_with_greeting"
  | "ambiguous"
  | "unsafe_or_injection";

const DOMAIN_KEYWORDS = [
  "spid", "cie", "pin", "puk", "residenza", "cambio", "domicilio", "isee", 
  "inps", "documento", "caricamento", "scadenze", "calendario", "ticket", 
  "sanita", "sanità", "tessera", "sanitaria", "guida", "anpr", "comune"
];

const GREETINGS = [
  "ciao", "buongiorno", "buonasera", "salve", "ehi", "buondì", "buondi", "hello"
];

export class IntentClassifier {
  /**
   * Fast client-side classification of user query intent using syntactic analysis and regex.
   */
  static classifyIntent(message: string): MessageIntent {
    const text = message.trim().toLowerCase();

    if (!text) {
      return "ambiguous";
    }

    // 1. Check for capability queries
    const capabilityRegex = /(?:cosa|che|quali)\s+(?:puoi|sai|sono|fai|aiuti|funzioni|guide)\s+(?:fare|utilizzare|utili|tue|servizio|servizi|mappa)/i;
    const capabilityKeywords = ["chi sei", "sei un robot", "cos'è sdit", "cose sdit", "presentati", "cosa offri", "cosa sai fare"];
    if (capabilityRegex.test(text) || capabilityKeywords.some(kw => text.includes(kw))) {
      return "capability_question";
    }

    // 2. Check for small talk / social conversation
    const smallTalkRegex = /(?:come\s+stai|come\s+va|tutto\s+bene|come\s+te\s+la\s+passi|tutto\s+apposto|sei\s+umano)/i;
    if (smallTalkRegex.test(text)) {
      return "small_talk";
    }

    // 3. Check for thanks
    const thanksKeywords = ["grazie", "grazie mille", "ti ringrazio", "ok grazie", "perfetto grazie", "molto gentile", "thx"];
    if (thanksKeywords.some(kw => text.includes(kw))) {
      return "thanks";
    }

    // 4. Check for farewells
    const farewellKeywords = ["arrivederci", "a presto", "ciao ciao", "ci vediamo", "addio", "buonanotte"];
    if (farewellKeywords.some(kw => text.includes(kw))) {
      return "farewell";
    }

    // 5. Check for domain keywords presence
    const hasDomainKeyword = DOMAIN_KEYWORDS.some(kw => text.includes(kw));

    // 6. Check for greeting presence
    const hasGreeting = GREETINGS.some(kw => {
      // Ensure the greeting is a distinct word
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      return regex.test(text);
    });

    if (hasGreeting && hasDomainKeyword) {
      return "domain_question_with_greeting";
    }

    if (hasGreeting) {
      return "greeting";
    }

    if (hasDomainKeyword) {
      return "domain_question";
    }

    // Default: if it's too short and doesn't match keywords, flag as ambiguous.
    // Otherwise, treat as domain_question to allow LLM to resolve with RAG.
    if (text.length < 3) {
      return "ambiguous";
    }

    return "domain_question";
  }
}
