import { useState, useEffect } from "react";
import "./App.css";

// Import types
import { Percorso, Documento, Scadenza, Messaggio, PrioritaScadenza, SpidSessionState } from "./types";

// Import mock data
import {
  PERCORSI_MOCK,
  DOCUMENTI_MOCK,
  SCADENZE_MOCK,
  SERVIZI_MOCK,
  ASSISTENTE_INITIAL_MESSAGGI
} from "./mockData";

// Import layout & pages
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Pratiche } from "./pages/Pratiche";
import { PaginaGuida } from "./pages/PaginaGuida";
import { Servizi } from "./pages/Servizi";
import { Documenti } from "./pages/Documenti";
import { Assistente } from "./pages/Assistente";
import { Scadenze } from "./pages/Scadenze";
import { Impostazioni } from "./pages/Impostazioni";
import { ProfiloDigitale } from "./pages/ProfiloDigitale";
import { SpidService } from "./services/spidService";

function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [selectedPercorsoId, setSelectedPercorsoId] = useState<string | null>(null);

  // SPID Session State
  const [spidSession, setSpidSession] = useState<SpidSessionState>({
    isAuthenticated: false
  });

  // Entities States
  const [percorsi, setPercorsi] = useState<Percorso[]>(PERCORSI_MOCK);
  const [documenti, setDocumenti] = useState<Documento[]>(DOCUMENTI_MOCK);
  const [scadenze, setScadenze] = useState<Scadenza[]>(SCADENZE_MOCK);
  const [messaggi, setMessaggi] = useState<Messaggio[]>(ASSISTENTE_INITIAL_MESSAGGI);

  // Catch redirected SPID token from local Auth companion
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Clear token from URL address bar for aesthetics and security
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const fetchProfile = async () => {
        try {
          const profile = await SpidService.getCittadinoProfile(token);
          setSpidSession({
            isAuthenticated: true,
            token,
            profilo: profile,
            dataAutenticazione: new Date().toISOString(),
            scadenzaSessione: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          });
          setCurrentPage("profilo");
        } catch (err) {
          console.error("Errore nel recupero del profilo tramite token:", err);
        }
      };
      fetchProfile();
    }
  }, []);

  // Active titles based on currentPage
  const getPageTitleAndSubtitle = () => {
    switch (currentPage) {
      case "dashboard":
        return { title: "Software di Guida ai Servizi", subtitle: "Orientamento per il cittadino • Torino" };
      case "pratiche":
        return { title: "I tuoi Percorsi di Guida", subtitle: "Stato dei percorsi di compilazione aperti" };
      case "dettaglio-pratica": {
        const p = percorsi.find(x => x.id === selectedPercorsoId);
        return { title: p ? p.titolo : "Pagina Guida Servizio", subtitle: p ? `Codice Guida: ${p.codice}` : "Guida Pubblica" };
      }
      case "servizi":
        return { title: "Catalogo delle Guide", subtitle: "Sfoglia e trova le istruzioni per i servizi digitali" };
      case "documenti":
        return { title: "Archivio Documenti", subtitle: "Raccogli i tuoi documenti utili in locale" };
      case "assistente":
        return { title: "Assistente per l'Orientamento", subtitle: "Chiedi aiuto su documenti e passaggi burocratici" };
      case "scadenze":
        return { title: "Date e Scadenze Utili", subtitle: "Promemoria per procedimenti ed adempimenti" };
      case "impostazioni":
        return { title: "Opzioni e Profilo Locale", subtitle: "Configura il comportamento dell'applicazione" };
      case "profilo":
        return { title: "Profilo Digitale", subtitle: "Identità SPID / CIE • Stato di autenticazione" };
      default:
        return { title: "Guida Servizi", subtitle: "Repubblica Italiana" };
    }
  };

  const navMeta = getPageTitleAndSubtitle();

  // Navigation handlers
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== "dettaglio-pratica") {
      setSelectedPercorsoId(null);
    }
  };

  const handleSelectPercorso = (percorsoId: string) => {
    setSelectedPercorsoId(percorsoId);
    setCurrentPage("dettaglio-pratica");
  };

  // Scadenza toggle handler
  const handleToggleScadenza = (id: string) => {
    setScadenze(prev =>
      prev.map(s => (s.id === id ? { ...s, completata: !s.completata } : s))
    );
  };

  // Add custom Scadenza
  const handleAddScadenza = (titolo: string, descrizione: string, data: string, priorita: PrioritaScadenza) => {
    const newScad: Scadenza = {
      id: `scad-${Date.now()}`,
      titolo,
      descrizione,
      data,
      priorita,
      completata: false
    };
    setScadenze(prev => [newScad, ...prev]);
  };

  // Step Forward Handler
  const handleStepForward = (percorsoId: string) => {
    setPercorsi(prev =>
      prev.map(p => {
        if (p.id !== percorsoId) return p;
        
        const nextStep = p.passoCorrente + 1;
        const isFinished = nextStep >= p.totalePassi;
        
        const newEvent = {
          id: `ev-step-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: isFinished ? "Percorso Guida Concluso" : "Passo Completato",
          descrizione: isFinished 
            ? `Hai completato tutti i passaggi della guida per: ${p.titolo}.` 
            : `Completato il passo: ${p.passiNomi[p.passoCorrente]}. Ora sei al passo: ${p.passiNomi[nextStep]}.`
        };

        return {
          ...p,
          passoCorrente: isFinished ? p.passoCorrente : nextStep,
          stato: isFinished ? "completato" as const : p.stato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      })
    );
  };

  // Step Backward Handler
  const handleStepBackward = (percorsoId: string) => {
    setPercorsi(prev =>
      prev.map(p => {
        if (p.id !== percorsoId) return p;
        
        const prevStep = Math.max(0, p.passoCorrente - 1);
        
        const newEvent = {
          id: `ev-step-back-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Ritorno al Passo Precedente",
          descrizione: `Sei ritornato al passo: ${p.passiNomi[prevStep]}.`
        };

        return {
          ...p,
          passoCorrente: prevStep,
          stato: p.stato === "completato" ? "in_corso" as const : p.stato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      })
    );
  };

  // Upload document linked to a practice checklist item
  const handleUploadDocument = (percorsoId: string, checklistItemId: string, fileNome: string) => {
    const newDocId = `doc-${Date.now()}`;
    const targetPercorso = percorsi.find(p => p.id === percorsoId);

    // 1. Add to documents list
    const newDoc: Documento = {
      id: newDocId,
      nome: fileNome,
      tipo: fileNome.split(".").pop()?.toUpperCase() || "PDF",
      dimensione: "245 KB",
      dataCaricamento: new Date().toISOString().split("T")[0],
      collegatoAPercorsoId: percorsoId,
      percorsoTitolo: targetPercorso?.titolo,
      stato: "valido"
    };
    setDocumenti(prev => [newDoc, ...prev]);

    // 2. Update Checklist and evaluate status transition
    setPercorsi(prev =>
      prev.map(p => {
        if (p.id !== percorsoId) return p;

        const updatedChecklist = p.documentiNecessari.map(item =>
          item.id === checklistItemId
            ? { ...item, completato: true, documentoId: newDocId }
            : item
        );

        // Check if all mandatory documents are now uploaded
        const allMandatoryCompleted = updatedChecklist
          .filter(item => item.obbligatorio)
          .every(item => item.completato);

        let newStato = p.stato;
        
        // Simulate step forward if integration was required
        if (p.stato === "da_verificare" && allMandatoryCompleted) {
          newStato = "in_corso";
        }

        // Add history event
        const newEvent = {
          id: `ev-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Documento Spuntato",
          descrizione: `Hai registrato la presenza del file: ${fileNome} per la checklist di controllo.`
        };

        return {
          ...p,
          documentiNecessari: updatedChecklist,
          stato: newStato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      })
    );
  };

  // Remove document from checklist
  const handleRemoveDocument = (percorsoId: string, checklistItemId: string) => {
    let docIdToRemove: string | undefined;

    setPercorsi(prev =>
      prev.map(p => {
        if (p.id !== percorsoId) return p;

        const updatedChecklist = p.documentiNecessari.map(item => {
          if (item.id === checklistItemId) {
            docIdToRemove = item.documentoId;
            return { ...item, completato: false, documentoId: undefined };
          }
          return item;
        });

        const targetItem = p.documentiNecessari.find(i => i.id === checklistItemId);
        let newStato = p.stato;
        if (targetItem?.obbligatorio && p.stato === "in_corso") {
          newStato = "da_verificare";
        }

        const newEvent = {
          id: `ev-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Documento Rimosso",
          descrizione: "Hai deselezionato un documento obbligatorio. La checklist risulta incompleta."
        };

        return {
          ...p,
          documentiNecessari: updatedChecklist,
          stato: newStato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      })
    );

    // Delete standalone document
    if (docIdToRemove) {
      setDocumenti(prev => prev.filter(d => d.id !== docIdToRemove));
    }
  };

  // Start new Guided Path from service portal
  const handleStartPercorso = (servizioId: string) => {
    const srv = SERVIZI_MOCK.find(s => s.id === servizioId);
    if (!srv) return;

    // Check if we already have this practice open
    const exists = percorsi.find(p => p.titolo.toLowerCase().includes(srv.titolo.toLowerCase()) && p.stato !== "completato");
    if (exists) {
      handleSelectPercorso(exists.id);
      return;
    }

    // Create a new guided path
    const newPercorsoId = `percorso-${Date.now()}`;
    const randomCode = `GUIDA-NEW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPercorso: Percorso = {
      id: newPercorsoId,
      codice: randomCode,
      titolo: `Guida per: ${srv.titolo}`,
      descrizione: srv.descrizione,
      categoria: srv.categoria,
      stato: "bozza",
      dataAggiornamento: new Date().toISOString().split("T")[0],
      passoCorrente: 0,
      totalePassi: 3,
      passiNomi: ["Prepara Requisiti", "Collegamento Portale PA", "Conferma Domanda"],
      passiDettagli: [
        `Assicurati di possedere i seguenti requisiti: ${srv.requisiti.join(", ")}.`,
        `Accedi al portale ufficiale "${srv.nomePortaleUfficiale}" all'indirizzo ${srv.linkPortaleUfficiale} usando la tua identità digitale.`,
        `Una volta inviata la domanda sul portale ministeriale, segna come concluso questo percorso di guida.`
      ],
      documentiNecessari: srv.requisiti.map((req, index) => ({
        id: `chk-new-${index}-${Date.now()}`,
        testo: req,
        completato: false,
        obbligatorio: index === 0
      })),
      cronologia: [
        {
          id: `ev-new-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Percorso Guida Attivato",
          descrizione: `Hai attivato la guida per: ${srv.titolo}. Segui i passi descritti.`
        }
      ],
      linkPortaleUfficiale: srv.linkPortaleUfficiale,
      nomePortaleUfficiale: srv.nomePortaleUfficiale
    };

    setPercorsi(prev => [newPercorso, ...prev]);
    handleSelectPercorso(newPercorsoId);
  };

  // Upload new standalone document
  const handleUploadNewDoc = (nome: string, tipo: string, dimensione: string) => {
    const newDoc: Documento = {
      id: `doc-${Date.now()}`,
      nome,
      tipo,
      dimensione,
      dataCaricamento: new Date().toISOString().split("T")[0],
      stato: "valido"
    };
    setDocumenti(prev => [newDoc, ...prev]);
  };

  // Delete standalone document
  const handleDeleteDoc = (id: string) => {
    setDocumenti(prev => prev.filter(d => d.id !== id));
    
    // Reset checklists referencing this document
    setPercorsi(prev =>
      prev.map(p => ({
        ...p,
        documentiNecessari: p.documentiNecessari.map(item =>
          item.documentoId === id
            ? { ...item, completato: false, documentoId: undefined }
            : item
        )
      }))
    );
  };

  // Chat message submit handler
  const handleSendMessage = (testo: string) => {
    const userMsg: Messaggio = {
      id: `msg-user-${Date.now()}`,
      mittente: "utente",
      testo,
      timestamp: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    };

    setMessaggi(prev => [...prev, userMsg]);

    // Schedule automated response
    setTimeout(() => {
      let replyText = "";
      let linkInterno: string | undefined;
      let linkTesto: string | undefined;
      let suggerimenti: string[] = [];

      const query = testo.toLowerCase();

      if (query.includes("scadenz") || query.includes("calendar")) {
        const inSospeso = scadenze.filter(s => !s.completata);
        replyText = `Attualmente hai ${inSospeso.length} scadenze amministrative importanti in sospeso:\n` +
          inSospeso.map(s => `• ${s.titolo} (entro il ${s.data})`).join("\n") +
          `\n\nPuoi visualizzare e aggiungere promemoria nel calendario delle scadenze.`;
        linkInterno = "scadenze";
        linkTesto = "Apri Calendario Scadenze";
        suggerimenti = ["Documenti per il Cambio di Residenza", "Come posso rinnovare la CIE?"];
      } else if (query.includes("cie") || query.includes("carta d'identità") || query.includes("carta identita")) {
        const cie = percorsi.find(p => p.id === "percorso-1");
        if (cie) {
          replyText = `Hai una guida attiva per il rilascio della CIE (${cie.codice}).\n` +
            `Sei al passo: "${cie.passiNomi[cie.passoCorrente]}".\n` +
            `Il tuo appuntamento in Comune è programmato per il 2 luglio 2026 alle ore 10:30.\n` +
            `Ricordati di raccogliere tutti i documenti obbligatori (foto tessera e ricevuta PagoPA) prima di recarti allo sportello.`;
          linkInterno = "percorso-1";
          linkTesto = "Apri Guida CIE";
        } else {
          replyText = `Per richiedere la Carta d'Identità Elettronica (CIE), devi prenotare un appuntamento sul portale ministeriale e pagare i diritti di segreteria (€22,21). Vuoi che ti mostri la guida?`;
          linkInterno = "servizi";
          linkTesto = "Sfoglia Catalogo Guide";
        }
        suggerimenti = ["Quali sono le mie scadenze?", "Come cambio residenza?"];
      } else if (query.includes("residenza")) {
        const res = percorsi.find(p => p.id === "percorso-3");
        if (res) {
          replyText = `Hai aperto la guida al 'Cambio di Residenza online'.\n` +
            `Sei al passo: "${res.passiNomi[res.passoCorrente]}" (${res.passiDettagli[res.passoCorrente]}).\n` +
            `Per compilare la domanda ufficiale, dovrai accedere con SPID/CIE al Portale ANPR Nazionale.`;
          linkInterno = "percorso-3";
          linkTesto = "Apri Guida Residenza";
        } else {
          replyText = `Il Cambio di Residenza online si compila sul portale nazionale ANPR. Avvia il percorso guida nel catalogo dei servizi per controllare l'elenco dei documenti catastali necessari.`;
          linkInterno = "servizi";
          linkTesto = "Sfoglia Catalogo Guide";
        }
        suggerimenti = ["Come richiedo l'Assegno Unico?", "Vedi le mie scadenze"];
      } else if (query.includes("assegno") || query.includes("inps")) {
        const au = percorsi.find(p => p.id === "percorso-2");
        if (au && au.stato === "da_verificare") {
          replyText = `Attenzione: Per l'Assegno Unico INPS hai una richiesta di integrazione documenti in sospeso.\n` +
            `L'INPS richiede il caricamento del modulo di responsabilità firmato dall'altro genitore entro il 15 luglio 2026.`;
          linkInterno = "percorso-2";
          linkTesto = "Apri Guida Assegno Unico";
        } else {
          replyText = `L'Assegno Unico INPS richiede di compilare la domanda inserendo i dati dei figli e l'IBAN per l'accredito sul portale MyINPS. Ti consiglio di calcolare l'ISEE 2026 per ottenere la quota corretta.`;
          linkInterno = "servizi";
          linkTesto = "Apri Catalogo Guide";
        }
        suggerimenti = ["Documenti per il Cambio di Residenza", "Mostrami le mie scadenze"];
      } else {
        replyText = `Ho ricevuto la tua richiesta: "${testo}".\n\nIn quanto Software di Guida, posso darti istruzioni pratiche su come procedere. Prova a chiedermi delle "scadenze", del "Cambio di Residenza", della "CIE" o dell'assegno "INPS".`;
        suggerimenti = ["Quali sono le mie scadenze?", "Come cambio residenza?", "Documenti per la CIE"];
      }

      const assistantMsg: Messaggio = {
        id: `msg-ast-${Date.now()}`,
        mittente: "assistente",
        testo: replyText,
        timestamp: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        linkInterno,
        linkTesto,
        suggerimenti
      };

      setMessaggi(prev => [...prev, assistantMsg]);
    }, 850);
  };

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={handleNavigate}
      pageTitle={navMeta.title}
      pageSubtitle={navMeta.subtitle}
    >
      {currentPage === "dashboard" && (
        <Dashboard
          percorsi={percorsi}
          scadenze={scadenze}
          documenti={documenti}
          onNavigate={handleNavigate}
          onSelectPercorso={handleSelectPercorso}
        />
      )}

      {currentPage === "pratiche" && (
        <Pratiche
          percorsi={percorsi}
          onSelectPercorso={handleSelectPercorso}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "dettaglio-pratica" && selectedPercorsoId && (
        <PaginaGuida
          percorso={percorsi.find(p => p.id === selectedPercorsoId)!}
          documenti={documenti}
          onBack={() => handleNavigate("pratiche")}
          onUploadDocument={handleUploadDocument}
          onRemoveDocument={handleRemoveDocument}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
        />
      )}

      {currentPage === "servizi" && (
        <Servizi
          servizi={SERVIZI_MOCK}
          onStartPercorso={handleStartPercorso}
        />
      )}

      {currentPage === "documenti" && (
        <Documenti
          documenti={documenti}
          onUploadNewDoc={handleUploadNewDoc}
          onDeleteDoc={handleDeleteDoc}
          onNavigateToPercorso={handleSelectPercorso}
        />
      )}

      {currentPage === "assistente" && (
        <Assistente
          messaggi={messaggi}
          onSendMessage={handleSendMessage}
          onNavigate={handleNavigate}
          onSelectPercorso={handleSelectPercorso}
        />
      )}

      {currentPage === "scadenze" && (
        <Scadenze
          scadenze={scadenze}
          onToggleScadenza={handleToggleScadenza}
          onNavigateToPercorso={handleSelectPercorso}
          onAddScadenza={handleAddScadenza}
        />
      )}

      {currentPage === "profilo" && (
        <ProfiloDigitale
          session={spidSession}
          onLoginSuccess={(newSession) => setSpidSession(newSession)}
          onLogout={() => setSpidSession({ isAuthenticated: false })}
        />
      )}

      {currentPage === "impostazioni" && (
        <Impostazioni />
      )}
    </AppShell>
  );
}

export default App;
