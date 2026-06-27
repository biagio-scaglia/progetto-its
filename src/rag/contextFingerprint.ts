import { CacheKeys } from "../cache/cacheKeys";

export class ContextFingerprint {
  /**
   * Computes context fingerprint on retrieved chunks using deterministic CacheKeys hashing.
   */
  static async compute(
    chunks: { filePath: string; sectionTitle?: string; text: string }[]
  ): Promise<string> {
    return CacheKeys.computeRagFingerprint(chunks);
  }
}
