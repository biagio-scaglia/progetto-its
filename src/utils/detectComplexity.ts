/**
 * Analyzes the user's prompt to check if it's complex enough to require Qwen.
 * Returns true if complex, false otherwise.
 */
export function detectComplexity(prompt: string): boolean {
  const normalized = prompt.toLowerCase().trim();

  // 1. Length check: long prompt indicates complex multi-part requests
  if (normalized.length > 120) {
    return true;
  }

  // 2. Count questions: multiple questions in one prompt suggest multi-step processing
  const questionCount = (normalized.match(/\?/g) || []).length;
  if (questionCount >= 2) {
    return true;
  }

  // 3. Comparative keywords
  const comparativeKeywords = [
    "confronta",
    "confronto",
    "differenz",
    "rispetto a",
    "meglio",
    "peggio",
    "invece di",
    "alternativ",
    "versus",
    " vs "
  ];
  if (comparativeKeywords.some(kw => normalized.includes(kw))) {
    return true;
  }

  // 4. Strategic/Procedural keywords (planning / multi-step instructions)
  const planningKeywords = [
    "procedura",
    "passaggi",
    "fasi",
    "step",
    "istruzioni",
    "guida completa",
    "come fare per",
    "cosa succede se",
    "requisiti per",
    "prima",
    "dopo",
    "poi",
    "infine"
  ];
  if (planningKeywords.some(kw => normalized.includes(kw))) {
    return true;
  }

  // 5. Synthesis keywords (requesting summaries of multiple pieces of information)
  const synthesisKeywords = [
    "riassunto",
    "riassumi",
    "sintesi",
    "sintetizz",
    "panoramica",
    "spiegami in breve",
    "spiega dettagliatamente"
  ];
  if (synthesisKeywords.some(kw => normalized.includes(kw))) {
    return true;
  }

  // 6. Multilingual check (English terms or queries requesting translations/help in other languages)
  const multilingualKeywords = [
    "translate",
    "traduc",
    "inglese",
    "english",
    "language",
    "foreign",
    "stranier",
    "traduzione"
  ];
  if (multilingualKeywords.some(kw => normalized.includes(kw))) {
    return true;
  }

  // 7. Structured outputs
  const structureKeywords = [
    "tabella",
    "schema",
    "elenco",
    "lista",
    "punti",
    "elenca"
  ];
  if (structureKeywords.some(kw => normalized.includes(kw))) {
    return true;
  }

  return false;
}
