import { useState } from "react";
import "./App.css";


// Import mock data
import { SERVIZI_MOCK } from "./mockData";

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
import { ProfiloUtente } from "./pages/ProfiloUtente";
import { Onboarding } from "./pages/Onboarding";

// Import hooks
import { useAppState } from "./hooks/useAppState";

/**
 * Componente principale dell'applicazione (Root Router & Layout).
 * Delega lo stato globale e le azioni a useAppState.
 */
function App() {
  // Stato e logica estratti nell'hook custom
  const {
    profilo,
    percorsi,
    documenti,
    scadenze,
    messaggi,
    updateProfile,
    resetApp,
    toggleScadenza,
    addScadenza,
    stepForward,
    stepBackward,
    uploadDocument,
    removeDocument,
    startPercorso,
    uploadNewDoc,
    deleteDoc,
    sendMessage
  } = useAppState();

  // Stato della Navigazione locale della UI
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [selectedPercorsoId, setSelectedPercorsoId] = useState<string | null>(null);

  // Mappa i titoli e sottotitoli delle pagine per la barra superiore
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
        return { title: "Profilo Utente Locale", subtitle: "Informazioni utente e consensi memorizzati nel dispositivo" };
      default:
        return { title: "Guida Servizi", subtitle: "Repubblica Italiana" };
    }
  };

  const navMeta = getPageTitleAndSubtitle();

  // Gestione cambi di rotta
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

  // Wrapper per avviare un percorso e reindirizzare l'utente
  const handleStartPercorso = (servizioId: string) => {
    const newId = startPercorso(servizioId);
    if (newId) {
      handleSelectPercorso(newId);
    }
  };

  // Se l'onboarding non è completato, forza la schermata iniziale a pieno schermo
  if (!profilo || !profilo.onboardingCompletato) {
    return <Onboarding onComplete={(nuovoProfilo) => updateProfile(nuovoProfilo)} />;
  }

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={handleNavigate}
      pageTitle={navMeta.title}
      pageSubtitle={navMeta.subtitle}
      userName={`${profilo.nome} ${profilo.cognome}`}
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
          onUploadDocument={uploadDocument}
          onRemoveDocument={removeDocument}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
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
          onUploadNewDoc={uploadNewDoc}
          onDeleteDoc={deleteDoc}
          onNavigateToPercorso={handleSelectPercorso}
        />
      )}

      {currentPage === "assistente" && (
        <Assistente
          messaggi={messaggi}
          onSendMessage={sendMessage}
          onNavigate={handleNavigate}
          onSelectPercorso={handleSelectPercorso}
        />
      )}

      {currentPage === "scadenze" && (
        <Scadenze
          scadenze={scadenze}
          onToggleScadenza={toggleScadenza}
          onNavigateToPercorso={handleSelectPercorso}
          onAddScadenza={addScadenza}
        />
      )}

      {currentPage === "profilo" && (
        <ProfiloUtente
          profilo={profilo}
          onUpdate={updateProfile}
          onReset={resetApp}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "impostazioni" && (
        <Impostazioni
          profilo={profilo}
          onUpdate={updateProfile}
        />
      )}
    </AppShell>
  );
}

export default App;
