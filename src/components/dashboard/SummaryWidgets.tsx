import React from "react";
import { FileTextIcon, ClockIcon, ArchiveIcon } from "@radix-ui/react-icons";

interface SummaryWidgetsProps {
  percorsiAttivi: number;
  scadenzePendenti: number;
  totalDocumenti: number;
  onNavigate: (page: string) => void;
}

/**
 * Componente che mostra i widget statistici riassuntivi dell'utente in Home.
 */
export const SummaryWidgets: React.FC<SummaryWidgetsProps> = ({
  percorsiAttivi,
  scadenzePendenti,
  totalDocumenti,
  onNavigate
}) => {
  return (
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
  );
};
