export interface MarkdownSection {
  filePath: string;
  sectionTitle: string;
  content: string;
}

export interface RagChunk {
  id: string;
  filePath: string; // matches sourceId for dynamic chunks
  sectionTitle: string; // matches title for dynamic chunks
  fileHash: string; // matches hash for dynamic chunks
  chunkIndex?: number;
  text: string;
  embedding?: number[];
  type?: "guide" | "knowledge" | "user_document" | "user_deadline" | "user_profile";
  
  // Backward-compatibility aliases
  sourceId?: string;
  title?: string;
  hash?: string;
}

export interface VectorStoreData {
  chunks: RagChunk[];
}

export interface RetrievalResult {
  chunk: RagChunk;
  score: number;
}

export interface RAGOptions {
  topK?: number;
  similarityThreshold?: number;
  maxPerDocument?: number;
}
