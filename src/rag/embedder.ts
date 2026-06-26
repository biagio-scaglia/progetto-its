import { RagChunk } from "./types";
import { SettingsService } from "../services/settingsService";

export class Embedder {
  private static DEFAULT_ENDPOINT = "http://localhost:11434";
  private static DEFAULT_MODEL = "bge-m3";

  /**
   * Helper to normalize a vector to unit length (L2 normalization).
   */
  static normalize(vector: number[]): number[] {
    let sumSq = 0;
    for (let i = 0; i < vector.length; i++) {
      sumSq += vector[i] * vector[i];
    }
    const magnitude = Math.sqrt(sumSq);
    if (magnitude === 0) return vector;
    return vector.map(val => val / magnitude);
  }

  /**
   * Retrieves embedding for a single text.
   */
  static async embedText(text: string, endpoint?: string, model?: string): Promise<number[]> {
    const activeEndpoint = endpoint || this.getOllamaEndpoint();
    const activeModel = model || this.getEmbeddingModel();

    try {
      // Try /api/embed (batch & newer endpoint)
      const response = await fetch(`${activeEndpoint}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: activeModel,
          input: [text],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embeddings && data.embeddings.length > 0) {
          return this.normalize(data.embeddings[0]);
        }
      }
    } catch (e) {
      // Ignore and fallback to /api/embeddings
    }

    // Fallback to older /api/embeddings
    const responseFallback = await fetch(`${activeEndpoint}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: activeModel,
        prompt: text,
      }),
    });

    if (!responseFallback.ok) {
      const errorText = await responseFallback.text();
      throw new Error(`Embedding failed with status ${responseFallback.status}: ${errorText}`);
    }

    const data = await responseFallback.json();
    if (!data.embedding) {
      throw new Error("Invalid embedding response structure from Ollama");
    }

    return this.normalize(data.embedding);
  }

  /**
   * Batch embeds multiple chunks in a single request if supported, falling back to sequential.
   */
  static async embedChunks(
    chunks: RagChunk[],
    endpoint?: string,
    model?: string
  ): Promise<RagChunk[]> {
    const activeEndpoint = endpoint || this.getOllamaEndpoint();
    const activeModel = model || this.getEmbeddingModel();
    const result: RagChunk[] = [];

    // Filter to texts
    const texts = chunks.map(c => c.text);

    try {
      console.log(`[Embedder] Tentativo di generazione embedding batch per ${chunks.length} chunk tramite /api/embed...`);
      const response = await fetch(`${activeEndpoint}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: activeModel,
          input: texts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embeddings && data.embeddings.length === chunks.length) {
          console.log("[Embedder] Embedding batch completato con successo.");
          return chunks.map((chunk, idx) => ({
            ...chunk,
            embedding: this.normalize(data.embeddings[idx]),
          }));
        }
      }
    } catch (e) {
      console.warn("[Embedder] Errore nell'embedding batch, esecuzione sequenziale...", e);
    }

    // Sequential fallback
    console.log("[Embedder] Elaborazione sequenziale dei chunk...");
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`[Embedder] Elaborazione chunk ${i + 1}/${chunks.length}...`);
      const embedding = await this.embedText(chunk.text, activeEndpoint, activeModel);
      result.push({ ...chunk, embedding });
    }

    return result;
  }

  /**
   * Safely retrieves the configured Ollama endpoint.
   */
  private static getOllamaEndpoint(): string {
    try {
      return SettingsService.getSettings().ollamaEndpoint;
    } catch (e) {
      return this.DEFAULT_ENDPOINT;
    }
  }

  /**
   * Safely retrieves the configured embedding model name.
   */
  private static getEmbeddingModel(): string {
    try {
      return SettingsService.getSettings().embeddingModel || this.DEFAULT_MODEL;
    } catch (e) {
      return this.DEFAULT_MODEL;
    }
  }
}
