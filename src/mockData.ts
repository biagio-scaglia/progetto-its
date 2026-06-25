import { Percorso, Documento, Scadenza, Servizio, Messaggio } from "./types";

export const PERCORSI_MOCK: Percorso[] = [
  {
    id: "percorso-1",
    codice: "GUIDA-ID-2026",
    titolo: "Guida al Rilascio della Carta d'Identità Elettronica",
    descrizione: "Percorso guidato per rinnovare o richiedere ex novo la tua carta d'identità elettronica presso l'anagrafe.",
    categoria: "Anagrafe e Stato Civile",
    stato: "in_corso",
    dataAggiornamento: "2026-06-20",
    passoCorrente: 2,
    totalePassi: 4,
    passiNomi: [
      "Prenotazione Appuntamento",
      "Preparazione Documenti",
      "Rilascio all'Anagrafe",
      "Consegna del Documento"
    ],
    passiDettagli: [
      "Accedi al Portale Ministeriale Prenotazioni e seleziona il tuo Comune per scegliere giorno e ora dell'appuntamento.",
      "Assicurati di possedere una foto tessera recente (norma ICAO), la ricevuta PagoPA del versamento (euro 22,21) e il vecchio documento.",
      "Recati all'Ufficio Anagrafe Centrale munito di documenti. Verranno acquisite le tue impronte digitali e la firma.",
      "La Carta d'Identità viene stampata dall'Istituto Poligrafico e spedita tramite raccomandata al tuo indirizzo entro 6 giorni lavorativi."
    ],
    documentiNecessari: [
      { id: "chk-1-1", testo: "Ricevuta PagoPA del pagamento dei diritti di segreteria (euro 22,21)", completato: true, obbligatorio: true, documentoId: "doc-3" },
      { id: "chk-1-2", testo: "Foto tessera a norma ICAO (recente)", completato: true, obbligatorio: true, documentoId: "doc-4" },
      { id: "chk-1-3", testo: "Vecchio documento scaduto o denuncia di smarrimento/furto", completato: false, obbligatorio: true }
    ],
    cronologia: [
      { id: "ev-1-1", data: "15-06-2026 09:30", titolo: "Inizio Percorso Guida", descrizione: "Selezionata la guida per il rilascio del documento. Iniziata la verifica dei requisiti." },
      { id: "ev-1-2", data: "18-06-2026 14:15", titolo: "Pagamento Effettuato", descrizione: "Ricevuta PagoPA caricata e spuntata nell'elenco dei requisiti." },
      { id: "ev-1-3", data: "20-06-2026 11:00", titolo: "Appuntamento Fissato", descrizione: "Registrato appuntamento comunale per il 2 luglio 2026 alle ore 10:30." }
    ],
    linkPortaleUfficiale: "https://www.cartaidentita.interno.gov.it/",
    nomePortaleUfficiale: "Portale Ministero dell'Interno",
    note: "Allo sportello anagrafe sara' necessario presentare la ricevuta di prenotazione (stampata o su smartphone) contenente il numero dell'appuntamento."
  },
  {
    id: "percorso-2",
    codice: "GUIDA-AUU-2026",
    titolo: "Guida alla Richiesta dell'Assegno Unico INPS",
    descrizione: "Procedura per richiedere il sostegno economico mensile INPS per i figli a carico.",
    categoria: "Previdenza e Sostegno",
    stato: "da_verificare",
    dataAggiornamento: "2026-06-24",
    passoCorrente: 1,
    totalePassi: 3,
    passiNomi: [
      "Calcolo ISEE 2026",
      "Invio Domanda Portale INPS",
      "Verifica Pagamenti Mensili"
    ],
    passiDettagli: [
      "Richiedi l'attestazione ISEE 2026 compilando la DSU precompilata sul sito INPS o rivolgendoti a un CAF convenzionato.",
      "Accedi all'area riservata MyINPS e inserisci i dati dei figli, il codice fiscale dell'altro genitore e l'IBAN per l'accredito.",
      "L'INPS elabora la richiesta ed effettua l'accredito mensile direttamente sul conto corrente a partire dal mese successivo."
    ],
    documentiNecessari: [
      { id: "chk-2-1", testo: "Attestazione ISEE 2026 valida", completato: true, obbligatorio: true, documentoId: "doc-2" },
      { id: "chk-2-2", testo: "Codici Fiscali dei figli minorenni o universitari", completato: true, obbligatorio: true },
      { id: "chk-2-3", testo: "Modulo di responsabilità dell'altro genitore firmato", completato: false, obbligatorio: true }
    ],
    cronologia: [
      { id: "ev-2-1", data: "10-06-2026 16:45", titolo: "Bozza Avviata", descrizione: "Lette le istruzioni INPS ed inserito l'ISEE calcolato." },
      { id: "ev-2-2", data: "24-06-2026 10:20", titolo: "Rilevata Richiesta di Integrazione", descrizione: "L'INPS richiede la firma o la dichiarazione dell'altro genitore per sbloccare la quota corretta." }
    ],
    linkPortaleUfficiale: "https://www.inps.it/",
    nomePortaleUfficiale: "Portale Istituzionale INPS",
    note: "Se non si presenta l'ISEE corretto, l'assegno verra' comunque erogato ma nella misura minima prevista dalla legge."
  },
  {
    id: "percorso-3",
    codice: "GUIDA-RES-2026",
    titolo: "Guida al Cambio di Residenza online",
    descrizione: "Come registrare la variazione di indirizzo per te e per la tua famiglia sul portale nazionale ANPR.",
    categoria: "Anagrafe e Stato Civile",
    stato: "bozza",
    dataAggiornamento: "2026-06-22",
    passoCorrente: 0,
    totalePassi: 4,
    passiNomi: [
      "Preparazione Dati Catastali",
      "Accoglienza del Nucleo",
      "Compilazione su ANPR",
      "Verifica della Polizia Locale"
    ],
    passiDettagli: [
      "Recupera i dati catastali dell'immobile, il contratto di affitto registrato o l'atto di compravendita notarile.",
      "Raccogli le foto/PDF dei documenti d'identità di tutti i familiari maggiorenni che si trasferiscono con te.",
      "Accedi ad ANPR, seleziona 'Cambio Residenza' e inserisci i moduli compilando ogni campo.",
      "L'anagrafe comunale effettuera' le verifiche entro 45 giorni dall'invio telematico."
    ],
    documentiNecessari: [
      { id: "chk-3-1", testo: "Visura catastale o contratto di locazione registrato", completato: false, obbligatorio: true },
      { id: "chk-3-2", testo: "Copie dei documenti d'identità dei familiari", completato: false, obbligatorio: false }
    ],
    cronologia: [
      { id: "ev-3-1", data: "22-06-2026 17:00", titolo: "Guida Consultata", descrizione: "Aperto il modulo di orientamento al cambio di residenza." }
    ],
    linkPortaleUfficiale: "https://www.anpr.interno.it/",
    nomePortaleUfficiale: "Anagrafe Nazionale Popolazione Residente (ANPR)",
    note: "La dichiarazione e' resa ai sensi del DPR 445/2000. Dichiarazioni mendaci sono perseguibili penalmente."
  }
];

