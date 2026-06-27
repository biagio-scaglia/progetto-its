import { CacheStore } from "./cacheStore";
import { Embedder } from "../rag/embedder";

const TEMPORAL_KEYWORDS = [
  "oggi", "adesso", "ora", "stiamo", "attualmente", "recente",
  "ultima versione", "aggiornato a", "quest'anno", "questo mese", "ieri", "domani"
];

export class SemanticCache {
  /**
   * Evaluates if query contains temporal variables that degrade over time.
   */
  static containsTemporalKeywords(text: string): boolean {
    const lower = text.toLowerCase();
    return TEMPORAL_KEYWORDS.some(kw => lower.includes(kw));
  }

  /**
   * Scans previous embeddings using dot-product cosine similarity.
   * Restricts reuse to identical safety and context parameters context models.
   */
  static async find(
    query: string,
    input: {
      model: string;
      systemPrompt: string;
      safeMode: boolean;
      protectionLevel: string;
      ragFingerprint: string;
      threshold: number;
    }
  ): Promise<{ text: string; modelUsed: string; fontiUsate?: any[] } | null> {
    if (this.containsTemporalKeywords(query)) {
      console.log(`[SemanticCache] Query contains temporal keywords. Skipping semantic search.`);
      return null;
    }

    try {
      const queryEmbedding = await Embedder.embedText(query);
      const entries = CacheStore.getSemanticEntries();
      
      let bestEntry: any = null;
      let bestSimilarity = -1;

      for (const entry of entries) {
        // 1. Verify RAG fingerprint, model and safety configurations compatibility
        if (
          entry.metadata.model !== input.model ||
          entry.metadata.ragFingerprint !== input.ragFingerprint ||
          entry.metadata.systemPrompt !== input.systemPrompt ||
          entry.metadata.safeMode !== input.safeMode ||
          entry.metadata.protectionLevel !== input.protectionLevel
        ) {
          continue;
        }

        // Check TTL expiration
        const isExpired = Date.now() - entry.metadata.timestamp > entry.metadata.ttlMs;
        if (isExpired) {
          continue;
        }

        // Calculate dot product (cosine similarity since embeddings are L2 normalized)
        let similarity = 0;
        const len = Math.min(queryEmbedding.length, entry.embedding.length);
        for (let i = 0; i < len; i++) {
          similarity += queryEmbedding[i] * entry.embedding[i];
        }

        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestEntry = entry;
        }
      }

      if (bestEntry && bestSimilarity >= input.threshold) {
        CacheStore.incrementStat("semanticHits");
        console.log(`[SemanticCache] Hit found with similarity ${bestSimilarity.toFixed(4)} (Threshold: ${input.threshold})`);
        return bestEntry.response;
      }
    } catch (e) {
      console.error("[SemanticCache] Error calculating semantic hits:", e);
    }

    return null;
  }

  /**
   * Saves execution response under query embedding key parameters.
   */
  static async store(
    query: string,
    response: { text: string; modelUsed: string; fontiUsate?: any[] },
    input: {
      model: string;
      systemPrompt: string;
      safeMode: boolean;
      protectionLevel: string;
      ragFingerprint: string;
      ttlMs: number;
    }
  ): Promise<void> {
    if (this.containsTemporalKeywords(query)) {
      return; // Do not store queries with temporal context
    }

    try {
      const embedding = await Embedder.embedText(query);
      CacheStore.setSemantic(query, embedding, response, input);
      console.log(`[SemanticCache] Stored entry for query: "${query}"`);
    } catch (e) {
      console.error("[SemanticCache] Failed to generate embedding for storage:", e);
    }
  }
}
