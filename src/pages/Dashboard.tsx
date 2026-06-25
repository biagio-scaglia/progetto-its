import React from "react";
import { Percorso, Scadenza, Documento } from "../types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
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
  const percorsiAttivi = percorsi.filter(p => p.stato === "in_corso").length;
  const scadenzePendenti = scadenze.filter(s => !s.completata).length;
  const totalDocumenti = documenti.length;

  const activeGuides = percorsi.slice(0, 3);

  const formatMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("it-IT", { month: "short" }).replace(".", "");
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Intestazione Orientativa */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="page-title" style={{ fontSize: "2rem" }}>Benvenuto nella tua Area Personale</h2>
          <p className="page-subtitle" style={{ fontSize: "1.1rem", marginTop: "6px" }}>
            Questa applicazione ti aiuta a preparare i documenti e a completare in autonomia i percorsi per i servizi pubblici.
          </p>
        </div>
      </div>



      {/* Pulsante grande per trovare nuove guide */}
      <div 
        className="card clickable" 
        onClick={() => onNavigate("servizi")}
        style={{ 
          padding: "var(--space-lg)", 
          border: "2px solid var(--color-primary)", 
          backgroundColor: "var(--color-primary-light)",
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--color-primary)" }}>
            Hai bisogno di iniziare una nuova pratica?
          </h3>
          <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary)" }}>
            Clicca qui per visualizzare l'elenco delle guide disponibili per la Carta d'Identità, il Cambio di Residenza e molto altro.
          </p>
        </div>
      </div>

      {/* Widget statistici / Link di Navigazione */}
      <SummaryWidgets 
        percorsiAttivi={percorsiAttivi} 
        scadenzePendenti={scadenzePendenti} 
        totalDocumenti={totalDocumenti} 
        onNavigate={onNavigate} 
      />

      {/* Lista guide attive */}
      <ActiveGuidesList 
        activeGuides={activeGuides} 
        onNavigate={onNavigate} 
        onSelectPercorso={onSelectPercorso} 
      />

      {/* Prossimi Passi consigliati */}
      <RecommendedSteps 
        scadenze={scadenze} 
        formatMonth={formatMonth} 
        formatDay={formatDay} 
      />

      {/* Box Spiegazione Filosofia Software */}
      <div className="card w-full" style={{ borderLeft: "6px solid var(--color-primary)", backgroundColor: "var(--color-surface)" }}>
        <div className="card-body" style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", padding: "var(--space-lg)" }}>
          <InfoCircledIcon style={{ width: "32px", height: "32px", color: "var(--color-primary)", flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "8px" }}>
              Informazioni utili sull'applicazione
            </h4>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem", lineHeight: "1.5" }}>
              Questo programma è uno strumento privato che risiede interamente sul tuo dispositivo. 
              Ti serve per raccogliere i documenti necessari e studiare i passaggi prima di fare la domanda. 
              Ricorda che per inoltrare la domanda ufficiale dovrai sempre collegarti ai portali governativi esterni indicati nelle guide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
