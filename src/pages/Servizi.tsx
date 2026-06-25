import React, { useState } from "react";
import { Servizio } from "../types";
import { MagnifyingGlassIcon, EnterIcon, StarFilledIcon, Cross2Icon } from "@radix-ui/react-icons";

export interface ServiziProps {
  servizi: Servizio[];
  onStartPercorso: (servizioId: string) => void;
}

export const Servizi: React.FC<ServiziProps> = ({
  servizi,
  onStartPercorso
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("tutte");

  // Get unique categories
  const categories = ["tutte", ...Array.from(new Set(servizi.map(s => s.categoria)))];

  // Filter services
  const filteredServizi = servizi.filter((s) => {
    const matchesSearch = 
      s.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descrizione.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ufficioCompetente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "tutte" || s.categoria === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Catalogo delle Guide ai Servizi</h2>
          <p className="page-subtitle">Sfoglia le guide disponibili per capire come richiedere i servizi pubblici sui portali ufficiali della PA.</p>
        </div>
      </div>

      {/* Ricerca e Filtro Categoria */}
      <div className="card w-full mb-lg" style={{ padding: "var(--space-md)", gap: "var(--space-md)" }}>
        <div className="flex justify-between items-center" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
          <div className="search-wrapper">
            <label htmlFor="search-servizi" className="sr-only">Cerca servizio pubblico</label>
            <MagnifyingGlassIcon className="search-icon-inside" aria-hidden="true" />
            <input
              id="search-servizi"
              type="text"
              className="search-input"
              placeholder="Cerca per nome servizio, parole chiave, ente..."
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

        {/* Tab Categorie */}
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
          aria-label="Filtra servizi per categoria"
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            const label = cat === "tutte" ? "Tutti i servizi" : cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setActiveCategory(cat)}
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
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Griglia Servizi */}
      {filteredServizi.length === 0 ? (
        <div className="card w-full" style={{ padding: "var(--space-xxl)", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
            Nessuna guida disponibile
          </h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            La ricerca non ha prodotto risultati. Prova a inserire parole chiave differenti.
          </p>
          <button 
            className="btn btn-secondary"
            onClick={() => { setSearchTerm(""); setActiveCategory("tutte"); }}
          >
            Ripristina catalogo
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-lg)" }}>
          {filteredServizi.map((srv) => (
            <div key={srv.id} className="card w-full" style={{ height: "100%", justifyContent: "space-between" }}>
              <div className="card-body" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase" }}>
                      {srv.categoria}
                    </span>
                    {srv.popolare && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "0.75rem", color: "var(--color-warning)", fontWeight: 600 }}>
                        <StarFilledIcon /> Consigliato
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-dark-blue)", lineHeight: 1.3, marginBottom: "var(--space-xs)" }}>
                    {srv.titolo}
                  </h3>
                  
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: "1.4" }}>
                    {srv.descrizione}
                  </p>
                </div>

                {/* Requisiti */}
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                    Requisiti di base necessari:
                  </h4>
                  <ul style={{ paddingLeft: "18px", fontSize: "0.8rem", color: "var(--color-text-secondary)", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {srv.requisiti.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Portale PA */}
                <div style={{ backgroundColor: "var(--color-background)", padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Portale PA di completamento:</span>
                  <span style={{ display: "block", color: "var(--color-primary)", marginTop: "2px", fontWeight: 600 }}>
                    {srv.nomePortaleUfficiale}
                  </span>
                </div>

                {/* Metadati */}
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-sm)", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)" }}>Tempo medio di istruttoria: </span>
                    <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{srv.tempoStimato}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)" }}>Ufficio competente: </span>
                    <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{srv.ufficioCompetente}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer" style={{ padding: "var(--space-md) var(--space-lg)" }}>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => onStartPercorso(srv.id)}
                  style={{ gap: "6px" }}
                >
                  Apri Guida al Servizio <EnterIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
