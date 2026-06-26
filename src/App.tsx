import { useState, useEffect } from "react";
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

// Import branding config
import { BRAND } from "./config/branding";

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
    geodata,
    loadingGeoloc,
    geolocError,
    updateProfile,
    resetApp,
    toggleScadenza,
    addScadenza,
    stepForward,
    stepBackward,
    startPercorso,
    uploadNewDoc,
    deleteDoc,
    sendMessage,
    clearChat,
    deleteMessage,
    richiediGeolocalizzazione,
    revocaGeolocalizzazione,
    isAiLoading
  } = useAppState();

  // Stato della Navigazione locale della UI
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [selectedPercorsoId, setSelectedPercorsoId] = useState<string | null>(null);

  // Inizializza preferenze accessibilità (zoom testo) al caricamento
  useEffect(() => {
    const isLargeText = localStorage.getItem("pref-large-text") === "true";
    if (isLargeText) {
      document.body.classList.add("accessibility-large-text");
    } else {
      document.body.classList.remove("accessibility-large-text");
    }
  }, []);

  // Listener globale per scorciatoie da tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Non attivare le scorciatoie se l'utente sta scrivendo in un campo di input
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // Alt + numero da 1 a 8 per selezionare le schede
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const key = e.key;
        const pageMap: { [key: string]: string } = {
          "1": "dashboard",
          "2": "pratiche",
          "3": "servizi",
          "4": "documenti",
          "5": "assistente",
          "6": "scadenze",
          "7": "profilo",
          "8": "impostazioni"
        };

        if (pageMap[key]) {
          e.preventDefault();
          handleNavigate(pageMap[key]);
        }
      }

      // Tasto Escape per tornare indietro se siamo in dettaglio pratica
      if (e.key === "Escape" && currentPage === "dettaglio-pratica") {
        e.preventDefault();
        handleNavigate("pratiche");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage]);

  // Forza lo scroll in alto su tutti i contenitori al cambio di pagina o guida selezionata
  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainers = [
      document.getElementById("main-content"),
      document.querySelector(".app-content-wrapper"),
      document.querySelector(".app-content"),
      document.querySelector(".app-main"),
      document.body,
      document.documentElement
    ];
    scrollContainers.forEach((el) => {
      if (el) {
        el.scrollTop = 0;
      }
    });
  }, [currentPage, selectedPercorsoId]);

  // Mappa i titoli e sottotitoli delle pagine per la barra superiore
  const getPageTitleAndSubtitle = () => {
    switch (currentPage) {
      case "dashboard": {
        const localita = profilo?.comune ? (profilo.provincia ? `${profilo.comune} (${profilo.provincia})` : profilo.comune) : "Italia";
        return { title: BRAND.fullName, subtitle: `Orientamento per il cittadino • ${localita}` };
      }
      case "pratiche":
        return { title: "I tuoi Percorsi di Guida", subtitle: "Stato dei percorsi di compilazione aperti" };
      case "dettaglio-pratica": {
        const p = percorsi.find(x => x.id === selectedPercorsoId);
        return { title: p ? p.titolo : "Pagina Guida Servizio", subtitle: p ? `${p.categoria}` : "Guida Pubblica" };
      }
      case "servizi":
        return { title: "Catalogo delle Guide", subtitle: "Sfoglia e trova le istruzioni per i servizi digitali" };
      case "documenti":
        return { title: "Archivio Documenti", subtitle: "Raccogli i tuoi documenti utili in locale" };
      case "assistente":
        return { title: BRAND.assistantName, subtitle: "Chiedi aiuto su documenti e passaggi burocratici" };
      case "scadenze":
        return { title: "Date e Scadenze Utili", subtitle: "Promemoria per procedimenti ed adempimenti" };
      case "impostazioni":
        return { title: "Opzioni e Profilo Locale", subtitle: "Configura il comportamento dell'applicazione" };
      case "profilo":
        return { title: "Profilo Utente Locale", subtitle: "Informazioni utente e consensi memorizzati nel dispositivo" };
      default:
        return { title: BRAND.name, subtitle: BRAND.tagline };
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
          onClearChat={clearChat}
          onDeleteMessage={deleteMessage}
          isAiLoading={isAiLoading}
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
          onReset={resetApp}
          onNavigate={handleNavigate}
          geodata={geodata}
          loadingGeoloc={loadingGeoloc}
          geolocError={geolocError}
          onRichiediGeolocalizzazione={richiediGeolocalizzazione}
          onRevocaGeolocalizzazione={revocaGeolocalizzazione}
        />
      )}

      {currentPage === "impostazioni" && (
        <Impostazioni
          profilo={profilo}
          onUpdate={updateProfile}
          geodata={geodata}
          onRichiediGeolocalizzazione={richiediGeolocalizzazione}
          onRevocaGeolocalizzazione={revocaGeolocalizzazione}
        />
      )}
    </AppShell>
  );
}

export default App;
