# Linee Guida per il Micro-Copy (SDIT)

Questo documento definisce le regole di stile, il glossario e i criteri di scelta del testo utente (micro-copy) per l'applicazione **SDIT (Servizi Digitali Italiani)**.

L'obiettivo è mantenere l'interfaccia **umana, chiara e adatta a cittadini comuni**, eliminando ogni traccia di gergo tecnico o da sviluppatore.

---

## 📌 Regole di Scrittura Generali

1. **Scrivi per persone normali, non per sviluppatori**: Nessuno deve aver bisogno di una laurea in ingegneria informatica per usare l'app.
2. **Usa la forma attiva e verbi concreti**: Evita costrutti burocratici o impersonali (es. *"Usa la lettura vocale"* invece di *"Si prega di abilitare la sintesi vocale"*).
3. **Sii conciso**: Frasi brevi e dritto al punto.
4. **Privilegia l'utilità e la rassicurazione**: Spiega sempre l'impatto o il beneficio per l'utente locale.
5. **Niente gergo da log**: I messaggi di errore non devono sembrare estratti da una console o da un log di sistema.

---

## 🚫 Termini Vietati in UI e Sostituzioni

| Termine Tecnico Vietato | Sostituzione Utente Consigliata | Esempio / Contesto |
| :--- | :--- | :--- |
| **Locale / Local** | *sul tuo dispositivo* / *privato* / *sicuro* | "Dati memorizzati sul tuo dispositivo" |
| **RAG** | *ricerca nei tuoi documenti* / *basata sui documenti* | "Risposta basata sui documenti disponibili" |
| **Embeddings / Vettori** | *Non mostrare mai* | Nascondere il concetto all'utente finale. |
| **Chunk** | *estratto* / *parte del documento* | "Alcuni estratti esclusi per sicurezza" |
| **Retrieval** | *ricerca* / *analisi documenti* | "Sto cercando nei tuoi documenti..." |
| **Provider** | *motore* | "Indirizzo del motore" nelle impostazioni |
| **Routing** | *scelta del motore* | "Scelta automatica del motore" |
| **Fallback** | *secondo tentativo* / *sto riprovando* | "Uso un altro motore per questa richiesta" |
| **Inference / Generazione** | *elaborazione* / *risposta* | "Elaborazione risposta sul tuo dispositivo..." |
| **Prompt** | *richiesta* / *domanda* | "La tua richiesta contiene elementi non validi" |
| **Query rewriting** | *miglioramento ricerche* | "Migliora automaticamente le ricerche" |
| **Vector store / DB** | *archivio locale* | "Dati salvati in sicurezza sul tuo dispositivo" |
| **Knowledge base** | *documentazione disponibile* | "Sto cercando nella documentazione..." |
| **Safe mode** | *protezione attiva* | "Protezione attiva sul dispositivo" |
| **Output Guard / Input Guard** | *controlli di sicurezza* | "La risposta ha fallito i controlli di sicurezza" |

---

## 👥 Livelli di Copy nell'Applicativo

### 1. UI Principale (Cittadino)
- **Nessun termine tecnico**: Interfaccia pulita, rassicurante e chiara.
- **Focus sui compiti**: "Compila", "Carica", "Controlla le scadenze".
- **Visualizzazione**: Mostrata a tutti gli utenti per impostazione predefinita.

### 2. Dettagli Tecnici / Debug (Avanzato)
- **Separato ed opzionale**: Accessibile solo cliccando su "Dettagli tecnici" nella chat.
- **Ordinato**: Permette terminologie come "Motore utilizzato" o "Rischio manipolazione input", ma mantiene un layout leggibile ed evita sigle oscure.

---

## 🛠️ Come Utilizzare il Copy Centralizzato

Tutti i testi user-facing devono essere definiti nel file centralizzato [microcopy.ts](file:///c:/Users/biagi/Desktop/progetto.its/src/config/microcopy.ts).

### Esempio in React:
```tsx
import { COPY_ASSISTANT } from "../config/microcopy";

// ...
<button>{COPY_ASSISTANT.clearButton}</button>
```
