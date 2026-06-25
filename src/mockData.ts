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
    stato: "in_corso",
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
  },
  {
    id: "percorso-spid",
    codice: "GUIDA-SPID-2026",
    titolo: "Guida a SPID",
    descrizione: "Guida ufficiale per ottenere e usare il Sistema Pubblico di Identità Digitale.",
    categoria: "Identità Digitale",
    stato: "in_corso",
    dataAggiornamento: "2026-06-25",
    passoCorrente: 1,
    totalePassi: 4,
    passiNomi: [
      "Scelta dell'Identity Provider",
      "Registrazione dei dati personali",
      "Riconoscimento dell'identità",
      "Configurazione dell'accesso con App"
    ],
    passiDettagli: [
      "Confronta e seleziona uno dei gestori di identità accreditati (es. Poste Italiane, Aruba, Lepida, Sielte, InfoCert) sul sito ufficiale SPID.",
      "Inserisci i dati anagrafici e i contatti (e-mail e cellulare) sul portale web del gestore selezionato.",
      "Scegli la modalità di identificazione: di persona presso ufficio, online tramite webcam (spesso a pagamento), oppure gratuitamente usando CIE o CNS con lettore smart card.",
      "Crea nome utente e password, quindi scarica l'app del gestore (es. PosteID, ArubaID) per generare codici OTP o autorizzare gli accessi tramite notifica push."
    ],
    documentiNecessari: [
      { id: "chk-spid-1", testo: "Documento di identità italiano valido (carta d'identità, passaporto o patente)", completato: true, obbligatorio: true },
      { id: "chk-spid-2", testo: "Tessera sanitaria o tesserino del codice fiscale", completato: true, obbligatorio: true },
      { id: "chk-spid-3", testo: "Indirizzo e-mail personale valido", completato: false, obbligatorio: true },
      { id: "chk-spid-4", testo: "Numero di cellulare attivo intestato o in uso", completato: false, obbligatorio: true }
    ],
    cronologia: [
      { id: "ev-spid-1", data: "25-06-2026 10:00", titolo: "Inizio Guida SPID", descrizione: "Avviata la consultazione dei requisiti necessari per lo SPID." },
      { id: "ev-spid-2", data: "25-06-2026 10:15", titolo: "Scelta Gestore", descrizione: "Selezionato il gestore dell'identità e letti i prerequisiti." }
    ],
    linkPortaleUfficiale: "https://www.spid.gov.it/",
    nomePortaleUfficiale: "Sito Ufficiale SPID",
    cose: "Il Sistema Pubblico di Identità Digitale (SPID) è l'identità digitale del cittadino e delle imprese, garantita dallo Stato, che consente l'accesso protetto a tutti i servizi digitali pubblici e privati convenzionati.",
    aCosaServe: "SPID consente di accedere a centinaia di servizi telematici della Pubblica Amministrazione con le stesse credenziali, come il cassetto fiscale dell'Agenzia delle Entrate, i servizi previdenziali INPS, il fascicolo sanitario elettronico regional e la domanda di cambio residenza.",
    cosaServePrima: "Prima di iniziare, tieni a portata di mano un documento d'identità italiano valido, il codice fiscale o tessera sanitaria, e assicurati di poter accedere immediatamente sia all'e-mail che al telefono cellulare per ricevere i codici di verifica.",
    problemiFrequenti: [
      "Mancata ricezione dell'SMS con codice OTP: verifica la ricezione del segnale o la presenza di blocchi operatore per SMS a sovrapprezzo.",
      "Account bloccato dopo 3 tentativi di accesso errati: attendi il tempo di sblocco automatico (solitamente 15-30 minuti) o effettua il ripristino password.",
      "Riconoscimento tramite webcam fallito: assicurati di trovarti in una stanza ben illuminata e di avere una connessione stabile."
    ],
    noteImportanti: "Lo SPID per uso personale per i cittadini è gratuito per sempre. Eventuali costi possono essere legati solo al servizio di video-riconoscimento assistito via webcam con operatore, a seconda del provider scelto.",
    fontiRiferimenti: [
      "Agenzia per l'Italia Digitale (AgID) - https://www.agid.gov.it/",
      "Sito Ufficiale SPID - https://www.spid.gov.it/",
      "Dipartimento per la trasformazione digitale - https://innovazione.gov.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "percorso-cie",
    codice: "GUIDA-CIE-2026",
    titolo: "Guida alla CIE",
    descrizione: "Istruzioni per attivare e utilizzare la Carta d'Identità Elettronica come identità digitale.",
    categoria: "Identità Digitale",
    stato: "bozza",
    dataAggiornamento: "2026-06-25",
    passoCorrente: 0,
    totalePassi: 4,
    passiNomi: [
      "Recupero dei codici PIN e PUK",
      "Installazione dell'applicazione CieID",
      "Registrazione del documento nell'App",
      "Autenticazione nei portali web"
    ],
    passiDettagli: [
      "Recupera le prime 4 cifre del PIN e del PUK sulla ricevuta cartacea rilasciata dall'anagrafe comunale e le restanti 4 cifre nella lettera raccomandata ricevuta a casa con la carta fisica.",
      "Scarica e installa l'applicazione gratuita CieID sul tuo smartphone da Google Play Store o Apple App Store.",
      "Abilita l'NFC nelle impostazioni del telefono. Avvia l'app CieID, inserisci il PIN di 8 cifre e tieni la carta appoggiata sul retro del cellulare finché la barra di caricamento non è completa.",
      "Seleziona 'Entra con CIE' sul portale pubblico, inquadra il codice QR mostrato sullo schermo con l'app CieID, inserisci le ultime 4 cifre del PIN e appoggia la carta al retro dello smartphone."
    ],
    documentiNecessari: [
      { id: "chk-cie-1", testo: "Carta d'Identità Elettronica (CIE 3.0) rilasciata dal Comune", completato: false, obbligatorio: true },
      { id: "chk-cie-2", testo: "Codice PIN completo di 8 cifre", completato: false, obbligatorio: true },
      { id: "chk-cie-3", testo: "Codice PUK completo di 8 cifre", completato: false, obbligatorio: true },
      { id: "chk-cie-4", testo: "Smartphone dotato di tecnologia NFC o lettore smart card USB contactless", completato: false, obbligatorio: true }
    ],
    cronologia: [
      { id: "ev-cie-1", data: "25-06-2026 11:30", titolo: "Guida CIE Selezionata", descrizione: "Aperto il percorso per l'attivazione dell'identità digitale CIE." }
    ],
    linkPortaleUfficiale: "https://www.cartaidentita.interno.gov.it/",
    nomePortaleUfficiale: "Portale Carta d'Identità Elettronica",
    cose: "La Carta d'Identità Elettronica (CIE) è il documento d'identità emesso dallo Stato italiano che, oltre a certificare l'identità fisica, consente l'accesso digitale sicuro di Livello 3 (il massimo livello di sicurezza previsto) ai servizi online.",
    aCosaServe: "Consente l'accesso a tutti i servizi telematici della Pubblica Amministrazione (INPS, ANPR, Agenzia delle Entrate, Sanità) e permette di firmare documenti digitali tramite apposite soluzioni di firma elettronica avanzata.",
    cosaServePrima: "Prima di procedere, assicurati di disporre dei codici PIN e PUK cartacei forniti in fase di rilascio del documento e verifica che il tuo dispositivo mobile supporti le connessioni contactless NFC.",
    problemiFrequenti: [
      "La carta non viene rilevata dall'NFC dello smartphone: rimuovi custodie spesse, posiziona la carta piatta sul retro dello smartphone e attendi la vibrazione iniziale senza muoverla.",
      "Codice PIN smarrito: puoi sbloccarlo o modificarlo inserendo il PUK nell'applicazione CieID o nel software per computer.",
      "Impossibilità di usare la CIE su computer: richiede un lettore smart card contactless USB abbinato al Middleware CIE ufficiale scaricabile dal portale del Ministero."
    ],
    noteImportanti: "Il PIN della CIE è composto da 8 cifre. Non inserire il PIN a 4 cifre del bancomat o della carta di credito. Se inserisci il PIN errato per 3 volte, la carta si blocca e richiede l'inserimento del PUK per lo sblocco.",
    fontiRiferimenti: [
      "Ministero dell'Interno - Ufficio Centrale della CIE - https://www.cartaidentita.interno.gov.it/",
      "Istituto Poligrafico e Zecca dello Stato (IPZS) - https://www.ipzs.it/",
      "Developers Italia - https://developers.italia.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
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
  },
  {
    id: "srv-spid",
    titolo: "Guida a SPID",
    descrizione: "Guida ufficiale per ottenere e usare il Sistema Pubblico di Identità Digitale.",
    categoria: "Identità Digitale",
    requisiti: [
      "Documento di identità italiano valido (carta d'identità, passaporto o patente)",
      "Tessera sanitaria o tesserino del codice fiscale",
      "Indirizzo e-mail personale valido",
      "Numero di cellulare attivo intestato o in uso"
    ],
    tempoStimato: "15 minuti",
    ufficioCompetente: "AgID - Agenzia per l'Italia Digitale",
    linkPortaleUfficiale: "https://www.spid.gov.it/",
    nomePortaleUfficiale: "Sito Ufficiale SPID",
    popolare: true,
    passiNomi: [
      "Scelta dell'Identity Provider",
      "Registrazione dei dati personali",
      "Riconoscimento dell'identità",
      "Configurazione dell'accesso con App"
    ],
    passiDettagli: [
      "Confronta e seleziona uno dei gestori di identità accreditati (es. Poste Italiane, Aruba, Lepida, Sielte, InfoCert) sul sito ufficiale SPID.",
      "Inserisci i dati anagrafici e i contatti (e-mail e cellulare) sul portale web del gestore selezionato.",
      "Scegli la modalità di identificazione: di persona presso ufficio, online tramite webcam (spesso a pagamento), oppure gratuitamente usando CIE o CNS con lettore smart card.",
      "Crea nome utente e password, quindi scarica l'app del gestore (es. PosteID, ArubaID) per generare codici OTP o autorizzare gli accessi tramite notifica push."
    ],
    cose: "Il Sistema Pubblico di Identità Digitale (SPID) è l'identità digitale del cittadino e delle imprese, garantita dallo Stato, che consente l'accesso protetto a tutti i servizi digitali pubblici e privati convenzionati.",
    aCosaServe: "SPID consente di accedere a centinaia di servizi telematici della Pubblica Amministrazione con le stesse credenziali, come il cassetto fiscale dell'Agenzia delle Entrate, i servizi previdenziali INPS, il fascicolo sanitario elettronico regionale e la domanda di cambio residenza.",
    cosaServePrima: "Prima di iniziare, tieni a portata di mano un documento d'identità italiano valido, il codice fiscale o tessera sanitaria, e assicurati di poter accedere immediatamente sia all'e-mail che al telefono cellulare per ricevere i codici di verifica.",
    problemiFrequenti: [
      "Mancata ricezione dell'SMS con codice OTP: verifica la ricezione del segnale o la presenza di blocchi operatore per SMS a sovrapprezzo.",
      "Account bloccato dopo 3 tentativi di accesso errati: attendi il tempo di sblocco automatico (solitamente 15-30 minuti) o effettua il ripristino password.",
      "Riconoscimento tramite webcam fallito: assicurati di trovarti in una stanza ben illuminata e di avere una connessione stabile."
    ],
    noteImportanti: "Lo SPID per uso personale per i cittadini è gratuito per sempre. Eventuali costi possono essere legati solo al servizio di video-riconoscimento assistito via webcam con operatore, a seconda del provider scelto.",
    fontiRiferimenti: [
      "Agenzia per l'Italia Digitale (AgID) - https://www.agid.gov.it/",
      "Sito Ufficiale SPID - https://www.spid.gov.it/",
      "Dipartimento per la trasformazione digitale - https://innovazione.gov.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "srv-cie-digitale",
    titolo: "Guida alla CIE",
    descrizione: "Istruzioni per attivare e utilizzare la Carta d'Identità Elettronica come identità digitale.",
    categoria: "Identità Digitale",
    requisiti: [
      "Carta d'Identità Elettronica (CIE 3.0) rilasciata dal Comune",
      "Codice PIN completo di 8 cifre (prima metà in Comune, seconda metà con la busta)",
      "Codice PUK completo di 8 cifre",
      "Smartphone dotato di tecnologia NFC o lettore smart card USB contactless per computer"
    ],
    tempoStimato: "10 minuti",
    ufficioCompetente: "Ministero dell'Interno / IPZS",
    linkPortaleUfficiale: "https://www.cartaidentita.interno.gov.it/",
    nomePortaleUfficiale: "Portale Carta d'Identità Elettronica",
    popolare: true,
    passiNomi: [
      "Recupero dei codici PIN e PUK",
      "Installazione dell'applicazione CieID",
      "Registrazione del documento nell'App",
      "Autenticazione nei portali web"
    ],
    passiDettagli: [
      "Recupera le prime 4 cifre del PIN e del PUK sulla ricevuta cartacea rilasciata dall'anagrafe comunale e le restanti 4 cifre nella lettera raccomandata ricevuta a casa con la carta fisica.",
      "Scarica e installa l'applicazione gratuita CieID sul tuo smartphone da Google Play Store o Apple App Store.",
      "Abilita l'NFC nelle impostazioni del telefono. Avvia l'app CieID, inserisci il PIN di 8 cifre e tieni la carta appoggiata sul retro del cellulare finché la barra di caricamento non è completa.",
      "Seleziona 'Entra con CIE' sul portale pubblico, inquadra il codice QR mostrato sullo schermo con l'app CieID, inserisci le ultime 4 cifre del PIN e appoggia la carta al retro dello smartphone."
    ],
    cose: "La Carta d'Identità Elettronica (CIE) è il documento d'identità emesso dallo Stato italiano che, oltre a certificare l'identità fisica, consente l'accesso digitale sicuro di Livello 3 (il massimo livello di sicurezza previsto) ai servizi online.",
    aCosaServe: "Consente l'accesso a tutti i servizi telematici della Pubblica Amministrazione (INPS, ANPR, Agenzia delle Entrate, Sanità) e permette di firmare documenti digitali tramite apposite soluzioni di firma elettronica avanzata.",
    cosaServePrima: "Prima di procedere, assicurati di disporre dei codici PIN e PUK cartacei forniti in fase di rilascio del documento e verifica che il tuo dispositivo mobile supporti le connessioni contactless NFC.",
    problemiFrequenti: [
      "La carta non viene rilevata dall'NFC dello smartphone: rimuovi custodie spesse, posiziona la carta piatta sul retro dello smartphone e attendi la vibrazione iniziale senza muoverla.",
      "Codice PIN smarrito: puoi sbloccarlo o modificarlo inserendo il PUK nell'applicazione CieID o nel software per computer.",
      "Impossibilità di usare la CIE su computer: richiede un lettore smart card contactless USB abbinato al Middleware CIE ufficiale scaricabile dal portale del Ministero."
    ],
    noteImportanti: "Il PIN della CIE è composto da 8 cifre. Non inserire il PIN a 4 cifre del bancomat o della carta di credito. Se inserisci il PIN errato per 3 volte, la carta si blocca e richiede l'inserimento del PUK per lo sblocco.",
    fontiRiferimenti: [
      "Ministero dell'Interno - Ufficio Centrale della CIE - https://www.cartaidentita.interno.gov.it/",
      "Istituto Poligrafico e Zecca dello Stato (IPZS) - https://www.ipzs.it/",
      "Developers Italia - https://developers.italia.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "srv-spid-cie-diff",
    titolo: "Differenze tra SPID e CIE",
    descrizione: "Confronto operativo, vantaggi e livelli di sicurezza tra SPID e Carta d'Identità Elettronica.",
    categoria: "Identità Digitale",
    requisiti: [
      "Comprensione dei vantaggi e limiti di ciascun sistema di identità digitale"
    ],
    tempoStimato: "5 minuti",
    ufficioCompetente: "AgID / Ministero dell'Interno",
    linkPortaleUfficiale: "https://www.spid.gov.it/",
    nomePortaleUfficiale: "Portale Identità Digitale",
    popolare: false,
    passiNomi: [
      "Analisi del fattore hardware",
      "Confronto dei livelli di sicurezza",
      "Analisi delle modalità di accesso"
    ],
    passiDettagli: [
      "La CIE richiede un supporto fisico (il documento plastificato con chip NFC), mentre lo SPID è un'identità puramente software memorizzata nel cloud dei gestori di identità.",
      "La CIE garantisce nativamente l'accesso con livello di sicurezza 3 (il massimo), richiedendo possesso fisico del documento e PIN. SPID si attesta comunemente sul livello 2 (password e codice OTP temporaneo generato da app).",
      "SPID consente l'accesso rapido da qualsiasi postazione inserendo credenziali e autorizzando via app. La CIE richiede sempre l'accostamento fisico della tessera allo smartphone o ad un lettore da tavolo collegato al PC."
    ],
    cose: "SPID e CIE sono i due sistemi ufficiali italiani per l'identità digitale che permettono ai cittadini di identificarsi in sicurezza nei portali istituzionali.",
    aCosaServe: "Questo confronto serve a guidare l'utente nell'attivazione e nella scelta dello strumento più adatto in base ai dispositivi a propria disposizione e alle pratiche da svolgere online.",
    cosaServePrima: "Nessun prerequisito tecnico richiesto, la consultazione è libera e informativa per comprendere quale strumento risponda meglio alle proprie esigenze.",
    problemiFrequenti: [
      "Tentare l'accesso CIE senza chip NFC: se il telefono non possiede l'NFC, non sarà possibile usare la CIE sul cellulare, rendendo preferibile l'uso dello SPID.",
      "Scadenza del documento: la CIE cessa di funzionare digitalmente alla scadenza fisica del documento d'identità, mentre lo SPID non scade (ma richiede manutenzione periodica della password)."
    ],
    noteImportanti: "Si consiglia vivamente di attivare e mantenere funzionanti entrambi gli strumenti: lo SPID garantisce flessibilità in mobilità, mentre la CIE funge da backup affidabile e offre il massimo livello di sicurezza statale.",
    fontiRiferimenti: [
      "Agenzia per l'Italia Digitale (AgID) - https://www.spid.gov.it/domande-frequenti/",
      "Ministero dell'Interno - CIE - https://www.cartaidentita.interno.gov.it/identificazione-digitale/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "srv-problemi-spid",
    titolo: "Problemi frequenti con SPID",
    descrizione: "Risoluzione guidata delle problematiche più diffuse per l'accesso e l'attivazione dello SPID.",
    categoria: "Assistenza e Supporto",
    requisiti: [
      "Account SPID attivo o in fase di attivazione",
      "Accesso all'indirizzo e-mail o al numero di telefono associato"
    ],
    tempoStimato: "5 minuti",
    ufficioCompetente: "AgID / Provider Accreditati",
    linkPortaleUfficiale: "https://www.spid.gov.it/serve-aiuto/",
    nomePortaleUfficiale: "Area Supporto SPID",
    popolare: false,
    passiNomi: [
      "Risoluzione errori di credenziali",
      "Risoluzione mancata ricezione OTP",
      "Recupero credenziali smarrite"
    ],
    passiDettagli: [
      "Se il portale segnala errore utente o password, evita tentativi ripetuti che bloccano l'account. Utilizza immediatamente la procedura di recupero password sul sito del tuo specifico provider.",
      "Se non ricevi il messaggio SMS con il codice monouso, verifica che il telefono non sia in modalità aereo e che la memoria dei messaggi non sia piena. Valuta l'uso dell'app del provider che genera codici offline.",
      "In caso di smarrimento del nome utente o del gestore scelto, controlla nella tua casella e-mail i messaggi di avvenuta attivazione ricevuti in passato per identificare con quale provider hai registrato lo SPID."
    ],
    cose: "Questa guida raccoglie le procedure ufficiali consigliate dall'Agenzia per l'Italia Digitale per superare le problematiche di autenticazione e attivazione con i gestori di identità SPID.",
    aCosaServe: "Consente di ripristinare il corretto funzionamento delle credenziali senza dover ripetere la procedura di riconoscimento o pagare per assistenze straordinarie.",
    cosaServePrima: "Tieni sotto mano lo smartphone associato al tuo SPID e l'indirizzo e-mail che hai utilizzato in fase di registrazione iniziale.",
    problemiFrequenti: [
      "Cambio di numero di telefono: richiede l'accesso all'area riservata del provider. Se il vecchio numero è disattivato, occorre contattare il call center del provider o revocare lo SPID per farne uno nuovo.",
      "Revoca dello SPID: procedura necessaria in caso di compromissione delle credenziali o smarrimento definitivo del telefono e dei codici di sicurezza."
    ],
    noteImportanti: "AgID coordina i provider, ma la gestione tecnica delle credenziali e dello sblocco degli account spetta esclusivamente all'assistenza clienti del gestore con cui hai stipulato il contratto.",
    fontiRiferimenti: [
      "AgID - Supporto e FAQ SPID - https://www.spid.gov.it/domande-frequenti/",
      "Sito istituzionale del proprio Identity Provider (es. Poste, Aruba, Lepida)"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "srv-problemi-cie",
    titolo: "Problemi frequenti con CIE",
    descrizione: "Soluzioni per lo smarrimento dei codici, la lettura NFC e la configurazione del software su computer.",
    categoria: "Assistenza e Supporto",
    requisiti: [
      "Carta d'Identità Elettronica (CIE 3.0) disponibile fisicamente",
      "Documentazione o ricevuta di rilascio del Comune"
    ],
    tempoStimato: "5 minuti",
    ufficioCompetente: "Ministero dell'Interno / Assistenza CieID",
    linkPortaleUfficiale: "https://www.cartaidentita.interno.gov.it/contatti-e-assistenza/",
    nomePortaleUfficiale: "Assistenza Ufficiale CIE",
    popolare: false,
    passiNomi: [
      "Recupero del PIN o PUK smarrito",
      "Risoluzione problemi di lettura NFC",
      "Configurazione del Software CIE su PC"
    ],
    passiDettagli: [
      "Se hai perso il PUK e hai associato la tua email alla carta, richiedilo tramite l'app CieID. Se non hai registrato l'email, devi recarti fisicamente all'anagrafe del tuo Comune con la CIE per la stampa dei codici.",
      "Per gli errori di lettura NFC, togli custodie spesse. Appoggia il documento sulla parte posteriore del telefono. Muovilo lentamente finché non vibra e lascialo fermo per l'intera durata dell'operazione.",
      "Per usare la CIE da computer senza smartphone NFC, installa il Software CIE dal sito ufficiale, collega un lettore smart card contactless USB compatibile e abbina la carta immettendo le 8 cifre del PIN."
    ],
    cose: "Guida di supporto per la risoluzione dei problemi legati alla Carta d'Identità Elettronica, con indicazioni per lo sblocco del chip e l'accoppiamento dei dispositivi elettronici.",
    aCosaServe: "Fornisce passaggi operativi ufficiali per rimediare allo smarrimento dei codici segreti PIN/PUK o per superare i blocchi hardware durante l'utilizzo dei lettori NFC.",
    cosaServePrima: "Tieni a disposizione la Carta d'Identità Elettronica fisica e la ricevuta cartacea rilasciata dal Comune se ancora in tuo possesso.",
    problemiFrequenti: [
      "Carta bloccata (PIN inserito errato per 3 volte): inserisci il codice PUK nell'app CieID o nel software per sbloccare la carta e impostare immediatamente un nuovo PIN.",
      "Smartphone incompatibile: se il telefono non supporta l'NFC o se il chip è disabilitato a livello hardware, l'app CieID non potrà funzionare."
    ],
    noteImportanti: "Il recupero dei codici PIN/PUK presso il Comune è un servizio gratuito. Non è necessario pagare alcun operatore esterno per ottenere il duplicato dei propri codici.",
    fontiRiferimenti: [
      "Ministero dell'Interno - Portale Carta d'Identità Elettronica - https://www.cartaidentita.interno.gov.it/",
      "Istituto Poligrafico e Zecca dello Stato (IPZS) - https://www.ipzs.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  },
  {
    id: "srv-servizi-online-req",
    titolo: "Cosa serve per usare SPID o CIE",
    descrizione: "Requisiti di accesso e dispositivi necessari per autenticarsi correttamente sui portali online della PA.",
    categoria: "Identità Digitale",
    requisiti: [
      "Dispositivo connesso a Internet (PC o Smartphone)",
      "Un browser web aggiornato (Chrome, Edge, Safari, Firefox)",
      "Identità SPID o Carta d'Identità Elettronica attiva"
    ],
    tempoStimato: "5 minuti",
    ufficioCompetente: "Dipartimento per la Trasformazione Digitale / AgID",
    linkPortaleUfficiale: "https://www.spid.gov.it/",
    nomePortaleUfficiale: "Sito Governativo Identità Digitale",
    popolare: false,
    passiNomi: [
      "Verifica della compatibilità del browser",
      "Predisposizione dei dispositivi mobili",
      "Scelta del livello di sicurezza richiesto"
    ],
    passiDettagli: [
      "Assicurati che il browser sul computer o smartphone sia aggiornato. Abilita i cookie e consenti i reindirizzamenti pop-up per evitare blocchi al momento del passaggio tra il sito pubblico e l'autenticatore.",
      "Installa sul tuo smartphone l'applicazione ufficiale del tuo gestore SPID (PosteID, ArubaID, ecc.) o l'app CieID per la Carta d'Identità Elettronica.",
      "Verifica il livello di sicurezza richiesto: per il Livello 2 (SPID standard) è sufficiente l'app sul telefono. Per il Livello 3 (CIE o SPID con hardware dedicato) è necessario accostare fisicamente la carta o inserire una chiavetta di sicurezza."
    ],
    cose: "Questa guida riassume i requisiti tecnologici minimi raccomandati per navigare e autenticarsi in totale sicurezza sui portali delle Pubbliche Amministrazioni italiane.",
    aCosaServe: "Fornisce un quadro chiaro e operativo delle dotazioni software e hardware necessarie per non incorrere in malfunzionamenti o errori di caricamento durante l'accesso ai servizi pubblici.",
    cosaServePrima: "Prepara il tuo smartphone o computer e controlla la stabilità della tua connessione Internet prima di avviare procedimenti amministrativi online.",
    problemiFrequenti: [
      "Schermata bianca dopo l'autenticazione: pulisci la cache del browser o prova a utilizzare una finestra di navigazione in incognito.",
      "Incompatibilità sistemi operativi obsoleti: i protocolli di sicurezza moderni potrebbero non supportare versioni molto vecchie di Windows (es. Windows 7 o precedenti) o di Android."
    ],
    noteImportanti: "Conserva le credenziali in un luogo sicuro e non memorizzarle su computer pubblici. L'accesso ai servizi online tramite SPID o CIE equivale alla firma autografa sul modulo cartaceo.",
    fontiRiferimenti: [
      "AgID - Regole tecniche per l'identità digitale - https://www.agid.gov.it/",
      "Dipartimento per la Trasformazione Digitale - https://innovazione.gov.it/",
      "Developers Italia - https://developers.italia.it/"
    ],
    dataUltimoAggiornamento: "2026-06-25"
  }
];

export const ASSISTENTE_INITIAL_MESSAGGI: Messaggio[] = [
  {
    id: "msg-1",
    mittente: "assistente",
    testo: "Gentile cittadino, benvenuto nell'Assistente di Guida ai Servizi Pubblici.\nSono qui per orientarti tra i passaggi burocratici, i documenti necessari e i portali di riferimento (es. INPS, ANPR o portali comunali).\n\nCome posso esserti utile?",
    timestamp: "12:00",
    suggerimenti: [
      "Come posso iniziare una guida?",
      "Quali servizi digitali posso consultare?",
      "Come si aggiunge una scadenza?"
    ]
  }
];
