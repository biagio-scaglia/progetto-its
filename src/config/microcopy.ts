/**
 * microcopy.ts — Single source of truth per tutti i testi user-facing dell'app SDIT.
 *
 * REGOLE:
 * 1. Ogni stringa mostrata all'utente DEVE provenire da questo file.
 * 2. Nessun termine tecnico (RAG, chunk, embedding, provider, pipeline, ecc.) nella UI principale.
 * 3. Il pannello debug può usare terminologia leggermente più tecnica, ma ordinata.
 * 4. Se un concetto tecnico è inevitabile, traducilo in beneficio utente.
 */

// ─────────────────────────────────────────────
// ASSISTENTE — Chat UI
// ─────────────────────────────────────────────

export const COPY_ASSISTANT = {
  /** Header della chat */
  engineLabel: "Risposta elaborata:",
  engineValue: "Sul tuo dispositivo",
  protectionToggleLabel: "Protezione attiva",
  protectionLevelNormal: "Normale",
  protectionLevelMax: "Massima",
  debugToggleLabel: "Dettagli tecnici",

  /** Badge sotto i messaggi AI */
  badgeLocalModel: "Risposta elaborata sul tuo dispositivo",
  badgeDocumentsUsed: "Basata sui tuoi documenti",
  badgeSuspiciousFiltered: "Alcuni contenuti esclusi per sicurezza",
  badgeSecurityBlock: "Risposta bloccata per sicurezza",
  tooltipSuspiciousDetail:
    "Alcuni estratti dai documenti sono stati esclusi perché contenevano elementi sospetti.",

  /** Stati di caricamento */
  thinkingLabel: "sta elaborando...",

  /** Input */
  inputPlaceholder: "Chiedi spiegazioni o indica cosa devi fare...",
  inputAriaLabel: "Messaggio per l'assistente",
  sendButton: "Invia",

  /** Cancellazione chat */
  clearButton: "Cancella cronologia chat",
  clearDialogTitle: "Cancellare la cronologia?",
  clearDialogDesc:
    "Tutti i messaggi di questa conversazione verranno eliminati. Non potrai recuperarli.",
  clearConfirm: "Cancella cronologia",
  clearCancel: "Annulla",

  /** Messaggi eliminazione singola */
  deleteMessageTitle: "Elimina questo messaggio",
  deleteMessageAriaLabel: "Elimina messaggio",
} as const;

// ─────────────────────────────────────────────
// ASSISTENTE — Pannello Debug (utenti avanzati)
// ─────────────────────────────────────────────

export const COPY_DEBUG = {
  panelTitle: "🔧 Dettagli tecnici della risposta",
  engineUsed: "Motore utilizzato:",
  routingCriteria: "Criterio di scelta:",
  inputRisk: "Rischio manipolazione input:",
  docsExcluded: "Estratti documenti esclusi:",
  docsRisk: "Rischio contenuti documenti:",
  outputBlocked: "Risposta bloccata:",
  notSpecified: "Non specificato",
  yes: "SÌ",
  no: "NO",
} as const;

// ─────────────────────────────────────────────
// ROUTING — Tooltip spiegazioni
// ─────────────────────────────────────────────

export const COPY_ROUTING = {
  qwenGeneration: "Risposta elaborata sul tuo dispositivo.",
  socialBypass: "Risposta immediata.",
  systemError:
    "Il motore di risposta non è al momento disponibile. Verifica che sia attivo.",
  defaultReason: "Risposta automatica.",
} as const;

// ─────────────────────────────────────────────
// SICUREZZA — Messaggi per l'utente
// ─────────────────────────────────────────────

export const COPY_SECURITY = {
  /** Input bloccato */
  inputBlocked:
    "La tua richiesta contiene elementi che non posso elaborare. Prova a riformularla in modo diverso.",

  /** Output bloccato */
  outputBlocked:
    "Non posso mostrare questa risposta perché non ha superato i controlli di sicurezza. Prova a riformulare la domanda.",

  /** Link rimosso */
  linkRemoved: "[link non verificato]",
} as const;

// ─────────────────────────────────────────────
// ERRORI — Motore di risposta
// ─────────────────────────────────────────────

