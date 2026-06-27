import { RetrievalResult } from "./types";

/**
 * Extracts and maps the actually cited sources in the AI's textual answer back to the provided chunks.
 * Handles citation formats like "[Fonte N]" or "[SOURCE N]".
 */
export function extractUsedSources(
  answer: string,
  providedSources: RetrievalResult[]
): RetrievalResult[] {
  if (!answer || providedSources.length === 0) {
    return [];
  }

  const regex = /\[(?:Fonte|SOURCE)\s+(\d+)\]/gi;
  const citedIndexes = new Set<number>();
  let match;

  while ((match = regex.exec(answer)) !== null) {
    const idx = parseInt(match[1], 10) - 1; // Convert to 0-indexed
    if (idx >= 0 && idx < providedSources.length) {
      citedIndexes.add(idx);
    }
  }

  // Preserve the list based on cited order, mapped to the corresponding RetrievalResult
  const usedSources: RetrievalResult[] = [];
  citedIndexes.forEach(idx => {
    usedSources.push(providedSources[idx]);
  });

  return usedSources;
}

export interface UiSourceFormat {
  visualId: number;
  fileName: string;
  section: string;
  score: number;
  preview: string;
  fullText: string;
  id: string;
}

/**
 * Formats a list of chunks into a structured structure suitable for rendering in the UI.
 * The visualId matches the 1-based index (e.g. [Fonte 1], [Fonte 2]...).
 */
export function formatSourcesForUi(
  chunks: RetrievalResult[]
): UiSourceFormat[] {
  return chunks.map((r, idx) => {
    const rawPath = r.chunk.filePath || "";
    // Clean up filename path
    const fileName = rawPath.split(/[/\\]/).pop() || rawPath || "Documento locale";
    
    // Create text preview (e.g., first 120 chars)
    const text = r.chunk.text || "";
    const preview = text.length > 120 ? text.substring(0, 117) + "..." : text;

    return {
      visualId: idx + 1,
      fileName,
      section: r.chunk.sectionTitle || "Contenuto generale",
      score: r.score,
      preview,
      fullText: text,
      id: r.chunk.id
    };
  });
}
