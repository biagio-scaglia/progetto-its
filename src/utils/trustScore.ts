import { INJECTION_PATTERNS } from "./riskPatterns";

/**
 * Computes risk score for a prompt or query (0.0 to 1.0).
 */
export function computeRiskScore(text: string): { score: number; matchedPatterns: string[] } {
  if (!text) return { score: 0, matchedPatterns: [] };

  let score = 0;
  const matchedPatterns: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      // Increase score dynamically: first match gets 0.4, subsequent matches add 0.2
      score = matchedPatterns.length === 0 ? 0.5 : Math.min(1.0, score + 0.25);
      matchedPatterns.push(pattern.source);
    }
  }

  // Check for suspicious substring sequences (e.g. repeated ignore keywords)
  const lowercase = text.toLowerCase();
  if (lowercase.includes("ignore") && (lowercase.includes("instruction") || lowercase.includes("rule"))) {
    if (score === 0) score = 0.4;
  }

  return {
    score,
    matchedPatterns
  };
}

/**
 * Trust level categories for RAG sources.
 */
export type TrustLevel = "high" | "medium" | "low";

/**
 * Computes trust score and trust level for a retrieved chunk based on metadata.
 */
export function computeChunkTrust(metadata: {
  source: string;
  type?: string;
}): { score: number; level: TrustLevel } {
  const source = metadata.source.toLowerCase();

  // High trust: Core system guides (mock DB, AgID official reference docs)
  if (source.includes("mock") || source.includes("servizi") || source.includes("guide_default")) {
    return { score: 0.95, level: "high" };
  }

  // Medium trust: Internal database records created by app (calendar/deadlines)
  if (source.includes("scadenze") || source.includes("calendar") || source.includes("percorso")) {
    return { score: 0.8, level: "medium" };
  }

  // Low trust: User-uploaded documents/files (PDFs, raw text from external storage)
  return { score: 0.35, level: "low" };
}
