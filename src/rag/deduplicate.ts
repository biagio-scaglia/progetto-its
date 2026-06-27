import { RetrievalResult } from "./types";

/**
 * Helper to compute dot product of two normalized vectors (cosine similarity).
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let product = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    product += a[i] * b[i];
  }
  return product;
}

/**
 * Computes Jaccard word-level similarity between two strings (0.0 to 1.0).
 */
function jaccardSimilarity(textA: string, textB: string): number {
  const words = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 1)
    );

  const setA = words(textA);
  const setB = words(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = setA.size + setB.size - intersectionSize;
  return intersectionSize / unionSize;
}

/**
 * Deduplicates retrieved chunks that are semantically or textually nearly identical.
 * Keeps the chunk with the highest score.
 */
export function deduplicateChunks(chunks: RetrievalResult[]): RetrievalResult[] {
  const result: RetrievalResult[] = [];

  for (const item of chunks) {
    let isDuplicate = false;

    for (const accepted of result) {
      // 1. Embedding-based check (if both have embeddings)
      if (
        item.chunk.embedding &&
        item.chunk.embedding.length > 0 &&
        accepted.chunk.embedding &&
        accepted.chunk.embedding.length > 0
      ) {
        const similarity = cosineSimilarity(
          item.chunk.embedding,
          accepted.chunk.embedding
        );
        if (similarity > 0.88) {
          isDuplicate = true;
          break;
        }
      }

      // 2. Text-based Jaccard fallback check (if either lacks embeddings)
      const textSimilarity = jaccardSimilarity(
        item.chunk.text,
        accepted.chunk.text
      );
      if (textSimilarity >= 0.40) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result;
}
