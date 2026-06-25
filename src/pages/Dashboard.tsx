import React, { useState } from "react";
import { Percorso, Scadenza, Documento } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Alert } from "../components/ui/Alert";
import { 
  FileTextIcon, 
  ClockIcon, 
  ArchiveIcon, 
  ChevronRightIcon, 
  ArrowRightIcon,
  MagnifyingGlassIcon,
  InfoCircledIcon,
  ExternalLinkIcon
} from "@radix-ui/react-icons";

export interface DashboardProps {
  percorsi: Percorso[];
  scadenze: Scadenza[];
  documenti: Documento[];
  onNavigate: (page: string) => void;
  onSelectPercorso: (percorsoId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  percorsi,
  scadenze,
  documenti,
  onNavigate,
  onSelectPercorso
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter paths active
  const percorsiAttivi = percorsi.filter(p => p.stato === "in_corso" || p.stato === "da_verificare").length;
  const scadenzePendenti = scadenze.filter(s => !s.completata).length;
  const totalDocumenti = documenti.length;

  const percorsoUrgente = percorsi.find(p => p.stato === "da_verificare");

  // Get most recent 3 active guides
  const activeGuides = percorsi.slice(0, 3);

  // Formats to simulate next actions
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

      {/* Barra di ricerca centrale per orientamento */}
      <div className="card w-full mb-lg" style={{ padding: "var(--space-lg)", backgroundColor: "var(--color-primary-light)", border: "1px solid var(--color-info-border)" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "var(--space-sm)" }}>
          Quale servizio o adempimento devi svolgere?
        </h3>
        <form onSubmit={handleSearchSubmit} className="search-wrapper" style={{ maxWidth: "600px" }}>
          <label htmlFor="search-home" className="sr-only">Cerca servizi o guide</label>
          <MagnifyingGlassIcon className="search-icon-inside" aria-hidden="true" />
          <input
            id="search-home"
            type="text"
            className="search-input"
            style={{ backgroundColor: "var(--color-surface)" }}
            placeholder="Es. Rinnovo Carta d'Identità, Cambio di Residenza, Assegno Unico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "var(--space-sm)" }}>
          Digita una parola chiave per trovare la pagina guida corretta con i requisiti, i documenti necessari e i link ai portali ufficiali.
        </p>
      </div>

      {/* Widget statistici */}
      <div className="summary-grid">
        <div className="summary-card" onClick={() => onNavigate("pratiche")} style={{ cursor: "pointer" }}>
          <div className="summary-card-icon blue">
            <FileTextIcon />
          </div>
          <div className="summary-card-data">
            <span className="summary-card-value">{percorsiAttivi}</span>
            <span className="summary-card-label">Guide e Percorsi attivi</span>
          </div>
        </div>

        <div className="summary-card" onClick={() => onNavigate("scadenze")} style={{ cursor: "pointer" }}>
          <div className="summary-card-icon orange">
            <ClockIcon />
          </div>
          <div className="summary-card-data">
            <span className="summary-card-value">{scadenzePendenti}</span>
            <span className="summary-card-label">Date e Scadenze utili</span>
          </div>
        </div>

        <div className="summary-card" onClick={() => onNavigate("documenti")} style={{ cursor: "pointer" }}>
          <div className="summary-card-icon green">
            <ArchiveIcon />
          </div>
          <div className="summary-card-data">
            <span className="summary-card-value">{totalDocumenti}</span>
            <span className="summary-card-label">Documenti pronti in archivio</span>
          </div>
        </div>
      </div>

      {/* Griglia della Dashboard */}
      <div className="grid-dashboard mt-lg">
        {/* Colonna Sinistra */}
        <section className="col-8" aria-label="I miei percorsi di guida">
          {/* Percorsi Attivi */}
          <div className="card w-full mb-lg">
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>I tuoi percorsi di guida aperti</h3>
              <button 
                className="btn btn-tertiary" 
                onClick={() => onNavigate("pratiche")}
                style={{ fontSize: "0.85rem", padding: "4px 8px" }}
              >
                Vedi tutti <ArrowRightIcon style={{ marginLeft: "4px" }} />
              </button>
            </div>
            
            <div className="card-body" style={{ padding: "var(--space-md)" }}>
              <div className="list-group">
                {activeGuides.map((percorso) => (
                  <div 
                    key={percorso.id} 
                    className="list-item"
                    onClick={() => onSelectPercorso(percorso.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="list-item-left">
                      <div className="list-item-icon">
                        <FileTextIcon />
                      </div>
                      <div className="list-item-content">
                        <span className="list-item-title">{percorso.titolo}</span>
                        <span className="list-item-subtitle" style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                          Prossimo passo: <strong>{percorso.passiNomi[percorso.passoCorrente]}</strong>
                        </span>
                      </div>
                    </div>
                    
                    <div className="list-item-right">
                      <StatusBadge stato={percorso.stato} />
                      <ChevronRightIcon style={{ color: "var(--color-text-disabled)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
          {/* Prossimi Passi */}
          <div className="card w-full mb-lg">
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>Prossimi passi consigliati</h3>
            </div>
            
            <div className="card-body" style={{ padding: "var(--space-md)" }}>
              {scadenze.filter(s => !s.completata).length === 0 ? (
                <p style={{ color: "var(--color-text-disabled)", fontSize: "0.9rem", textAlign: "center" }}>Nessuna azione richiesta a breve.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {scadenze
                    .filter(s => !s.completata)
                    .slice(0, 3)
                    .map((scad) => {
                      const isUrgent = scad.priorita === "alta";
                      return (
                        <div key={scad.id} className="deadline-item">
                          <div className="deadline-date-box">
                            <div className="deadline-date-month" style={{ 
                              backgroundColor: isUrgent ? "var(--color-danger)" : "var(--color-dark-blue)" 
                            }}>
                              {formatMonth(scad.data)}
                            </div>
                            <div className="deadline-date-day">
                              {formatDay(scad.data)}
                            </div>
                          </div>
                          
                          <div className="deadline-info">
                            <div className="deadline-title">{scad.titolo}</div>
                            <div className="deadline-meta" style={{ fontSize: "0.75rem" }}>
                              {scad.percorsoTitolo && <span style={{ color: "var(--color-text-secondary)" }}>{scad.percorsoTitolo}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

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
                <ExternalLinkIcon />
              </button>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => onNavigate("servizi")}
                style={{ justifyContent: "space-between", padding: "8px 12px", fontSize: "0.9rem" }}
              >
                <span>Rilascio della CIE</span>
                <ExternalLinkIcon />
              </button>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => onNavigate("assistente")}
                style={{ justifyContent: "space-between", padding: "8px 12px", fontSize: "0.9rem" }}
              >
                <span>Chiedi aiuto all'Assistente</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
