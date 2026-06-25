import React, { useState } from "react";
import { Scadenza, PrioritaScadenza } from "../types";
import { 
  CalendarIcon, 
  CheckCircledIcon, 
  ArrowRightIcon,
  PlusIcon
} from "@radix-ui/react-icons";

export interface ScadenzeProps {
  scadenze: Scadenza[];
  onToggleScadenza: (id: string) => void;
  onNavigateToPercorso: (percorsoId: string) => void;
  onAddScadenza: (titolo: string, descrizione: string, data: string, priorita: PrioritaScadenza) => void;
}

export const Scadenze: React.FC<ScadenzeProps> = ({
  scadenze,
  onToggleScadenza,
  onNavigateToPercorso,
  onAddScadenza
}) => {
  const [filterActive, setFilterActive] = useState<"tutte" | "in_sospeso" | "completate">("in_sospeso");
  
  // States for adding a new deadline
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<PrioritaScadenza>("media");

  const filteredScadenze = scadenze.filter(s => {
    if (filterActive === "in_sospeso") return !s.completata;
    if (filterActive === "completate") return s.completata;
    return true;
  }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const getPriorityBadge = (prio: PrioritaScadenza) => {
    switch (prio) {
      case "alta":
        return <span style={{ color: "var(--color-danger)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Priorità Alta</span>;
      case "media":
        return <span style={{ color: "var(--color-warning)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Priorità Media</span>;
      case "bassa":
      default:
        return <span style={{ color: "var(--color-text-secondary)", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>Priorità Bassa</span>;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    onAddScadenza(newTitle, newDesc, newDate, newPriority);
    setNewTitle("");
    setNewDesc("");
    setNewDate("");
    setNewPriority("media");
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Scadenze e Appuntamenti</h2>
          <p className="page-subtitle">Tieni traccia delle date di convocazione, termini per le integrazioni e scadenze degli adempimenti sui portali.</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ gap: "6px" }}
          >
            <PlusIcon /> {showAddForm ? "Chiudi Modulo" : "Aggiungi Scadenza"}
          </button>
        </div>
      </div>

      {/* Modulo di inserimento */}
      {showAddForm && (
        <div className="card w-full mb-lg" style={{ padding: "var(--space-lg)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", marginBottom: "var(--space-md)" }}>
            Nuovo Promemoria Scadenza
          </h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label" htmlFor="scad-title">Titolo Scadenza <span className="required">*</span></label>
              <input 
                id="scad-title"
                className="form-input" 
                type="text" 
                placeholder="Es. Presentazione modulo INPS, Appuntamento anagrafe..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label" htmlFor="scad-desc">Descrizione / Istruzioni</label>
              <textarea 
                id="scad-desc"
                className="form-textarea" 
                placeholder="Dettagli utili per il completamento del passaggio..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="scad-date">Data Scadenza <span className="required">*</span></label>
              <input 
                id="scad-date"
                className="form-input" 
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="scad-prio">Priorità</label>
              <select 
                id="scad-prio"
                className="form-select"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as PrioritaScadenza)}
              >
                <option value="bassa">Bassa</option>
                <option value="media">Media</option>
                <option value="alta">Alta (Urgente)</option>
              </select>
            </div>

            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button type="button" className="btn btn-tertiary" onClick={() => setShowAddForm(false)}>Annulla</button>
              <button type="submit" className="btn btn-primary">Salva Scadenza</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtri Vista */}
      <div className="card w-full mb-lg" style={{ padding: "var(--space-md)" }}>
        <div 
          className="flex" 
          style={{ 
            borderBottom: "1px solid var(--color-border)",
            gap: "var(--space-xs)",
            overflowX: "auto",
            paddingBottom: "1px"
          }}
          role="tablist"
          aria-label="Filtra scadenze"
        >
          {([
            { id: "in_sospeso", label: "In sospeso" },
            { id: "completate", label: "Completate" },
            { id: "tutte", label: "Tutte le scadenze" }
          ] as const).map((tab) => {
            const isSelected = filterActive === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setFilterActive(tab.id)}
                style={{
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                  color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontWeight: isSelected ? "700" : "600",
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

      {/* Elenco Scadenze */}
      {filteredScadenze.length === 0 ? (
        <div className="card w-full" style={{ padding: "var(--space-xxl)", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
            Nessuna scadenza da mostrare
          </h3>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Non ci sono scadenze che corrispondono al filtro impostato.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {filteredScadenze.map((scad) => {
            const isUrgent = scad.priorita === "alta" && !scad.completata;
            const daysLeft = Math.ceil((new Date(scad.data).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            
            return (
              <div 
                key={scad.id} 
                className="list-item" 
                style={{ 
                  padding: "var(--space-md) var(--space-lg)",
                  backgroundColor: scad.completata ? "rgba(0, 135, 90, 0.01)" : "var(--color-surface)",
                  borderLeft: isUrgent ? "5px solid var(--color-danger)" : "1px solid var(--color-border)"
                }}
              >
                <div className="list-item-left" style={{ flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={scad.completata}
                    onChange={() => onToggleScadenza(scad.id)}
                    style={{ 
                      width: "20px", 
                      height: "20px", 
                      cursor: "pointer",
                      accentColor: "var(--color-primary)" 
                    }}
                    aria-label={`Segna come completata: ${scad.titolo}`}
                  />
                  
                  <div className="list-item-content" style={{ marginLeft: "var(--space-md)", flex: 1 }}>
                    <div className="flex items-center gap-sm" style={{ flexWrap: "wrap" }}>
                      <span className="list-item-title" style={{ 
                        fontSize: "1rem", 
                        fontWeight: 700,
                        textDecoration: scad.completata ? "line-through" : "none",
                        color: scad.completata ? "var(--color-text-disabled)" : "var(--color-text-primary)"
                      }}>
                        {scad.titolo}
                      </span>
                      
                      {!scad.completata && getPriorityBadge(scad.priorita)}
                    </div>
                    
                    <p style={{ 
                      fontSize: "0.85rem", 
                      color: "var(--color-text-secondary)", 
                      marginTop: "2px",
                      textDecoration: scad.completata ? "line-through" : "none"
                    }}>
                      {scad.descrizione}
                    </p>

                    <div className="flex items-center gap-sm mt-xs" style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CalendarIcon /> Termine: <strong>{scad.data}</strong>
                      </span>
                      
                      {!scad.completata && daysLeft >= 0 && (
                        <span style={{ color: daysLeft <= 5 ? "var(--color-danger)" : "var(--color-warning)", fontWeight: 700 }}>
                          ({daysLeft} giorni rimanenti)
                        </span>
                      )}

                      {scad.collegatoAPercorsoId && scad.percorsoTitolo && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => onNavigateToPercorso(scad.collegatoAPercorsoId!)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-primary)",
                              fontWeight: 700,
                              cursor: "pointer",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "2px",
                              textDecoration: "underline"
                            }}
                          >
                            Vedi guida collegata <ArrowRightIcon style={{ width: "12px" }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="list-item-right" style={{ flexShrink: 0 }}>
                  {scad.completata && (
                    <span style={{ color: "var(--color-success)", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 700 }}>
                      <CheckCircledIcon /> Eseguita
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
