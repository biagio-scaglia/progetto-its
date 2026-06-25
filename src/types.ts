export type StatoPercorso = 'bozza' | 'in_corso' | 'completato' | 'scaduto';

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
  cose?: string; // Cos'è
  aCosaServe?: string; // A cosa serve
  cosaServePrima?: string; // Cosa ti serve prima di iniziare
  problemiFrequenti?: string[]; // Problemi frequenti
  noteImportanti?: string; // Note importanti
  fontiRiferimenti?: string[]; // Fonti / riferimenti ufficiali
  dataUltimoAggiornamento?: string; // Data ultimo aggiornamento
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
  passiNomi?: string[];
  passiDettagli?: string[];
  cose?: string; // Cos'è
  aCosaServe?: string; // A cosa serve
  cosaServePrima?: string; // Cosa ti serve prima di iniziare
  problemiFrequenti?: string[]; // Problemi frequenti
  noteImportanti?: string; // Note importanti
  fontiRiferimenti?: string[]; // Fonti / riferimenti ufficiali
  dataUltimoAggiornamento?: string; // Data ultimo aggiornamento
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

export interface ProfiloUtente {
  nome: string;
  cognome: string;
  comune: string;
  provincia?: string;
  email?: string;
  cellulare?: string;
  onboardingCompletato: boolean;
  consensoPrivacy: boolean;
  consensoGeolocalizzazione: boolean;
  dataRegistrazione?: string;
}
