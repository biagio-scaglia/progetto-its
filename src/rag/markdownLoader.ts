import * as fs from "fs";
import * as path from "path";
import { MarkdownSection } from "./types";

export class MarkdownLoader {
  /**
   * Reads all markdown files from the target directory.
   */
  static loadMarkdownFiles(knowledgeDir: string): { filePath: string; content: string }[] {
    const files: { filePath: string; content: string }[] = [];

    if (!fs.existsSync(knowledgeDir)) {
      console.warn(`[MarkdownLoader] Directory non trovata: ${knowledgeDir}`);
      return [];
    }

    const items = fs.readdirSync(knowledgeDir);
    for (const item of items) {
      if (item.endsWith(".md")) {
        const fullPath = path.join(knowledgeDir, item);
        const content = fs.readFileSync(fullPath, "utf-8");
        // Use relative path for platform independence
        const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
        files.push({ filePath: relativePath, content });
      }
    }

    return files;
  }

  /**
   * Parses markdown content into sections based on headings (#, ##, ###).
   */
  static parseMarkdownSections(content: string, filePath: string): MarkdownSection[] {
    const sections: MarkdownSection[] = [];
    const lines = content.split(/\r?\n/);
    
    let currentTitle = "Introduzione";
    let currentContent: string[] = [];

    const saveCurrentSection = () => {
      const text = currentContent.join("\n").trim();
      if (text) {
        sections.push({
          filePath,
          sectionTitle: currentTitle,
          content: text,
        });
      }
    };

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        // Save previous section
        saveCurrentSection();
        // Start new section
        currentTitle = headingMatch[2].trim();
        currentContent = [line]; // Include header line in content for context
      } else {
        currentContent.push(line);
      }
    }

    // Save final section
    saveCurrentSection();

    return sections;
  }
}
