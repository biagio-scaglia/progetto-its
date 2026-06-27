import { RetrievalResult } from "./types";

export class ContextBuilder {
  /**
   * Formats retrieved vector search chunks into a unified context string.
   */
  static buildRagContext(retrieved: RetrievalResult[]): string {
    if (retrieved.length === 0) {
      return "Nessuna guida o documento ufficiale trovato nel database locale.";
    }

    return retrieved
      .map((r, idx) => {
        const filename = r.chunk.filePath.split(/[/\\]/).pop() || r.chunk.filePath;
        return `[Fonte ${idx + 1}: Guida - ${r.chunk.sectionTitle} (File: ${filename})] (Rilevanza: ${r.score.toFixed(3)})\n${r.chunk.text}`;
      })
      .join("\n\n");
  }

  /**
   * Builds structured citation-aware context with stable [SOURCE N] numbers and metadatas.
   * This is optimal for grounded answers with inline citations.
   */
  static buildCitationAwareContext(retrieved: RetrievalResult[]): string {
    if (retrieved.length === 0) {
      return "Nessun documento o estratto informativo disponibile.";
    }

    return retrieved
      .map((r, idx) => {
        const filename = r.chunk.filePath.split(/[/\\]/).pop() || r.chunk.filePath;
        return `[SOURCE ${idx + 1}]
doc: ${filename}
section: ${r.chunk.sectionTitle || "Generale"}
chunk_id: ${r.chunk.id}
score: ${r.score.toFixed(3)}
content: ${r.chunk.text}`;
      })
      .join("\n\n");
  }
}
