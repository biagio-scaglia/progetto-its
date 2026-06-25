export type StatoPercorso = 'bozza' | 'in_corso' | 'completato' | 'da_verificare' | 'scaduto';

export interface DocumentoRichiesto {
  id: string;
  testo: string;
  completato: boolean;
  obbligatorio: boolean;
  documentoId?: string; // id del file caricato nell'archivio locale
}

export interface CronologiaEvento {
  id: string;
  data: string;
  titolo: string;
  descrizione: string;
}

export interface Percorso {
  id: string;
  codice: string;
  titolo: string;
  descrizione: string;
  categoria: string;
  stato: StatoPercorso;
  dataAggiornamento: string;
  passoCorrente: number;
  totalePassi: number;
  passiNomi: string[];
  passiDettagli: string[]; // Spiegazioni pratiche per ciascun passo
  documentiNecessari: DocumentoRichiesto[];
  cronologia: CronologiaEvento[];
  linkPortaleUfficiale: string; // Es. https://www.anpr.interno.it/
  nomePortaleUfficiale: string; // Es. "Portale ANPR"
  note?: string;
}

export type StatoDocumento = 'valido' | 'da_verificare' | 'scaduto';

export interface Documento {
  id: string;
  nome: string;
  tipo: string; // es. "PDF", "JPEG"
  dimensione: string;
  dataCaricamento: string;
  collegatoAPercorsoId?: string;
  percorsoTitolo?: string;
  stato: StatoDocumento;
}

export type PrioritaScadenza = 'bassa' | 'media' | 'alta';

export interface Scadenza {
  id: string;
  titolo: string;
  descrizione: string;
  data: string; // Formato YYYY-MM-DD
  priorita: PrioritaScadenza;
  completata: boolean;
  collegatoAPercorsoId?: string;
  percorsoTitolo?: string;
}

export interface Servizio {
  id: string;
  titolo: string;
  descrizione: string;
  categoria: string;
  requisiti: string[];
  tempoStimato: string;
  ufficioCompetente: string;
  linkPortaleUfficiale: string;
  nomePortaleUfficiale: string;
  popolare: boolean;
}

export interface Messaggio {
  id: string;
  mittente: 'utente' | 'assistente';
  testo: string;
  timestamp: string;
  linkInterno?: string; // per reindirizzare a parti dell'app
  linkTesto?: string;
  suggerimenti?: string[];
}

export interface ProfiloCittadino {
  spidCode?: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  sesso?: string; // M, F
  dataNascita?: string; // YYYY-MM-DD
  luogoNascita?: string;
  provinciaNascita?: string;
  email: string;
  cellulare?: string;
  indirizzoDomicilio?: string;
  pec?: string;
  providerAutenticazione?: string; // es. "PosteID", "Sielte", etc.
  tipoIdentita: "SPID" | "CIE" | "Locale";
}

export interface SpidSessionState {
  isAuthenticated: boolean;
  token?: string;
  profilo?: ProfiloCittadino;
  dataAutenticazione?: string;
  scadenzaSessione?: string;
}
