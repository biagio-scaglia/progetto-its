import React from "react";
import { Percorso, Documento } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { InfoCircledIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { StepList } from "../components/guida/StepList";
import { DocumentChecklist } from "../components/guida/DocumentChecklist";
import { EnteInfo } from "../components/guida/EnteInfo";

export interface PaginaGuidaProps {
  percorso: Percorso;
  documenti: Documento[];
  onBack: () => void;
  onUploadDocument: (percorsoId: string, checklistItemId: string, fileNome: string) => void;
  onRemoveDocument: (percorsoId: string, checklistItemId: string) => void;
  onStepForward: (percorsoId: string) => void;
  onStepBackward: (percorsoId: string) => void;
}

/**
 * Pagina di Dettaglio di un Percorso di Guida.
 * Mostra le istruzioni procedurali e l'avanzamento dei requisiti e dei documenti.
 */
export const PaginaGuida: React.FC<PaginaGuidaProps> = ({
  percorso,
  documenti,
  onBack,
  onUploadDocument,
  onRemoveDocument,
  onStepForward,
  onStepBackward
}) => {
  return (
    <div>
      {/* Torna ai percorsi */}
      <div className="mb-md">
        <Button variant="back" onClick={onBack}>
          Torna all'elenco dei percorsi
        </Button>
      </div>

      {/* Intestazione Guida */}
      <div className="page-header" style={{ marginBottom: "var(--space-lg)" }}>
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-secondary)" }}>
              Codice Guida: {percorso.codice}
            </span>
            <span style={{ color: "var(--color-border)" }}>•</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-primary)" }}>
              {percorso.categoria}
            </span>
          </div>
          <h2 className="page-title">{percorso.titolo}</h2>
          <p className="page-subtitle">Guida aggiornata in tempo reale per orientare il cittadino.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <StatusBadge stato={percorso.stato} />
        </div>
      </div>

      {/* Box Principale di Collegamento Istituzionale */}
      <div 
        className="card w-full mb-lg" 
        style={{ 
          padding: "var(--space-lg)", 
          borderLeft: "5px solid var(--color-primary)",
          backgroundColor: "var(--color-primary-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-md)"
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "4px" }}>
            Accedi al servizio sul portale della Pubblica Amministrazione
          </h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            Questa procedura deve essere compilata ufficialmente sul sito <strong>{percorso.nomePortaleUfficiale}</strong>. 
            Il link seguente apre in sicurezza la finestra ufficiale per effettuare la domanda.
          </p>
        </div>
        <div>
          <a 
            href={percorso.linkPortaleUfficiale} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
            style={{ textDecoration: "none", gap: "6px" }}
          >
            Apri {percorso.nomePortaleUfficiale} <ExternalLinkIcon />
          </a>
        </div>
      </div>

      {/* Avvisi Contestuali */}
      {percorso.stato === "da_verificare" && (
        <Alert variant="warning" title="Integrazione Richiesta">
          L'ente pubblico ha segnalato dei dati mancanti. Leggi le istruzioni nella scheda documenti e procedi a correggere la domanda sul portale.
        </Alert>
      )}

      {/* Stacked Layout Guida (Singola Colonna) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        
        {/* Note / Suggerimenti della Guida */}
        {percorso.note && (
          <div className="card w-full" style={{ backgroundColor: "var(--color-warning-bg)", borderLeft: "6px solid var(--color-warning)" }}>
            <div className="card-body" style={{ padding: "var(--space-lg)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-warning)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <InfoCircledIcon style={{ width: "24px", height: "24px" }} /> Suggerimenti importanti per questo servizio
              </h3>
              <p style={{ fontSize: "1.05rem", color: "var(--color-text-primary)", lineHeight: "1.5" }}>
                {percorso.note}
              </p>
            </div>
          </div>
        )}

        {/* Passaggi della guida */}
        <section aria-label="Passaggi da seguire">
          <StepList 
            percorso={percorso} 
            onStepBackward={onStepBackward} 
            onStepForward={onStepForward} 
          />
        </section>

        {/* Checklist documenti */}
        <section aria-label="Documenti necessari">
          <DocumentChecklist 
            percorso={percorso} 
            documenti={documenti} 
            onUploadDocument={onUploadDocument} 
            onRemoveDocument={onRemoveDocument} 
          />
        </section>

        {/* Informazioni Ufficio Competente */}
        <section aria-label="Ufficio ed Ente Competente">
          <EnteInfo percorso={percorso} />
        </section>

      </div>
    </div>
  );
};
