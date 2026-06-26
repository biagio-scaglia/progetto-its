import { Embedder } from "./embedder";
import { VectorStore } from "./vectorStore";
import { RetrievalResult, RAGOptions } from "./types";

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
   * Searches the vector store for the top-k most similar chunks.
   */
  static async searchRelevantChunks(
    query: string,
    options: RAGOptions = {}
  ): Promise<RetrievalResult[]> {
    const topK = options.topK ?? 3;
    const threshold = options.similarityThreshold ?? 0.35; // Default safety threshold

    // 1. Generate normalized embedding for the query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await Embedder.embedText(query);
    } catch (e) {
      console.error("[Retriever] Errore di generazione embedding per la query:", e);
      return [];
    }

    const chunks = VectorStore.getChunks();
    const results: RetrievalResult[] = [];

    // 2. Compute similarity with each chunk
    for (const chunk of chunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        continue;
      }

      const score = this.dotProduct(queryEmbedding, chunk.embedding);
      if (score >= threshold) {
        results.push({ chunk, score });
      }
    }

    // 3. Sort by score descending and return topK
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