export const DOCUMENTI_MOCK: Documento[] = [
  {
    id: "doc-1",
    nome: "Autocertificazione_Stato_Disoccupazione_2025.pdf",
    tipo: "PDF",
    dimensione: "185 KB",
    dataCaricamento: "2025-10-01",
    stato: "valido"
  },
  {
    id: "doc-2",
    nome: "Attestazione_ISEE_Ordinario_2026.pdf",
    tipo: "PDF",
    dimensione: "420 KB",
    dataCaricamento: "2026-02-14",
    collegatoAPercorsoId: "percorso-2",
    percorsoTitolo: "Guida alla Richiesta dell'Assegno Unico",
    stato: "valido"
  },
  {
    id: "doc-3",
    nome: "Ricevuta_Pagamento_PagoPA_CartaIdentita_8819.pdf",
    tipo: "PDF",
    dimensione: "94 KB",
    dataCaricamento: "2026-06-18",
    collegatoAPercorsoId: "percorso-1",
    percorsoTitolo: "Guida al Rilascio della Carta d'Identità",
    stato: "valido"
  },
  {
    id: "doc-4",
    nome: "Foto_Tessera_ICAO.jpg",
    tipo: "JPEG",
    dimensione: "1.2 MB",
    dataCaricamento: "2026-06-15",
    collegatoAPercorsoId: "percorso-1",
    percorsoTitolo: "Guida al Rilascio della Carta d'Identità",
    stato: "valido"
  },
  {
    id: "doc-5",
    nome: "Contratto_Locazione_AdE_Registrato.pdf",
    tipo: "PDF",
    dimensione: "2.1 MB",
    dataCaricamento: "2024-03-12",
    stato: "da_verificare"
  }
];

