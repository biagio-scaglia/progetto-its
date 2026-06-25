import React, { useState } from "react";
import { Percorso, Scadenza, Documento } from "../types";
import { Alert } from "../components/ui/Alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { SearchBanner } from "../components/dashboard/SearchBanner";
import { SummaryWidgets } from "../components/dashboard/SummaryWidgets";
import { ActiveGuidesList } from "../components/dashboard/ActiveGuidesList";
import { RecommendedSteps } from "../components/dashboard/RecommendedSteps";

export interface DashboardProps {
  percorsi: Percorso[];
  scadenze: Scadenza[];
  documenti: Documento[];
  onNavigate: (page: string) => void;
  onSelectPercorso: (percorsoId: string) => void;
}

/**
 * Pagina di Dashboard iniziale (Home) dell'applicazione.
 * Integra e coordina i sotto-componenti di visualizzazione.
 */
export const Dashboard: React.FC<DashboardProps> = ({
  percorsi,
  scadenze,
  documenti,
  onNavigate,
  onSelectPercorso
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const percorsiAttivi = percorsi.filter(p => p.stato === "in_corso" || p.stato === "da_verificare").length;
  const scadenzePendenti = scadenze.filter(s => !s.completata).length;
  const totalDocumenti = documenti.length;

  const percorsoUrgente = percorsi.find(p => p.stato === "da_verificare");
  const activeGuides = percorsi.slice(0, 3);

  const formatMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("it-IT", { month: "short" }).replace(".", "");
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("servizi");
    }
  };

  return (
    <div>
      {/* Intestazione Orientativa */}
      <div className="page-header" style={{ marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="page-title">Guida ai Servizi Pubblici</h2>
          <p className="page-subtitle">Il tuo compagno digitale per orientarti tra i portali dello Stato (INPS, ANPR) e completare i passaggi corretti.</p>
        </div>
      </div>

      {/* Avviso di integrazione urgente */}
      {percorsoUrgente && (
        <Alert variant="warning" title="Azione Richiesta: Documento da integrare">
          Nel percorso <strong>{percorsoUrgente.titolo}</strong> è emersa una richiesta di integrazione sul portale ufficiale dell'ente. 
          <button 
            onClick={() => onSelectPercorso(percorsoUrgente.id)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-primary)",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginLeft: "10px",
              textDecoration: "underline"
            }}
          >
            Vedi cosa fare
          </button>
        </Alert>
      )}

      {/* Barra di ricerca centrale */}
      <SearchBanner 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSubmit={handleSearchSubmit} 
      />

      {/* Widget statistici */}
      <SummaryWidgets 
        percorsiAttivi={percorsiAttivi} 
        scadenzePendenti={scadenzePendenti} 
        totalDocumenti={totalDocumenti} 
        onNavigate={onNavigate} 
      />

      {/* Griglia della Dashboard */}
      <div className="grid-dashboard mt-lg">
        {/* Colonna Sinistra */}
        <section className="col-8" aria-label="I miei percorsi di guida">
          {/* Lista guide attive */}
          <ActiveGuidesList 
            activeGuides={activeGuides} 
            onNavigate={onNavigate} 
            onSelectPercorso={onSelectPercorso} 
          />

          {/* Box Spiegazione Filosofia Software */}
          <div className="card w-full" style={{ borderLeft: "5px solid var(--color-primary)" }}>
            <div className="card-body" style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
              <InfoCircledIcon style={{ width: "24px", height: "24px", color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Come funziona questo software?
                </h4>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: "1.4" }}>
                  Questa applicazione desktop è una <strong>guida privata e personale</strong> che ti aiuta a preparare i documenti necessari e a seguire l'ordine corretto dei passaggi per ciascun servizio pubblico. 
                  Non invia dati finti e non sostituisce i siti della PA: ti fornisce spiegazioni chiare e link rapidi per accedere in sicurezza ai portali ufficiali dell'INPS, dell'ANPR o del tuo Comune.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Colonna Destra */}
        <section className="col-4" aria-label="Prossimi passi e servizi consigliati">
          {/* Prossimi Passi consigliati */}
          <RecommendedSteps 
            scadenze={scadenze} 
            formatMonth={formatMonth} 
            formatDay={formatDay} 
          />

          {/* Servizi Popolari */}
          <div className="card w-full">
            <div className="card-header">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>Guide più cercate</h3>
            </div>
            <div className="card-body" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => onNavigate("servizi")}
                style={{ justifyContent: "space-between", padding: "8px 12px", fontSize: "0.9rem" }}
              >
                <span>Cambio Residenza online</span>
              </button>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => onNavigate("servizi")}
                style={{ justifyContent: "space-between", padding: "8px 12px", fontSize: "0.9rem" }}
              >
                <span>Rilascio della CIE</span>
              </button>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => onNavigate("assistente")}
                style={{ justifyContent: "space-between", padding: "8px 12px", fontSize: "0.9rem" }}
              >
                <span>Chiedi aiuto all'Assistente</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
