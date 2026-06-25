import React from "react";
import { Percorso } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { FileTextIcon, ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface ActiveGuidesListProps {
  activeGuides: Percorso[];
  onNavigate: (page: string) => void;
  onSelectPercorso: (percorsoId: string) => void;
}

/**
 * Componente che elenca le guide attive aperte dall'utente.
 */
export const ActiveGuidesList: React.FC<ActiveGuidesListProps> = ({
  activeGuides,
  onNavigate,
  onSelectPercorso
}) => {
  return (
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
          {activeGuides.length === 0 ? (
            <p style={{ color: "var(--color-text-disabled)", fontSize: "0.9rem", padding: "var(--space-md)", textAlign: "center" }}>
              Nessun percorso di guida attivo al momento.
            </p>
          ) : (
            activeGuides.map((percorso) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
