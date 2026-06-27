import { RetrievalResult } from "../services/ragService";
import { sanitizeText } from "../utils/sanitizeText";
import { computeRiskScore, computeChunkTrust, TrustLevel } from "../utils/trustScore";

export interface QuarantinedChunk {
  result: RetrievalResult;
  riskScore: number;
  trustScore: number;
  trustLevel: TrustLevel;
  reasons: string[];
}

export interface RagGuardResult {
  safeChunks: RetrievalResult[];
  quarantinedChunks: QuarantinedChunk[];
  report: string[];
}

export class RagGuard {
  /**
   * Evaluates a list of retrieved chunks, sanitizes their content, and quarantines high-risk items.
   */
  static inspectRetrievedChunks(
    chunks: RetrievalResult[],
    protectionLevel: "standard" | "strict"
  ): RagGuardResult {
    const safeChunks: RetrievalResult[] = [];
    const quarantinedChunks: QuarantinedChunk[] = [];
    const report: string[] = [];

    const thresholdQuarantine = protectionLevel === "strict" ? 0.3 : 0.6;

    for (const result of chunks) {
      const chunk = result.chunk;
      
      // 1. Sanitize the chunk text
      const cleanText = sanitizeText(chunk.text);
      
      // 2. Compute risk and trust scores
      const riskAnalysis = computeRiskScore(chunk.text);
      const cleanRiskAnalysis = computeRiskScore(cleanText);
      const riskScore = Math.max(riskAnalysis.score, cleanRiskAnalysis.score);

      const trustInfo = computeChunkTrust({
        source: chunk.type || "",
        type: chunk.type || ""
      });

      const chunkReasons: string[] = [];

      // 3. Evaluate safety
      if (riskScore >= thresholdQuarantine) {
        chunkReasons.push(
          `Rilevato rischio prompt override (${riskScore.toFixed(2)}) superiore alla soglia di quarantena (${thresholdQuarantine})`
        );
      }

      // Check if user document tries to act as a system file
      if (chunk.type === "user_document" && /ignore\s+instructions/i.test(chunk.text)) {
        chunkReasons.push("Documento utente non fidato contenente direttive di bypass.");
      }

      if (chunkReasons.length > 0) {
        quarantinedChunks.push({
          result,
          riskScore,
          trustScore: trustInfo.score,
          trustLevel: trustInfo.level,
          reasons: chunkReasons
        });
        report.push(`[Quarantena] Chunk ID: ${chunk.id} proveniente da "${chunk.title}" isolato. Motivi: ${chunkReasons.join("; ")}`);
      } else {
        // Safe: apply text sanitization to clean any HTML/tags
        const sanitizedResult: RetrievalResult = {
          ...result,
          chunk: {
            ...chunk,
            text: cleanText
          }
        };
        safeChunks.push(sanitizedResult);
      }
    }

    return {
      safeChunks,
      quarantinedChunks,
      report
    };
  }
}
