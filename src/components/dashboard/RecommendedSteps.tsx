import React from "react";
import { Scadenza } from "../../types";

interface RecommendedStepsProps {
  scadenze: Scadenza[];
  formatMonth: (dateStr: string) => string;
  formatDay: (dateStr: string) => number;
}

/**
 * Componente che mostra le scadenze e gli adempimenti a breve termine.
 */
export const RecommendedSteps: React.FC<RecommendedStepsProps> = ({
  scadenze,
  formatMonth,
  formatDay
}) => {
  const pendingScadenze = scadenze.filter(s => !s.completata);

  if (pendingScadenze.length === 0) {
    return null;
  }

  return (
    <div className="card w-full mb-lg">
      <div className="card-header">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-dark-blue)" }}>Prossimi passi consigliati</h3>
      </div>
      
      <div className="card-body" style={{ padding: "var(--space-md)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            {pendingScadenze.slice(0, 3).map((scad) => {
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
      </div>
    </div>
  );
};
