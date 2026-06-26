import { MarkdownSection, RagChunk } from "./types";

export interface ChunkerOptions {
  maxWords?: number;
  overlapWords?: number;
}

export class Chunker {
  /**
   * Generates a simple hash string for file content hashing.
   */
  static calculateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Counts words in a string.
   */
  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  /**
   * Chunks parsed Markdown sections.
   */
  static chunkSections(sections: MarkdownSection[], options: ChunkerOptions = {}): RagChunk[] {
    const maxWords = options.maxWords ?? 500; // Target word size
    const chunks: RagChunk[] = [];
    
    // Group sections by file to calculate hash
    const fileContents: Record<string, string> = {};
    sections.forEach(s => {
      fileContents[s.filePath] = (fileContents[s.filePath] || "") + s.content + "\n";
    });

    const fileHashes: Record<string, string> = {};
    Object.keys(fileContents).forEach(filePath => {
      fileHashes[filePath] = this.calculateHash(fileContents[filePath]);
    });

    let overallChunkCounter = 0;

    for (const section of sections) {
      const wordCount = this.countWords(section.content);
      const fileHash = fileHashes[section.filePath];

      if (wordCount <= maxWords) {
        // Safe size, make a single chunk
        overallChunkCounter++;
        chunks.push({
          id: `chunk-${fileHash}-${overallChunkCounter}`,
          filePath: section.filePath,
          sectionTitle: section.sectionTitle,
          fileHash,
          chunkIndex: overallChunkCounter,
          text: section.content,
        });
      } else {
        // Split section content by paragraphs
        const paragraphs = section.content.split(/\r?\n\r?\n/);
        let currentChunkText: string[] = [];
        let currentWords = 0;
        let localIndex = 0;

        const saveSubChunk = () => {
          const subText = currentChunkText.join("\n\n").trim();
          if (subText) {
            overallChunkCounter++;
            localIndex++;
            // Prepend header context to sub-chunks if it's not the first sub-chunk
            const contextualText = localIndex > 1 
              ? `[Guida: ${section.sectionTitle} - Parte ${localIndex}]\n${subText}`
              : subText;

            chunks.push({
              id: `chunk-${fileHash}-${overallChunkCounter}`,
              filePath: section.filePath,
              sectionTitle: section.sectionTitle,
              fileHash,
              chunkIndex: overallChunkCounter,
              text: contextualText,
            });
          }
        };

        for (const para of paragraphs) {
          const paraWords = this.countWords(para);
          if (currentWords + paraWords > maxWords && currentChunkText.length > 0) {
            saveSubChunk();
            currentChunkText = [];
            currentWords = 0;
          }
          currentChunkText.push(para);
          currentWords += paraWords;
        }

        // Save leftover
        saveSubChunk();
      }
    }

    return chunks;
  }
}
