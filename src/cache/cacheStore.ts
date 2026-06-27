export interface ExactCacheEntry {
  key: string;
  response: {
    text: string;
    modelUsed: string;
    fontiUsate?: any[];
  };
  metadata: {
    timestamp: number;
    ttlMs: number;
    model: string;
    ragFingerprint: string;
  };
}

export interface SemanticCacheEntry {
  query: string;
  embedding: number[];
  response: {
    text: string;
    modelUsed: string;
    fontiUsate?: any[];
  };
  metadata: {
    timestamp: number;
    ttlMs: number;
    model: string;
    ragFingerprint: string;
    systemPrompt: string;
    safeMode: boolean;
    protectionLevel: string;
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  semanticHits: number;
  expired: number;
  invalidated: number;
}

const EXACT_KEY = "sdit_exact_cache";
const SEMANTIC_KEY = "sdit_semantic_cache";
const STATS_KEY = "sdit_cache_stats";
const MAX_EXACT_ENTRIES = 200;
const MAX_SEMANTIC_ENTRIES = 100;

export class CacheStore {
  /**
   * Retrieves current cache statistics.
   */
  static getStats(): CacheStats {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read cache stats:", e);
    }
    return { hits: 0, misses: 0, semanticHits: 0, expired: 0, invalidated: 0 };
  }

  /**
   * Saves cache statistics.
   */
  static saveStats(stats: CacheStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save cache stats:", e);
    }
  }

  /**
   * Increments a specific cache metric counter.
   */
  static incrementStat(key: keyof CacheStats): void {
    const stats = this.getStats();
    stats[key]++;
    this.saveStats(stats);
  }

  /**
   * Resets all cache statistics.
   */
  static resetStats(): void {
    this.saveStats({ hits: 0, misses: 0, semanticHits: 0, expired: 0, invalidated: 0 });
  }

  /**
   * Retrieves all exact cache entries.
   */
  static getExactEntries(): Record<string, ExactCacheEntry> {
    try {
      const stored = localStorage.getItem(EXACT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read exact cache:", e);
    }
    return {};
  }

  /**
   * Saves exact cache entries.
   */
  static saveExactEntries(entries: Record<string, ExactCacheEntry>): void {
    try {
      localStorage.setItem(EXACT_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save exact cache:", e);
    }
  }

  /**
   * Retrieves a specific exact cache entry, checking TTL.
   */
  static getExact(key: string): ExactCacheEntry | null {
    const entries = this.getExactEntries();
    const entry = entries[key];
    if (!entry) return null;

    const isExpired = Date.now() - entry.metadata.timestamp > entry.metadata.ttlMs;
    if (isExpired) {
      this.incrementStat("expired");
      this.deleteExact(key);
      return null;
    }

    return entry;
  }

  /**
   * Stores an exact cache entry, enforcing LRU size limits.
   */
  static setExact(
    key: string,
    response: ExactCacheEntry["response"],
    metadata: { ttlMs: number; model: string; ragFingerprint: string }
  ): void {
    const entries = this.getExactEntries();
    
    // LRU Eviction
    const keys = Object.keys(entries);
    if (keys.length >= MAX_EXACT_ENTRIES) {
      keys.sort((a, b) => entries[a].metadata.timestamp - entries[b].metadata.timestamp);
      delete entries[keys[0]]; // remove oldest
    }

    entries[key] = {
      key,
      response,
      metadata: {
        timestamp: Date.now(),
        ttlMs: metadata.ttlMs,
        model: metadata.model,
        ragFingerprint: metadata.ragFingerprint,
      },
    };

    this.saveExactEntries(entries);
  }

  /**
   * Deletes a specific exact cache entry.
   */
  static deleteExact(key: string): void {
    const entries = this.getExactEntries();
    if (entries[key]) {
      delete entries[key];
      this.saveExactEntries(entries);
    }
  }

  /**
   * Retrieves all semantic cache entries.
   */
  static getSemanticEntries(): SemanticCacheEntry[] {
    try {
      const stored = localStorage.getItem(SEMANTIC_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read semantic cache:", e);
    }
    return [];
  }

  /**
   * Saves semantic cache entries.
   */
  static saveSemanticEntries(entries: SemanticCacheEntry[]): void {
    try {
      localStorage.setItem(SEMANTIC_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save semantic cache:", e);
    }
  }

  /**
   * Stores a semantic cache entry, enforcing LRU size limits.
   */
  static setSemantic(
    query: string,
    embedding: number[],
    response: SemanticCacheEntry["response"],
    metadata: {
      ttlMs: number;
      model: string;
      ragFingerprint: string;
      systemPrompt: string;
      safeMode: boolean;
      protectionLevel: string;
    }
  ): void {
    const entries = this.getSemanticEntries();

    // LRU Eviction
    if (entries.length >= MAX_SEMANTIC_ENTRIES) {
      entries.sort((a, b) => a.metadata.timestamp - b.metadata.timestamp);
      entries.shift(); // remove oldest
    }

    entries.push({
      query,
      embedding,
      response,
      metadata: {
        timestamp: Date.now(),
        ttlMs: metadata.ttlMs,
        model: metadata.model,
        ragFingerprint: metadata.ragFingerprint,
        systemPrompt: metadata.systemPrompt,
        safeMode: metadata.safeMode,
        protectionLevel: metadata.protectionLevel,
      },
    });

    this.saveSemanticEntries(entries);
  }

  /**
   * Clear all cache data.
   */
  static invalidateAll(): void {
    localStorage.removeItem(EXACT_KEY);
    localStorage.removeItem(SEMANTIC_KEY);
    this.incrementStat("invalidated");
    console.log("[CacheStore] All cached entries invalidated.");
  }
}
