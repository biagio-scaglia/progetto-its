import { sanitizeText } from "../utils/sanitizeText";
import { computeRiskScore } from "../utils/trustScore";

export interface InputGuardResult {
  score: number;
  flags: string[];
  decision: "allow" | "block" | "sanitize";
  reasons: string[];
  sanitizedInput: string;
}

export class InputGuard {
  /**
   * Sanitizes the raw user input text.
   */
  static sanitizeUserInput(userInput: string): string {
    return sanitizeText(userInput);
  }

  /**
   * Evaluates user input risk and makes a routing/filtering decision.
   */
  static detectPromptInjection(
    userInput: string,
    protectionLevel: "standard" | "strict"
  ): InputGuardResult {
    const sanitizedInput = this.sanitizeUserInput(userInput);
    
    // Detect risk on raw input to capture evasion attempts
    const rawAnalysis = computeRiskScore(userInput);
    // Also detect risk on sanitized input
    const cleanAnalysis = computeRiskScore(sanitizedInput);

    const score = Math.max(rawAnalysis.score, cleanAnalysis.score);
    const flags = Array.from(new Set([...rawAnalysis.matchedPatterns, ...cleanAnalysis.matchedPatterns]));

    let decision: "allow" | "block" | "sanitize" = "allow";
    const reasons: string[] = [];

    if (flags.length > 0) {
      reasons.push(`Pattern di injection trovati: ${flags.join(", ")}`);
    }

    const thresholdBlock = protectionLevel === "strict" ? 0.4 : 0.75;
    const thresholdSanitize = protectionLevel === "strict" ? 0.2 : 0.4;

    if (score >= thresholdBlock) {
      decision = "block";
      reasons.push(`Punteggio di rischio elevato (${score.toFixed(2)}) superiore alla soglia di blocco (${thresholdBlock})`);
    } else if (score >= thresholdSanitize) {
      decision = "sanitize";
      reasons.push(`Punteggio di rischio medio (${score.toFixed(2)}) superiore alla soglia di sanificazione (${thresholdSanitize})`);
    }

    return {
      score,
      flags,
      decision,
      reasons,
      sanitizedInput
    };
  }
}
