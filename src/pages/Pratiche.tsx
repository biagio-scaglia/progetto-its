import React, { useState } from "react";
import { Percorso, StatoPercorso } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MagnifyingGlassIcon, PlusIcon, Cross2Icon } from "@radix-ui/react-icons";

export interface PraticheProps {
  percorsi: Percorso[];
  onSelectPercorso: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const Pratiche: React.FC<PraticheProps> = ({
  percorsi,
  onSelectPercorso,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatoPercorso | "tutte">("tutte");

  // Filter paths
  const filteredPercorsi = percorsi.filter((p) => {
    const matchesSearch = 
      p.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeFilter === "tutte" || p.stato === activeFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filterTabs: { id: StatoPercorso | "tutte"; label: string }[] = [
    { id: "tutte", label: "Tutte le guide" },
    { id: "bozza", label: "In preparazione" },
    { id: "in_corso", label: "In corso" },
    { id: "completato", label: "Completate" },
    { id: "scaduto", label: "Scadute" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">I miei Percorsi di Guida</h2>
          <p className="page-subtitle">Visualizza l'avanzamento dei percorsi aperti, controlla i documenti necessari o avvia una nuova guida.</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate("servizi")}
            style={{ gap: "6px" }}
          >
            <PlusIcon /> Nuova Guida Servizio
          </button>
        </div>
      </div>

      {/* Ricerca e Filtri */}
      <div className="card w-full mb-lg" style={{ padding: "var(--space-md)", gap: "var(--space-md)" }}>
        <div className="flex justify-between items-center" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
          
          <div className="search-wrapper">
            <label htmlFor="search-percorsi" className="sr-only">Cerca tra le guide</label>
            <MagnifyingGlassIcon className="search-icon-inside" aria-hidden="true" />
            <input
              id="search-percorsi"
              type="text"
              className="search-input"
              placeholder="Cerca per titolo, codice o categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)"
                }}
                aria-label="Cancella ricerca"
              >
                <Cross2Icon />
              </button>
            )}
          </div>
        </div>

        {/* Tab di filtro per stato */}
        <div 
          className="flex" 
          style={{ 
            marginTop: "var(--space-md)", 
            borderBottom: "1px solid var(--color-border)",
            gap: "var(--space-xs)",
            overflowX: "auto",
            paddingBottom: "1px"
          }}
          role="tablist"
          aria-label="Filtra guide per stato"
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                  color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontWeight: isSelected ? "600" : "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  outlineOffset: "-3px"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista Guide */}
      {filteredPercorsi.length === 0 ? (
        <div className="card w-full" style={{ padding: "var(--space-xxl)", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
            Nessuna guida corrispondente
          </h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            Non ci sono percorsi di guida attivi con questo stato o parola chiave. Prova ad azzerare i filtri o cercarne altri.
          </p>
          <button 
            className="btn btn-secondary"
            onClick={() => { setSearchTerm(""); setActiveFilter("tutte"); }}
          >
            Reimposta filtri
          </button>
        </div>
      ) : (
        <div className="list-group">
          {filteredPercorsi.map((percorso) => {
            const percentuale = (percorso.passoCorrente / (percorso.totalePassi - 1)) * 100;
            return (
              <div 
                key={percorso.id} 
                className="card clickable w-full"
                onClick={() => onSelectPercorso(percorso.id)}
                style={{ marginBottom: "var(--space-sm)" }}
              >
                <div className="card-body" style={{ padding: "var(--space-lg)" }}>
                  <div className="flex justify-between items-start" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
                    <div>
                      <div className="flex items-center gap-sm mb-xs" style={{ flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>
                          {percorso.categoria}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
                        {percorso.titolo}
                      </h3>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", marginBottom: "var(--space-md)" }}>
                        {percorso.descrizione}
                      </p>
                    </div>

                    <div style={{ alignSelf: "flex-start" }}>
                      <StatusBadge stato={percorso.stato} />
                    </div>
                  </div>

                  {/* Avanzamento passi */}
                  <div style={{ marginTop: "var(--space-sm)" }}>
                    <div className="flex justify-between items-center mb-xs" style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        Passo corrente: <strong>{percorso.passiNomi[percorso.passoCorrente]}</strong>
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--color-dark-blue)" }}>
                        Passo {percorso.passoCorrente + 1} di {percorso.totalePassi}
                      </span>
                    </div>
                    
                    <div style={{ 
                      width: "100%", 
                      height: "8px", 
                      backgroundColor: "var(--color-background)", 
                      borderRadius: "4px",
                      overflow: "hidden" 
                    }}>
                      <div style={{ 
                        width: `${percentuale}%`, 
                        height: "100%", 
                        backgroundColor: percorso.stato === "scaduto" ? "var(--color-danger)" : "var(--color-success)",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                </div>

                <div 
                  className="card-footer" 
                  style={{ 
                    padding: "var(--space-sm) var(--space-lg)", 
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0, 0, 0, 0.01)" 
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                    Ultimo controllo: {percorso.dataAggiornamento}
                  </span>
                  
                  <span style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px" 
                  }}>
                    Apri guida al servizio →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
