import { SERVIZI_MOCK } from "../mockData";
import { DocumentiRepository } from "../repositories/documentiRepository";
import { ScadenzeRepository } from "../repositories/scadenzeRepository";
import { ProfileRepository } from "../repositories/profileRepository";
import { PercorsiRepository } from "../repositories/percorsiRepository";
import { Retriever } from "../rag/retriever";
import { RagChunk, RetrievalResult } from "../rag/types";
export type { RagChunk, RetrievalResult };
import { COPY_RAG_CONTEXT } from "../config/microcopy";
import { deduplicateChunks } from "../rag/deduplicate";
import { selectDiverseSources } from "../rag/scoring";

// Simple list of Italian stopwords to clean terms and improve matching
const STOPWORDS = new Set([
  "il", "la", "i", "gli", "le", "un", "uno", "una", "di", "a", "da", "in", "con", 
  "su", "per", "tra", "fra", "e", "o", "che", "ma", "se", "perche", "perché", "è", "o"
]);

export class RagService {
  private static dynamicChunks: RagChunk[] = [];
  private static documentFrequency: Record<string, number> = {};
  private static totalDocuments = 0;

  /**
   * Generates a simple hash string for deduplication.
   */
  private static calculateStringHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Tokenizes and cleans a string into a list of lowercase terms.
   */
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\\"']/g, " ")
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 1 && !STOPWORDS.has(t));
  }

  /**
   * Refreshes the dynamic local index incrementally (user data + mock guides).
   */
  static refreshIndex(): void {
    const newChunks: RagChunk[] = [];
    const seenHashes = new Set<string>();

    const addChunk = (chunk: {
      id: string;
      sourceId: string;
      type: "guide" | "knowledge" | "user_document" | "user_deadline" | "user_profile";
      title: string;
      text: string;
    }) => {
      const fileHash = this.calculateStringHash(chunk.text);
      if (!seenHashes.has(fileHash)) {
        seenHashes.add(fileHash);
        newChunks.push({
          id: chunk.id,
          filePath: chunk.sourceId,
          sectionTitle: chunk.title,
          fileHash,
          text: chunk.text,
          type: chunk.type,
          hash: fileHash,
          title: chunk.title,
          sourceId: chunk.sourceId
        });
      }
    };

    // 1. Index guides from SERVIZI_MOCK
    SERVIZI_MOCK.forEach(guide => {
      // Chunk 1: Info e descrizione
      addChunk({
        id: `g-info-${guide.id}`,
        sourceId: guide.id,
        type: "guide",
        title: guide.titolo,
        text: `Guida Servizio: ${guide.titolo}. Categoria: ${guide.categoria}. Descrizione: ${guide.descrizione}. A cosa serve: ${guide.aCosaServe || ""}. Note: ${guide.noteImportanti || ""}`,
      });

      // Chunk 2: Requisiti necessari
      if (guide.requisiti && guide.requisiti.length > 0) {
        addChunk({
          id: `g-req-${guide.id}`,
          sourceId: guide.id,
          type: "guide",
          title: `${guide.titolo} - Requisiti`,
          text: `Requisiti e documenti per ${guide.titolo}: ${guide.requisiti.join(", ")}. Cosa serve prima di iniziare: ${guide.cosaServePrima || ""}`,
        });
      }

      // Chunk 3: Passaggi procedura
      if (guide.passiNomi && guide.passiNomi.length > 0) {
        const passiText = guide.passiNomi
          .map((nome, idx) => `Passo ${idx + 1}: ${nome}. Dettaglio: ${guide.passiDettagli?.[idx] || ""}`)
          .join(" ");
        addChunk({
          id: `g-steps-${guide.id}`,
          sourceId: guide.id,
          type: "guide",
          title: `${guide.titolo} - Procedura`,
          text: `Procedura per ${guide.titolo}. Passaggi da compiere: ${passiText}`,
        });
      }

      // Chunk 4: Problemi Frequenti
      if (guide.problemiFrequenti && guide.problemiFrequenti.length > 0) {
        addChunk({
          id: `g-prob-${guide.id}`,
          sourceId: guide.id,
          type: "guide",
          title: `${guide.titolo} - Problemi Frequenti`,
          text: `Problemi comuni e soluzioni per ${guide.titolo}: ${guide.problemiFrequenti.join(" ")}`,
        });
      }
    });

    // 2. Index active user percorsi
    try {
      const activePercorsi = PercorsiRepository.getPercorsi();
      activePercorsi.forEach(p => {
        addChunk({
          id: `up-${p.id}`,
          sourceId: p.id,
          type: "user_profile",
          title: `Stato percorso: ${p.titolo}`,
          text: `Stato attuale del percorso '${p.titolo}': stato '${p.stato}', passo corrente ${p.passoCorrente + 1} di ${p.totalePassi} ("${p.passiNomi[p.passoCorrente] || ""}"). Codice pratica: ${p.codice}. Ultimo aggiornamento: ${p.dataAggiornamento}`,
        });
      });
    } catch (e) {
      console.warn("RAG: Could not read active percorsi", e);
    }

    // 3. Index user document metadata
    try {
      const documents = DocumentiRepository.getDocumenti();
      if (documents.length > 0) {
        const docsSummary = documents
          .map(d => `Documento: '${d.nome}', tipo: '${d.tipo}', dimensione: '${d.dimensione}', caricato il: ${d.dataCaricamento}, stato: '${d.stato}'`)
          .join("\n");
        addChunk({
          id: "user-docs",
          sourceId: "user_docs",
          type: "user_document",
          title: "Archivio Documenti Personali",
          text: `Documenti personali salvati nell'archivio locale dell'utente:\n${docsSummary}`,
        });
      }
    } catch (e) {
      console.warn("RAG: Could not read user documents", e);
    }

    // 4. Index user deadlines
    try {
      const deadlines = ScadenzeRepository.getScadenze();
      const pendingDeadlines = deadlines.filter(d => !d.completata);
      if (pendingDeadlines.length > 0) {
        const deadsSummary = pendingDeadlines
          .map(d => `Scadenza: '${d.titolo}', data: '${d.data}', priorità: '${d.priorita}', descrizione: '${d.descrizione}'`)
          .join("\n");
        addChunk({
          id: "user-deadlines",
          sourceId: "user_deadlines",
          type: "user_deadline",
          title: "Scadenze Amministrative Pendenti",
          text: `Scadenze e promemoria non completati salvati dall'utente:\n${deadsSummary}`,
        });
      }
    } catch (e) {
      console.warn("RAG: Could not read deadlines", e);
    }

    // 5. Index user profile metadata
    try {
      const profile = ProfileRepository.getProfile();
      if (profile) {
        addChunk({
          id: "user-profile",
          sourceId: "user_profile",
          type: "user_profile",
          title: "Profilo e Comune dell'Utente",
          text: `Dati del profilo cittadino: Nome '${profile.nome}', Cognome '${profile.cognome}', Residente a '${profile.comune}' ${profile.provincia ? `(provincia di ${profile.provincia})` : ""}. Email '${profile.email || "non fornita"}', Telefono '${profile.cellulare || "non fornito"}'.`,
        });
      }
    } catch (e) {
      console.warn("RAG: Could not read profile", e);
    }

    // Save chunks
    this.dynamicChunks = newChunks;
    this.totalDocuments = newChunks.length;

    // Calculate document frequency for TF-IDF
    this.documentFrequency = {};
    newChunks.forEach(chunk => {
      const terms = new Set(this.tokenize(chunk.text));
      terms.forEach(term => {
        this.documentFrequency[term] = (this.documentFrequency[term] || 0) + 1;
      });
    });
  }

  /**
   * Searches dynamic local chunks using TF-IDF scoring (user data, guides).
   */
  private static retrieveDynamic(query: string, topK = 3): RetrievalResult[] {
    if (this.dynamicChunks.length === 0) {
      this.refreshIndex();
    }

    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) return [];

    const results: RetrievalResult[] = [];

    this.dynamicChunks.forEach(chunk => {
      const chunkTerms = this.tokenize(chunk.text);
      const termCounts: Record<string, number> = {};
      chunkTerms.forEach(term => {
        termCounts[term] = (termCounts[term] || 0) + 1;
      });

      let score = 0;

      queryTerms.forEach(term => {
        const count = termCounts[term] || 0;
        if (count > 0) {
          const tf = count / chunkTerms.length;
          const df = this.documentFrequency[term] || 1;
          const idf = Math.log(this.totalDocuments / df) + 1;
          score += tf * idf;
        }
      });

      if (score > 0) {
        results.push({ chunk, score });
      }
    });

    // Sort by score descending and take topK
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Searches the static knowledge base using BGE-M3 vector embeddings via Ollama.
   * Returns results converted to the common RetrievalResult interface.
   */
  private static async retrieveKnowledge(query: string, topK = 3): Promise<RetrievalResult[]> {
    try {
      const vectorResults = await Retriever.searchRelevantChunks(query, { topK });

      // Convert vector results to the common RetrievalResult shape with both primary and alias fields
      return vectorResults.map(vr => ({
        chunk: {
          ...vr.chunk,
          sourceId: vr.chunk.filePath,
          type: "knowledge" as const,
          title: vr.chunk.sectionTitle,
          hash: vr.chunk.fileHash,
        },
        score: vr.score,
      }));
    } catch (e) {
      console.warn("[RagService] Vector retrieval failed, falling back to dynamic-only:", e);
      return [];
    }
  }

  /**
   * Hybrid retrieve: combines vector-based knowledge search with dynamic TF-IDF search.
   * Applies deduplication and diverse source selection.
   */
  static async retrieveHybrid(query: string, topK = 5): Promise<RetrievalResult[]> {
    // Run dynamic (TF-IDF) search synchronously (higher topK pool for balance)
    const dynamicResults = this.retrieveDynamic(query, topK * 2);

    // Run vector-based knowledge search asynchronously (higher topK pool for balance)
    const knowledgeResults = await this.retrieveKnowledge(query, topK * 2);

    // Merge: interleave by score
    const allResults = [...knowledgeResults, ...dynamicResults].sort((a, b) => b.score - a.score);

    // 1. Deduplicate chunks
    const deduplicated = deduplicateChunks(allResults);

    // 2. Select diverse sources (max 2 per document/source)
    const diverse = selectDiverseSources(deduplicated, topK, 2);

    return diverse;
  }

  /**
   * Synchronous retrieve: TF-IDF only (for backward compatibility and social-bypass fast paths).
   */
  static retrieve(query: string, topK = 3): RetrievalResult[] {
    return this.retrieveDynamic(query, topK);
  }

  /**
   * Helper to format retrieved chunks into a single readable context string.
   */
  static buildRagContext(retrieved: RetrievalResult[]): string {
    if (retrieved.length === 0) return COPY_RAG_CONTEXT.noContextFound;
    
    return retrieved
      .map((r, idx) => {
        let typeLabel: string = COPY_RAG_CONTEXT.guideLabel;
        if (r.chunk.type === "knowledge") typeLabel = COPY_RAG_CONTEXT.knowledgeLabel;
        else if (r.chunk.type === "user_document") typeLabel = COPY_RAG_CONTEXT.userDataLabel;
        else if (r.chunk.type === "user_deadline") typeLabel = COPY_RAG_CONTEXT.userDataLabel;
        else if (r.chunk.type === "user_profile") typeLabel = COPY_RAG_CONTEXT.userDataLabel;
        return `[Fonte ${idx + 1}: ${typeLabel} - ${r.chunk.title}]\n${r.chunk.text}`;
      })
      .join("\n\n");
  }
}
