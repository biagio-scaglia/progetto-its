export class CacheKeys {
  /**
   * Normalizes the user query to make caching robust against minor space or capitalization differences.
   */
  static normalizeUserPrompt(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /**
   * Computes a deterministic SHA-256 fingerprint of the RAG context chunks.
   * Chunks are sorted by path/section to avoid ordering instability.
   */
  static async computeRagFingerprint(
    chunks: { filePath: string; sectionTitle?: string; text: string }[]
  ): Promise<string> {
    if (!chunks || chunks.length === 0) {
      return "no_context";
    }

    const sorted = [...chunks].sort((a, b) => {
      const pathA = a.filePath || "";
      const pathB = b.filePath || "";
      const secA = a.sectionTitle || "";
      const secB = b.sectionTitle || "";
      return pathA.localeCompare(pathB) || secA.localeCompare(secB);
    });

    const concatenated = sorted
      .map(c => `${c.filePath}:${c.sectionTitle || ""}:${c.text.substring(0, 100)}`)
      .join("|");

    return this.hashString(concatenated);
  }

  /**
   * Builds a unique SHA-256 key for exact matching.
   */
  static async buildExactCacheKey(input: {
    model: string;
    systemPrompt: string;
    normalizedQuery: string;
    safeMode: boolean;
    protectionLevel: string;
    ragFingerprint: string;
    temperature: number;
  }): Promise<string> {
    const raw = [
      input.model,
      input.systemPrompt,
      input.normalizedQuery,
      String(input.safeMode),
      input.protectionLevel,
      input.ragFingerprint,
      String(input.temperature),
    ].join("|");

    return this.hashString(raw);
  }

  /**
   * Helper to generate SHA-256 hash using native Web Crypto API.
   */
  private static async hashString(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
}