export const SCADENZE_MOCK: Scadenza[] = [
  {
    id: "scad-1",
    titolo: "Integrazione modulo Assegno Unico",
    descrizione: "Bisogna caricare la firma o il consenso dell'altro genitore sul portale INPS per evitare la decurtazione.",
    data: "2026-07-15",
    priorita: "alta",
    completata: false,
    collegatoAPercorsoId: "percorso-2",
    percorsoTitolo: "Richiesta Assegno Unico"
  },
  {
    id: "scad-2",
    titolo: "Appuntamento Anagrafe Centrale per Carta d'Identità",
    descrizione: "Presentarsi muniti di foto tessera e vecchio documento allo Sportello 3.",
    data: "2026-07-02",
    priorita: "alta",
    completata: false,
    collegatoAPercorsoId: "percorso-1",
    percorsoTitolo: "Rilascio Carta d'Identità"
  },
  {
    id: "scad-3",
    titolo: "Visita Medica Rinnovo Patente",
    descrizione: "Appuntamento prenotato presso la ASL o agenzia abilitata per la visita oculistica.",
    data: "2026-08-30",
    priorita: "media",
    completata: false
  }
];

export const SERVIZI_MOCK: Servizio[] = [
  {
    id: "srv-1",
    titolo: "Cambio di Residenza online",
    descrizione: "Guida passo-passo per trasferire la propria residenza anagrafica inserendo i dati sul portale nazionale ANPR.",
    categoria: "Anagrafe e Stato Civile",
    requisiti: ["Credenziali d'accesso personali", "Atto catastale o contratto di locazione", "Codici fiscali del nucleo"],
    tempoStimato: "45 giorni lavorativi",
    ufficioCompetente: "Ministero dell'Interno / Comune di residenza",
    linkPortaleUfficiale: "https://www.anpr.interno.it/",
    nomePortaleUfficiale: "Portale ANPR Nazionale",
    popolare: true
  },
  {
    id: "srv-2",
    titolo: "Richiesta Carta d'Identità Elettronica",
    descrizione: "Procedura per prenotare e svolgere il rinnovo della carta d'identità elettronica presso gli uffici demografici comunali.",
    categoria: "Anagrafe e Stato Civile",
    requisiti: ["Foto tessera cartacea o digitale", "Documento scaduto o denuncia", "Pagamento PagoPA di euro 22,21"],
    tempoStimato: "6 giorni dalla visita",
    ufficioCompetente: "Servizi Demografici Comunali",
    linkPortaleUfficiale: "https://www.cartaidentita.interno.gov.it/",
    nomePortaleUfficiale: "Portale Prenotazione Documento",
    popolare: true
  },
  {
    id: "srv-3",
    titolo: "Assegno Unico Figli a Carico",
    descrizione: "Istruzioni per richiedere l'Assegno Unico INPS dedicato alle famiglie con figli minorenni o studenti fino a 21 anni.",
    categoria: "Previdenza e Sostegno",
    requisiti: ["Codice fiscale dei figli", "IBAN intestato al richiedente", "ISEE minorenni 2026"],
    tempoStimato: "30 giorni",
    ufficioCompetente: "INPS (Istituto Nazionale Previdenza Sociale)",
    linkPortaleUfficiale: "https://www.inps.it/",
    nomePortaleUfficiale: "Portale Istituzionale INPS",
    popolare: true
  },
  {
    id: "srv-4",
    titolo: "Bonus Asilo Nido INPS",
    descrizione: "Come richiedere all'INPS il rimborso delle spese documentate per la retta di iscrizione ad asili nido pubblici o privati.",
    categoria: "Previdenza e Sostegno",
    requisiti: ["Fatture mensili di pagamento quietanzate", "Attestazione di iscrizione al nido", "ISEE minorenni"],
    tempoStimato: "30-60 giorni",
    ufficioCompetente: "INPS",
    linkPortaleUfficiale: "https://www.inps.it/",
    nomePortaleUfficiale: "Portale Istituzionale INPS",
    popolare: false
  }
];

export const ASSISTENTE_INITIAL_MESSAGGI: Messaggio[] = [
  {
    id: "msg-1",
    mittente: "assistente",
    testo: "Gentile cittadino, benvenuto nell'Assistente di Guida ai Servizi Pubblici.\nSono qui per orientarti tra i passaggi burocratici, i documenti necessari e i portali di riferimento (es. INPS, ANPR o portali comunali).\n\nCome posso esserti utile?",
    timestamp: "12:00",
    suggerimenti: [
      "Documenti per il Cambio di Residenza",
      "Quali sono i passi per rinnovare la Carta d'Identità?",
      "Come richiedo l'Assegno Unico?",
      "Mostrami le prossime scadenze"
    ]
  }
];
