import React from "react";
import { Percorso, Scadenza, Documento } from "../types";
import { 
  InfoCircledIcon, 
  GridIcon, 
  ArchiveIcon, 
  ClockIcon 
} from "@radix-ui/react-icons";
import { SummaryWidgets } from "../components/dashboard/SummaryWidgets";
import { ActiveGuidesList } from "../components/dashboard/ActiveGuidesList";
import { RecommendedSteps } from "../components/dashboard/RecommendedSteps";
import { TTSButton } from "../components/ui/TTSButton";
import { BRAND } from "../config/branding";
import { AssistantMascot } from "../components/ui/AssistantMascot";

export interface DashboardProps {
  percorsi: Percorso[];
  scadenze: Scadenza[];
  documenti: Documento[];
  onNavigate: (page: string) => void;
  onSelectPercorso: (percorsoId: string) => void;
}

/**
 * Pagina di Dashboard iniziale (Home) dell'applicazione.
 * Offre spiegazioni sull'app, griglia di navigazione rapida e widget statistici.
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

  // Costruisce la sintesi vocale per l'introduzione
  const speechText = `Benvenuto su ${BRAND.name}, ${BRAND.fullName}. Questo sistema di orientamento locale e offline ti aiuta a preparare i documenti e studiare i passaggi necessari per completare le pratiche dei servizi pubblici in modo semplice, autonomo e sicuro.`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      {/* Intestazione Orientativa */}
      <div className="page-header" style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h2 className="page-title" style={{ fontSize: "2rem" }}>Benvenuto su {BRAND.name}</h2>
          <p className="page-subtitle" style={{ fontSize: "1.1rem", marginTop: "6px" }}>
            {BRAND.tagline}
          </p>
        </div>
        <div style={{ alignSelf: "center" }}>
          <TTSButton 
            text={speechText}
            ariaLabel="Ascolta introduzione di SDIT"
          />
        </div>
      </div>

      {/* Introduzione all'app ed educazione civica digitale */}
      <div 
        className="card w-full" 
        style={{ 
          padding: "var(--space-lg)", 
          backgroundColor: "var(--color-primary-light)",
          borderLeft: "4px solid var(--color-primary)"
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
          <InfoCircledIcon style={{ width: "24px", height: "24px", color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "6px" }}>
              Cos'è questa applicazione e come ti aiuta
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
              Questo programma è uno strumento protetto che risiede interamente offline sul tuo computer per garantirti la massima privacy. 
              Ti consente di studiare i passaggi ufficiali prima di effettuare le domande, raccogliere in anticipo i certificati richiesti nel tuo archivio locale e verificare le scadenze importanti. 
              Ricorda che per inoltrare ufficialmente qualsiasi pratica dovrai cliccare sui link ministeriali esterni indicati nelle singole guide.
            </p>
          </div>
        </div>
      </div>

      {/* Sezione Azioni Rapide */}
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "var(--space-sm)" }}>
          Scorciatoie di navigazione rapida
        </h3>
        
        <div className="summary-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div 
            className="card clickable card-interactive" 
            onClick={() => onNavigate("servizi")}
            style={{ padding: "var(--space-md)", cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-md)", display: "flex" }}>
                <GridIcon style={{ width: "20px", height: "20px", color: "var(--color-primary)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Guide ai Servizi
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  Esplora l'elenco delle guide (es. SPID, Residenza, Passaporto) e avvia nuovi percorsi guidati.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card clickable card-interactive" 
            onClick={() => onNavigate("documenti")}
            style={{ padding: "var(--space-md)", cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-md)", display: "flex" }}>
                <ArchiveIcon style={{ width: "20px", height: "20px", color: "var(--color-primary)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Archivio Documenti
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  Carica e tieni pronti i tuoi documenti d'identità, moduli e ricevute TARI/IMU sul tuo dispositivo.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card clickable card-interactive" 
            onClick={() => onNavigate("assistente")}
            style={{ padding: "var(--space-md)", cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-md)", width: "40px", height: "40px" }}>
                <AssistantMascot size="sm" />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  {BRAND.assistantName}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  Scrivi in linguaggio naturale per capire quale pratica ti serve o quali requisiti devi soddisfare.
                </p>
              </div>
            </div>
          </div>

          <div 
            className="card clickable card-interactive" 
            onClick={() => onNavigate("scadenze")}
            style={{ padding: "var(--space-md)", cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-md)", display: "flex" }}>
                <ClockIcon style={{ width: "20px", height: "20px", color: "var(--color-primary)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Scadenze e Date
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  Controlla i promemoria impostati per ricordarti i passaggi amministrativi e i pagamenti.
                </p>
              </div>
            </div>
          </div>
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
    </div>
  );
};
