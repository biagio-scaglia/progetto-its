import { RagChunk, VectorStoreData } from "./types";
import indexData from "./knowledge_index.json";

export class VectorStore {
  private static chunks: RagChunk[] = (indexData as unknown as VectorStoreData).chunks || [];

  /**
   * Retrieves all loaded chunks.
   */
  static getChunks(): RagChunk[] {
    return this.chunks;
  }

  /**
   * Dynamically updates the in-memory chunks.
   */
  static setChunks(newChunks: RagChunk[]): void {
    this.chunks = newChunks;
  }
}
