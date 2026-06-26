/**
 * Build Knowledge Index Script
 * 
 * Scans the knowledge/ directory for .md files, parses and chunks them,
 * generates BGE-M3 embeddings via local Ollama, and writes the vector
 * index to src/rag/knowledge_index.json.
 * 
 * Usage:
 *   npx tsx scripts/buildKnowledgeIndex.ts
 * 
 * Prerequisites:
 *   - Ollama must be running on http://localhost:11434
 *   - The bge-m3 model must be installed: ollama pull bge-m3
 */

import * as path from "path";
import * as fs from "fs";
import { MarkdownLoader } from "../src/rag/markdownLoader";
import { Chunker } from "../src/rag/chunker";
import { RagChunk, VectorStoreData } from "../src/rag/types";

const OLLAMA_ENDPOINT = "http://localhost:11434";
const EMBEDDING_MODEL = "bge-m3";
const KNOWLEDGE_DIR = path.resolve(process.cwd(), "knowledge");
const OUTPUT_FILE = path.resolve(process.cwd(), "src/rag/knowledge_index.json");

/**
 * L2-normalize a vector.
 */
function normalize(vector: number[]): number[] {
  let sumSq = 0;
  for (let i = 0; i < vector.length; i++) {
    sumSq += vector[i] * vector[i];
  }
  const magnitude = Math.sqrt(sumSq);
  if (magnitude === 0) return vector;
  return vector.map(val => val / magnitude);
}

/**
 * Generates embedding for a single text string via Ollama /api/embed.
 */
async function embedText(text: string): Promise<number[]> {
  // Try /api/embed (newer batch endpoint)
  try {
    const response = await fetch(`${OLLAMA_ENDPOINT}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: [text] }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.embeddings && data.embeddings.length > 0) {
        return normalize(data.embeddings[0]);
      }
    }
  } catch (_) {
    // fallback below
  }

  // Fallback to /api/embeddings (older Ollama versions)
  const response = await fetch(`${OLLAMA_ENDPOINT}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embedding request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  if (!data.embedding) {
    throw new Error("Invalid embedding response from Ollama");
  }

  return normalize(data.embedding);
}

async function main() {
  console.log("=== SDIT Knowledge Index Builder ===");
  console.log(`Directory knowledge:  ${KNOWLEDGE_DIR}`);
  console.log(`Output file:          ${OUTPUT_FILE}`);
  console.log(`Ollama endpoint:      ${OLLAMA_ENDPOINT}`);
  console.log(`Embedding model:      ${EMBEDDING_MODEL}`);
  console.log("");

  // 1. Check Ollama connectivity
  try {
    const healthCheck = await fetch(`${OLLAMA_ENDPOINT}/api/tags`);
    if (!healthCheck.ok) throw new Error("Non-OK status");
    console.log("✅ Ollama è raggiungibile.");
  } catch (e) {
    console.error("❌ Impossibile contattare Ollama. Assicurati che sia in esecuzione su", OLLAMA_ENDPOINT);
    process.exit(1);
  }

  // 2. Load markdown files
  const files = MarkdownLoader.loadMarkdownFiles(KNOWLEDGE_DIR);
  if (files.length === 0) {
    console.error("❌ Nessun file .md trovato in", KNOWLEDGE_DIR);
    process.exit(1);
  }
  console.log(`📄 File .md trovati: ${files.length}`);

  // 3. Parse into sections
  let allSections: ReturnType<typeof MarkdownLoader.parseMarkdownSections> = [];
  for (const file of files) {
    const sections = MarkdownLoader.parseMarkdownSections(file.content, file.filePath);
    allSections = allSections.concat(sections);
    console.log(`   ${file.filePath}: ${sections.length} sezioni`);
  }

  // 4. Chunk
  const chunks = Chunker.chunkSections(allSections, { maxWords: 500 });
  console.log(`🔪 Chunk generati: ${chunks.length}`);
  console.log("");

  // 5. Generate embeddings
  console.log("🧠 Generazione embeddings con BGE-M3...");
  const embeddedChunks: RagChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`   [${i + 1}/${chunks.length}] ${chunk.sectionTitle.substring(0, 50).padEnd(50)}... `);

    try {
      const embedding = await embedText(chunk.text);
      embeddedChunks.push({ ...chunk, embedding });
      console.log(`✅ (${embedding.length} dim)`);
    } catch (e: any) {
      console.log(`❌ ${e.message}`);
      console.error(`\n⚠️  Errore: assicurati che il modello '${EMBEDDING_MODEL}' sia installato.`);
      console.error(`   Esegui: ollama pull ${EMBEDDING_MODEL}\n`);
      process.exit(1);
    }
  }

  // 6. Write index
  const indexData: VectorStoreData = { chunks: embeddedChunks };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), "utf-8");

  console.log("");
  console.log(`✅ Indice scritto in: ${OUTPUT_FILE}`);
  console.log(`   Chunk totali:     ${embeddedChunks.length}`);
  if (embeddedChunks.length > 0 && embeddedChunks[0].embedding) {
    console.log(`   Dimensione vettore: ${embeddedChunks[0].embedding.length}`);
  }
  console.log("");
  console.log("🎉 Knowledge index pronto! L'app SDIT può ora utilizzare il RAG locale con BGE-M3.");
}

main().catch(err => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
