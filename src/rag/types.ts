export interface MarkdownSection {
  filePath: string;
  sectionTitle: string;
  content: string;
}

export interface RagChunk {
  id: string;
  filePath: string;
  sectionTitle: string;
  fileHash: string;
  chunkIndex: number;
  text: string;
  embedding?: number[];
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
}