export const COPY_ERRORS = {
  connectionError:
    "Non riesco a generare una risposta al momento.\n\nControlla che il motore di risposta sia attivo sul tuo computer. Se il problema persiste, verifica le impostazioni.",

  modelNotFound: (model: string) =>
    `Il motore di risposta "${model}" non è stato trovato. Potrebbe essere necessario installarlo.`,

  apiError: (status: number) =>
    `Il motore di risposta ha restituito un errore (codice ${status}).`,

  timeout:
    "La risposta ha richiesto troppo tempo. Prova di nuovo o controlla che il motore sia attivo.",

  offline:
    "Non riesco a contattare il motore di risposta. Controlla che sia attivo sul tuo computer.",
} as const;

// ─────────────────────────────────────────────
// IMPOSTAZIONI
// ─────────────────────────────────────────────

export const COPY_SETTINGS = {
  /** Profilo */
  profileSectionTitle: "I tuoi dati personali",
  profileDescription:
    "Questi dati sono memorizzati esclusivamente sul tuo computer e vengono utilizzati all'interno dell'applicazione di orientamento.",
  saveButton: "Salva modifiche",
  savingButton: "Salvataggio...",
  saveSuccess: "Modifiche salvate.",
  saveErrorTitle: "Verifica i dati inseriti",

  /** Motore AI */
  engineSectionTitle: "Motore di risposta",
  engineDescription:
    "Configura il motore che elabora le risposte direttamente sul tuo dispositivo.",
  engineEndpointLabel: "Indirizzo del motore",
  engineModelLabel: "Nome del motore",
  engineTimeoutLabel: "Tempo massimo di attesa (ms)",
  engineRewriteLabel: "Migliora automaticamente le ricerche",
  engineRewriteDesc:
    "Riformula automaticamente le tue domande per trovare informazioni più pertinenti nei documenti.",

  /** Sicurezza */
  securitySectionTitle: "Protezione e sicurezza",
  securityDescription:
    "Attiva i controlli automatici per proteggere la chat da richieste anomale o contenuti sospetti.",
  securityToggleLabel: "Protezione attiva",
  securityToggleDesc:
    "Controlla automaticamente le richieste, i documenti e le risposte per maggiore sicurezza.",
  protectionLevelLabel: "Livello di protezione",
  protectionLevelDesc:
    "Normale (filtra i rischi evidenti) o Massima (blocca anche i rischi potenziali).",
  protectionLevelNormal: "Normale",
  protectionLevelMax: "Massima",

  /** Privacy */
  dataStatusLabel: "I tuoi dati:",
  dataStatusValue: "Salvati in sicurezza sul tuo dispositivo",
  geolocDesc:
    "Consente all'app di individuare gli uffici pubblici più vicini a te.",

  /** Accessibilità */
  ttsLabel: "Lettura vocale",
  ttsDesc:
    "Mostra i pulsanti per ascoltare la lettura vocale dei contenuti principali dell'applicazione.",
} as const;

// ─────────────────────────────────────────────
// TITOLI PAGINE
// ─────────────────────────────────────────────

export const COPY_PAGES = {
  settingsTitle: "Impostazioni",
  settingsSubtitle: "Preferenze e configurazione",
  profileTitle: "Il tuo profilo",
  profileSubtitle: "Dati personali e consensi",
} as const;

// ─────────────────────────────────────────────
// RAG CONTEXT — Etichette interne per il contesto
// ─────────────────────────────────────────────

export const COPY_RAG_CONTEXT = {
  knowledgeLabel: "DOCUMENTAZIONE",
  userDataLabel: "DATO_UTENTE",
  guideLabel: "GUIDA",
  noContextFound:
    "Nessuna informazione pertinente trovata nei documenti disponibili.",
} as const;

// ─────────────────────────────────────────────
// SUGGERIMENTI CHAT — Deep-link
// ─────────────────────────────────────────────

export const COPY_SUGGESTIONS = {
  configEngine: "Come configuro il motore di risposta?",
  recommendedSettings: "Quali impostazioni consigli?",
} as const;
