import { RetrievalResult } from "./types";

/**
 * Filters chunks with a score below the specified minimum threshold.
 */
export function filterByScore(
  chunks: RetrievalResult[],
  minScore: number
): RetrievalResult[] {
  return chunks.filter(c => c.score >= minScore);
}

/**
 * Selects chunks, limiting the total count and ensuring that at most
 * maxPerDocument chunks are selected from the same document (filePath).
 * It preserves the sorted order by similarity score.
 */
export function selectDiverseSources(
  chunks: RetrievalResult[],
  maxChunks: number,
  maxPerDocument: number
): RetrievalResult[] {
  const selected: RetrievalResult[] = [];
  const counts: Record<string, number> = {};

  for (const item of chunks) {
    if (selected.length >= maxChunks) {
      break;
    }

    const docId = item.chunk.filePath || item.chunk.id;
    const currentCount = counts[docId] || 0;

    if (currentCount < maxPerDocument) {
      selected.push(item);
      counts[docId] = currentCount + 1;
    }
  }

  return selected;
}
