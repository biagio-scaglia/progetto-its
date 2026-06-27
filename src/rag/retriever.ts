import { Embedder } from "./embedder";
import { VectorStore } from "./vectorStore";
import { RetrievalResult, RAGOptions } from "./types";
import { filterByScore, selectDiverseSources } from "./scoring";
import { deduplicateChunks } from "./deduplicate";

export class Retriever {
  /**
   * Computes the dot product of two vectors (equivalent to Cosine Similarity for normalized vectors).
   */
  static dotProduct(a: number[], b: number[]): number {
    let product = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      product += a[i] * b[i];
    }
    return product;
  }

  /**
   * Searches the vector store for the top-k most similar chunks, applying filters,
   * deduplication, and diversity selection (balancing document representation).
   */
  static async searchRelevantChunks(
    query: string,
    options: RAGOptions = {}
  ): Promise<RetrievalResult[]> {
    const finalTopK = options.topK ?? 5;
    const threshold = options.similarityThreshold ?? 0.30; // Min score threshold
    const maxPerDoc = options.maxPerDocument ?? 2; // Max chunks per single document

    // 1. Generate normalized embedding for the query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await Embedder.embedText(query);
    } catch (e) {
      console.error("[Retriever] Errore di generazione embedding per la query:", e);
      return [];
    }

    const chunks = VectorStore.getChunks();
    const rawResults: RetrievalResult[] = [];

    // 2. Compute similarity with each chunk
    for (const chunk of chunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        continue;
      }

      const score = this.dotProduct(queryEmbedding, chunk.embedding);
      rawResults.push({ chunk, score });
    }

    // 3. Sort raw matches descending
    rawResults.sort((a, b) => b.score - a.score);

    // 4. Apply min score filter
    const filtered = filterByScore(rawResults, threshold);

    // 5. Apply near-duplicate deduplication
    const deduplicated = deduplicateChunks(filtered);

    // 6. Apply diversity source balancing (cap per document and total topK)
    const diverse = selectDiverseSources(deduplicated, finalTopK, maxPerDoc);

    return diverse;
  }
}
