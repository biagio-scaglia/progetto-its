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
        // Cita esplicitamente il file e il titolo della sezione
        const filename = r.chunk.filePath.split("/").pop() || r.chunk.filePath;
        return `[Fonte ${idx + 1}: Guida - ${r.chunk.sectionTitle} (File: ${filename})] (Rilevanza: ${r.score.toFixed(3)})\n${r.chunk.text}`;
      })
      .join("\n\n");
  }
}
