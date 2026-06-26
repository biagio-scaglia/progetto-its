# SDIT — Servizi Digitali Italiani (Local-First)

Questa applicazione desktop (SDIT) è uno strumento privato di guida e orientamento per i cittadini italiani nei rapporti con la Pubblica Amministrazione (es. INPS, ANPR, portali comunali). L'obiettivo principale è aiutare l'utente a comprendere i passaggi, preparare i requisiti documentali corretti e accedere in sicurezza ai link ufficiali per completare le pratiche burocratiche.

---

## 🎯 Obiettivo dell'Applicazione

A differenza di un gestionale o di un client di autenticazione ministeriale, questo software agisce come un assistente personale offline. Fornisce:
- **Orientamento e spiegazioni chiare**: Istruzioni passo-passo per servizi come il Cambio di Residenza online o il rilascio della CIE (Carta d'Identità Elettronica).
- **Checklist documentali**: Un elenco dettagliato dei requisiti e dei documenti necessari da verificare prima di effettuare le istanze sui portali istituzionali.
- **Privacy totale e archiviazione offline**: Tutti i dati anagrafici, i consensi e i documenti caricati rimangono esclusivamente all'interno del dispositivo dell'utente.

---

## 🛠️ Stack Tecnico

L'applicazione è sviluppata con tecnologie moderne, sicure e performanti:
- **Framework Desktop**: [Tauri v2](https://tauri.app/) (backend Rust leggero e sicuro, frontend HTML5/JS/TS).
- **Frontend Core**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) per una gestione robusta dei tipi.
- **Bundler e Build System**: [Vite](https://vite.dev/).
- **Design System & Stile**: CSS Vanilla ispirato alle linee guida istituzionali dei servizi digitali pubblici italiani (*Designers Italia*), con layout a contrasto accessibile e solo tema chiaro (Light Theme).
- **Iconografia**: Icone vettoriali ad alta definizione fornite da `@radix-ui/react-icons`.

---

## 📁 Struttura Principale delle Cartelle

Il progetto segue una netta separazione delle responsabilità tra interfaccia utente, logica di stato e persistenza dei dati:

```text
progetto.its/
├── src/
│   ├── assets/             # Risorse statiche (immagini, loghi)
│   ├── components/
│   │   ├── layout/         # Componenti della shell dell'app (AppShell, Sidebar, TopBar)
│   │   ├── ui/             # Componenti grafici primitivi (Alert, Button, Badge, StatusBadge)
│   │   ├── dashboard/      # Sotto-componenti modulari della Home (SearchBanner, SummaryWidgets, ecc.)
│   │   └── guida/          # Sotto-componenti della pagina di dettaglio della guida (StepList, DocumentChecklist)
│   ├── hooks/
│   │   └── useAppState.ts  # Hook custom che centralizza lo stato globale e le azioni di business
│   ├── pages/              # Schermate principali (Dashboard, Servizi, Documenti, Assistente, Onboarding, ecc.)
│   ├── repositories/       # Classi per l'interazione con il database locale (localStorage)
│   │   ├── profileRepository.ts
│   │   ├── percorsiRepository.ts
│   │   ├── documentiRepository.ts
│   │   ├── scadenzeRepository.ts
│   │   └── chatRepository.ts
│   ├── mockData.ts         # Dati demo iniziali caricati al primo avvio del database locale
│   ├── types.ts            # Definizioni dei tipi TypeScript del dominio applicativo
│   ├── App.tsx             # Componente root che gestisce il routing e la shell
│   ├── App.css             # Stile CSS globale conforme alle linee guida di stile
│   └── main.tsx            # Entry point dell'applicazione React
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

## 🚀 Come Avviare il Progetto Locamente

### Requisiti
- Node.js (v18+) e `npm`.

### Procedura di Avvio

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Avvia il server di sviluppo locale:
   ```bash
   npm run dev
   ```
   *Nota: L'applicazione web sarà accessibile all'indirizzo `http://localhost:1420`.*

3. Esegui la build di produzione per verificare la correttezza del codice:
   ```bash
   npm run build
   ```

---

## 📈 Prossimi Step Sviluppo

1. **Integrazione File System Tauri**: Migrare la scrittura dei file dei documenti e dei file JSON di configurazione dal `localStorage` alle directory protette dell'utente (`$APP_DATA_DIR`) tramite le API native Rust di Tauri.
2. **Integrazione Geolocalizzazione Reale**: Sostituire il lookup geografico simulato con il rilevamento reale del GPS tramite plugin ufficiale Tauri Core `geolocation`, mantenendo sempre il consenso facoltativo abilitato dall'utente.
