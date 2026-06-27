# SDIT — Servizi Digitali Italiani (Local-First)

Questa applicazione desktop (SDIT) è uno strumento privato di guida e orientamento per i cittadini italiani nei rapporti con la Pubblica Amministrazione (es. INPS, ANPR, portali comunali). L'obiettivo principale è aiutare l'utente a comprendere i passaggi, preparare i requisiti documentali corretti e accedere in sicurezza ai link ufficiali per completare le pratiche burocratiche.

---

## 🎯 Obiettivo dell'Applicazione

A differenza di un gestionale o di un client di autenticazione ministeriale, questo software agisce come un assistente personale offline. Fornisce:
- **Orientamento e spiegazioni chiare**: Istruzioni passo-passo per servizi come il Cambio di Residenza online o il rilascio della CIE (Carta d'Identità Elettronica).
- **Checklist documentali**: Un elenco dettagliato dei requisiti e dei documenti necessari da verificare prima di effettuare le istanze sui portali istituzionali.
- **Assistente AI conversazionale locale**: Chat con LLM locale (Qwen) integrato con RAG su knowledge base markdown e dati utente.
- **Privacy totale e archiviazione offline**: Tutti i dati anagrafici, i consensi e i documenti caricati rimangono esclusivamente all'interno del dispositivo dell'utente. Nessuna chiamata cloud.

---

## 🛠️ Stack Tecnico

L'applicazione è sviluppata con tecnologie moderne, sicure e performanti:
- **Framework Desktop**: [Tauri v2](https://tauri.app/) (backend Rust leggero e sicuro, frontend HTML5/JS/TS).
- **Frontend Core**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) per una gestione robusta dei tipi.
- **Bundler e Build System**: [Vite](https://vite.dev/).
- **Design System & Stile**: CSS Vanilla ispirato alle linee guida istituzionali dei servizi digitali pubblici italiani (*Designers Italia*), con layout a contrasto accessibile e solo tema chiaro (Light Theme).
- **Iconografia**: Icone vettoriali ad alta definizione fornite da `@radix-ui/react-icons`.
- **LLM Locale**: [Ollama](https://ollama.com/) + modello **Qwen 2 7B** per generazione risposte conversazionali.
- **Embedding Model**: [BGE-M3](https://huggingface.co/BAAI/bge-m3) via Ollama, multilingue, per retrieval vettoriale.

---

## 🤖 Architettura AI Locale

### Modello LLM

| Modello | Ruolo | Uso |
|---------|-------|-----|
| **Qwen 2 7B** | Motore principale | Chat, RAG grounded, sintesi, classificazione intento, query rewriting |

Il modello viene servito localmente tramite **Ollama** su `http://localhost:11434`.

### Pipeline Conversazionale

```
Input Utente
    │
    ├─→ [1] Intent Pre-Classifier (classificazione intento)
    │       small_talk / greeting / domain_question / ...
    │
    ├─→ [2] Input Guard (anti prompt-injection)
    │       Risk scoring, sanitizzazione, blocco se pericoloso
    │
    ├─→ [3] RAG Hybrid Retrieval
    │       Vector search (BGE-M3) + TF-IDF dinamico
    │
    ├─→ [4] RAG Guard (ispeziona chunk recuperati)
    │       Quarantena chunk sospetti, trust scoring
    │
    ├─→ [5] Prompt Builder (sistema / utente / contesto separati)
    │
    ├─→ [6] Qwen Generation (LLM locale)
    │
    └─→ [7] Output Guard (validazione risposta)
            Blocco leak prompt, dati sensibili, hallucination check
```

### RAG (Retrieval-Augmented Generation)

Il sistema RAG è **ibrido**, combinando due strategie di retrieval:

1. **Vector Search (Knowledge Base)**: Embedding BGE-M3 su documenti markdown statici nella cartella `knowledge/`. Usa dot-product su vettori L2-normalizzati.
2. **TF-IDF dinamico (Dati Utente)**: Indicizzazione in tempo reale di guide mock, documenti utente, scadenze e profilo da `localStorage`.

#### Knowledge Base

I documenti di riferimento si trovano in `knowledge/`:

| File | Contenuto |
|------|-----------|
| `spid.md` | Guida completa a SPID: cos'è, come ottenerlo, identity provider |
| `cie.md` | Guida alla CIE: richiesta, rinnovo, uso per autenticazione |
| `inps-servizi.md` | Panoramica servizi INPS online: pensioni, NASpI, bonus |
| `isee.md` | Guida ISEE: cos'è, come calcolarlo, documenti necessari |

#### Generazione dell'Indice Vettoriale

Per indicizzare la knowledge base con BGE-M3:

```bash
# 1. Assicurati che Ollama sia in esecuzione
ollama serve

# 2. Scarica il modello di embedding
ollama pull bge-m3

# 3. Genera l'indice vettoriale
npm run build:knowledge
```

Lo script legge i file `.md` da `knowledge/`, li suddivide in chunk, genera gli embedding tramite Ollama e salva l'indice in `src/rag/knowledge_index.json`.

> [!NOTE]
> **Gestione Indice Vettoriale (Housekeeping)**:
> Il file `knowledge_index.json` contenente le coordinate dei vettori float è escluso dal controllo versione Git. Al primo avvio, l'esecuzione di `npm install` attiva automaticamente un lifecycle script (`prepare`) che genera un file segnaposto vuoto `{ "chunks": [] }`. Questo consente il bootstrap e la compilazione immediata del progetto offline e senza Ollama in esecuzione.

#### Pipeline di Retrieval Avanzata (Multi-Source & Citations)

Il recupero dei documenti (RAG ibrido statico + dinamico) viene filtrato ed ottimizzato tramite quattro stadi principali:
1. **Soglia di Punteggio (Score Threshold)**: Esclusione dei frammenti irrilevanti (soglia `0.30` per vector store).
2. **Deduplica Chunk**: Rimozione di chunk duplicati o quasi identici basandosi su cosine similarity dell'embedding (`> 0.88`) o su Jaccard text overlap (`>= 0.40`).
3. **Bilanciamento Fonti (Diversity)**: Limitazione a massimo `2` chunk dallo stesso file per evitare la monopolizzazione del contesto e forzare la diversificazione delle fonti.
4. **Citazioni Inline Grounded**: Il modello Qwen riceve un contesto strutturato con blocchi numerati `[SOURCE N]` ed è istruito a citare inline con la notazione `[Fonte N]`. In caso di dati insufficienti, il sistema restituisce in automatico una formula di no-answer standard.
5. **Estrazione Fonti in UI**: L'app esegue il parsing della risposta dell'AI ed estrae le sole fonti realmente citate, mostrandole come badge interattivi cliccabili in chat, completi di preview del testo di origine.

---

## 🛡️ Sicurezza AI

L'architettura implementa 3 livelli di protezione:

### Layer 1 — Input Guard (`src/security/inputGuard.ts`)
- Rileva pattern di prompt injection (jailbreak, role hijacking, ignore instructions)
- Calcola un risk score (0–1) per ogni input
- Modalità: `allow`, `sanitize`, `block`

### Layer 2 — RAG Guard (`src/security/ragGuard.ts`)
- Ispeziona i chunk recuperati dal RAG prima di iniettarli nel prompt
- Calcola trust score e quarantena chunk sospetti
- Protegge contro data poisoning nei documenti

### Layer 3 — Output Guard (`src/security/outputGuard.ts`)
- Valida la risposta del modello prima di mostrarla all'utente
- Blocca leak del system prompt, dati sensibili, o output manipolato

### Configurazione

Nel pannello impostazioni dell'app:
- **Safe Mode**: attiva/disattiva tutti i layer di sicurezza
- **Protection Level**: `standard` (bilanciato) o `strict` (massima protezione)

---

## 📁 Struttura Principale delle Cartelle

```text
progetto.its/
├── docs/                    # Documentazione di progetto
│   └── copy-guidelines.md   # Linee guida per il micro-copy e glossario termini vietati
├── knowledge/               # Knowledge base RAG (documenti .md)
│   ├── spid.md
│   ├── cie.md
│   ├── inps-servizi.md
│   └── isee.md
├── scripts/
│   └── buildKnowledgeIndex.ts  # Script per generazione indice vettoriale
├── src/
│   ├── assets/              # Risorse statiche (immagini, loghi)
│   ├── components/
│   │   ├── layout/          # Shell dell'app (AppShell, Sidebar, TopBar)
│   │   ├── ui/              # Componenti primitivi (Alert, Button, Badge)
│   │   ├── dashboard/       # Sotto-componenti Home
│   │   └── guida/           # Sotto-componenti pagina guida
│   ├── config/
│   │   ├── branding.ts      # Configurazione branding
│   │   └── microcopy.ts     # Single source of truth per testi user-facing
│   ├── hooks/
│   │   └── useAppState.ts   # Hook centralizzato stato globale
│   ├── pages/               # Schermate principali
│   ├── providers/
│   │   └── qwenProvider.ts  # Client Ollama per Qwen
│   ├── rag/                 # Pipeline RAG locale
│   │   ├── types.ts         # Tipi RagChunk, RetrievalResult
│   │   ├── markdownLoader.ts # Parser file .md (build-time only)
│   │   ├── chunker.ts       # Chunking con overlap
│   │   ├── embedder.ts      # Client Ollama per BGE-M3
│   │   ├── vectorStore.ts   # Store vettoriale in-memory
│   │   ├── retriever.ts     # Dot-product similarity search con filtri e bilanciamento
│   │   ├── contextBuilder.ts # Formattazione contesto citato (SOURCE N)
│   │   ├── deduplicate.ts   # Deduplica chunk (Cosine + Jaccard)
│   │   ├── scoring.ts       # Filtro punteggio e selezione diversificata (diversity)
│   │   └── citations.ts     # Parsing citazioni [Fonte N] ed estrazione UI
│   ├── repositories/        # Persistenza locale (localStorage)
│   ├── security/            # Layer di sicurezza AI
│   │   ├── inputGuard.ts
│   │   ├── ragGuard.ts
│   │   └── outputGuard.ts
│   ├── services/
│   │   ├── modelRouter.ts   # Router e orchestratore AI
│   │   ├── ragService.ts    # Servizio RAG ibrido (vector + TF-IDF)
│   │   ├── promptBuilder.ts # Costruzione prompt sicuri e citazioni obbligatorie
│   │   ├── settingsService.ts # Gestione impostazioni AI
│   │   └── intentClassifier.ts # Pre-classificazione intento
│   ├── utils/               # Utility (sanitizzazione, trust score, routing)
│   ├── mockData.ts          # Dati demo iniziali
│   ├── types.ts             # Tipi TypeScript del dominio
│   ├── App.tsx              # Componente root
│   ├── App.css              # Stile CSS globale
│   └── main.tsx             # Entry point React
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💾 Persistenza Locale e Privacy (Local-First)

Tutte le informazioni del profilo, le preferenze espresse durante l'onboarding, i documenti spuntati e la cronologia della chat dell'assistente sono archiviati unicamente sul dispositivo del cittadino tramite **localStorage**.

### Punti Chiave dell'Architettura:
- **Repository Pattern**: Le chiamate di lettura/scrittura sono incapsulate in classi repository isolate (sotto `src/repositories/`). Questo disaccoppia la UI e rende banale sostituire `localStorage` con il file system crittografato o un database SQLite locale integrato in Rust/Tauri.
- **Controllo Emoji (Vincolante)**: Al fine di garantire uno stile sobrio ed evitare caratteri non conformi nelle procedure, i repository filtrano e rigettano qualunque stringa contenente caratteri emoji o simboli grafici non standard.
- **Reset Totale**: Tramite l'opzione "Elimina Profilo Locale" nella schermata del profilo, l'utente può rimuovere istantaneamente e in modo sicuro tutte le informazioni salvate sul dispositivo, riportando l'applicazione allo stato iniziale di onboarding.

---

## 🚀 Come Avviare il Progetto Localmente

### Requisiti
- Node.js (v18+) e `npm`
- [Ollama](https://ollama.com/) installato e in esecuzione
- Modelli: `qwen2-7b` e `bge-m3`

### Setup Modelli AI

```bash
# Avvia Ollama
ollama serve

# Scarica i modelli necessari
ollama pull qwen2-7b
ollama pull bge-m3
```

### Procedura di Avvio

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Genera l'indice vettoriale RAG:
   ```bash
   npm run build:knowledge
   ```

3. Avvia il server di sviluppo locale:
   ```bash
   npm run dev
   ```
   *Nota: L'applicazione web sarà accessibile all'indirizzo `http://localhost:1420`.*

4. Esegui la build di produzione per verificare la correttezza del codice:
   ```bash
   npm run build
   ```

---

## 📈 Prossimi Step Sviluppo

1. **Integrazione File System Tauri**: Migrare la scrittura dei file dei documenti e dei file JSON di configurazione dal `localStorage` alle directory protette dell'utente (`$APP_DATA_DIR`) tramite le API native Rust di Tauri.
2. **Integrazione Geolocalizzazione Reale**: Sostituire il lookup geografico simulato con il rilevamento reale del GPS tramite plugin ufficiale Tauri Core `geolocation`, mantenendo sempre il consenso facoltativo abilitato dall'utente.
3. **Espansione Knowledge Base**: Aggiungere guide per ulteriori servizi PA (ANPR, Agenzia Entrate, Fascicolo Sanitario Elettronico).
4. **Re-ranking semantico**: Implementare un secondo stadio di re-ranking con cross-encoder per migliorare la precisione del retrieval.
5. **Persistent Vector Store**: Migrare da JSON in-memory a SQLite con estensione vector per supportare knowledge base più ampie.
