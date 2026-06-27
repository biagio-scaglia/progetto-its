import { computeRiskScore } from "../utils/trustScore";
import { COPY_SECURITY } from "../config/microcopy";

export interface OutputGuardResult {
  isValid: boolean;
  sanitizedOutput: string;
  reasons: string[];
}

export class OutputGuard {
  /**
   * Scans model output to detect prompt leaks, system policy exposure, and hallucinated commands.
   */
  static validateModelOutput(
    output: string,
    context: string,
    protectionLevel: "standard" | "strict"
  ): OutputGuardResult {
    const reasons: string[] = [];
    let isValid = true;
    let sanitizedOutput = output;

    if (!output) {
      return { isValid: true, sanitizedOutput: "", reasons: [] };
    }

    // 1. Scan for system policy leaks (e.g. if the output repeats standard system boundary labels)
    const systemLeakPatterns = [
      /\[ISTRUZIONI\s+DI\s+SISTEMA\]/i,
      /\[REGOLAMENTO\s+DI\s+SICUREZZA\]/i,
      /system\s+policy/i,
      /developer\s+constraints/i,
      /you\s+are\s+Guida\s+SDIT/i,
      /rules\s+for\s+response/i
    ];

    for (const pattern of systemLeakPatterns) {
      if (pattern.test(output)) {
        isValid = false;
        reasons.push(`Rilevata esposizione potenziale delle policy interne tramite pattern: ${pattern.source}`);
      }
    }

    // 2. Risk scoring on the output (detect if the model echoed prompt override rules)
    const riskAnalysis = computeRiskScore(output);
    const thresholdBlock = protectionLevel === "strict" ? 0.35 : 0.65;

    if (riskAnalysis.score >= thresholdBlock) {
      isValid = false;
      reasons.push(`Risposta modello classificata ad alto rischio (${riskAnalysis.score.toFixed(2)})`);
    }

    // 3. Evasion checks (prevent echo attacks where the model repeats system code or instructions)
    if (output.includes("<|im_start|>") || output.includes("<|system|>")) {
      isValid = false;
      reasons.push("Rilevato leaking di token speciali del template di chat.");
    }

    // 4. Grounding Check: If strict, make sure we don't hallucinate links that are not in context
    if (protectionLevel === "strict") {
      const urlRegex = /https?:\/\/[^\s]+/g;
      const foundUrls = output.match(urlRegex) || [];
      for (const url of foundUrls) {
        // Clean URL punctuation
        const cleanUrl = url.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"']/g, "");
        if (!context.includes(cleanUrl)) {
          // Sanitization: remove the hallucinated URL to prevent exfiltration
          sanitizedOutput = sanitizedOutput.replace(url, COPY_SECURITY.linkRemoved);
          reasons.push(`Rimossa URL non verificata nel contesto locale: ${cleanUrl}`);
        }
      }
    }

    if (!isValid) {
      sanitizedOutput = COPY_SECURITY.outputBlocked;
    }

    return {
      isValid,
      sanitizedOutput,
      reasons
    };
  }
}
