import { CacheKeys } from "./cacheKeys";
import { CacheStore } from "./cacheStore";

export class ExactCache {
  /**
   * Search for exact hit matching query and environmental settings keys.
   */
  static async find(input: {
    model: string;
    systemPrompt: string;
    query: string;
    safeMode: boolean;
    protectionLevel: string;
    ragFingerprint: string;
    temperature: number;
  }): Promise<{ text: string; modelUsed: string; fontiUsate?: any[] } | null> {
    const normQuery = CacheKeys.normalizeUserPrompt(input.query);
    const key = await CacheKeys.buildExactCacheKey({
      ...input,
      normalizedQuery: normQuery,
    });

    const entry = CacheStore.getExact(key);
    if (entry) {
      CacheStore.incrementStat("hits");
      console.log(`[ExactCache] Hit found for key: ${key}`);
      return entry.response;
    }
    return null;
  }

  /**
   * Caches an execution response under exact keys parameters.
   */
  static async store(
    input: {
      model: string;
      systemPrompt: string;
      query: string;
      safeMode: boolean;
      protectionLevel: string;
      ragFingerprint: string;
      temperature: number;
      ttlMs: number;
    },
    response: { text: string; modelUsed: string; fontiUsate?: any[] }
  ): Promise<void> {
    const normQuery = CacheKeys.normalizeUserPrompt(input.query);
    const key = await CacheKeys.buildExactCacheKey({
      ...input,
      normalizedQuery: normQuery,
    });

    CacheStore.setExact(key, response, {
      ttlMs: input.ttlMs,
      model: input.model,
      ragFingerprint: input.ragFingerprint,
    });
    console.log(`[ExactCache] Stored entry for key: ${key}`);
  }
}
