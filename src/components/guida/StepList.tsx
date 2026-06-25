import React from "react";
import { Percorso } from "../../types";
import { CheckIcon } from "@radix-ui/react-icons";

interface StepListProps {
  percorso: Percorso;
  onStepBackward: (percorsoId: string) => void;
  onStepForward: (percorsoId: string) => void;
}

/**
 * Componente che mostra i passaggi sequenziali da seguire per completare un servizio,
 * con bottoni di avanzamento e arretramento temporale.
 */
export const StepList: React.FC<StepListProps> = ({
  percorso,
  onStepBackward,
  onStepForward
}) => {
  return (
    <div className="card w-full mb-lg">
      <div className="card-header">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
          Passaggi da seguire per completare il servizio
        </h3>
      </div>
      
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {percorso.passiNomi.map((passoName, index) => {
          const isCompleted = index < percorso.passoCorrente;
          const isActive = index === percorso.passoCorrente;
          const isPending = index > percorso.passoCorrente;
          
          return (
            <div 
              key={index} 
              style={{ 
                display: "flex", 
                gap: "var(--space-md)",
                opacity: isPending ? 0.6 : 1,
                backgroundColor: isActive ? "var(--color-background)" : "transparent",
                border: isActive ? "1px solid var(--color-border)" : "1px solid transparent",
                borderRadius: "var(--radius-md)",
                padding: isActive ? "var(--space-md)" : "var(--space-xs) var(--space-md)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div 
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: isCompleted ? "var(--color-success)" : isActive ? "var(--color-primary)" : "var(--color-gray-badge-bg)",
                    color: isCompleted || isActive ? "#ffffff" : "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    border: isActive ? "3px solid var(--color-primary-light)" : "none"
                  }}
                >
                  {isCompleted ? <CheckIcon style={{ strokeWidth: 3 }} /> : index + 1}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: "1rem", 
                  fontWeight: 700, 
                  color: isActive ? "var(--color-primary)" : "var(--color-text-primary)",
                  textDecoration: isCompleted ? "line-through" : "none"
                }}>
                  {passoName}
                </h4>
                
                {isActive && (
                  <div style={{ marginTop: "var(--space-sm)" }}>
                    <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: "1.4", marginBottom: "var(--space-md)" }}>
                      {percorso.passiDettagli[index]}
                    </p>
                    
                    <div className="flex gap-sm">
                      {percorso.passoCorrente > 0 && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => onStepBackward(percorso.id)}
                          style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                        >
                          ← Indietro
                        </button>
                      )}
                      
                      {percorso.passoCorrente < percorso.totalePassi - 1 ? (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => onStepForward(percorso.id)}
                          style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                        >
                          Segna come Completato e Procedi →
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => onStepForward(percorso.id)}
                          style={{ padding: "6px 12px", fontSize: "0.85rem", backgroundColor: "var(--color-success)" }}
                        >
                          Concludi il percorso di guida <CheckIcon />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
