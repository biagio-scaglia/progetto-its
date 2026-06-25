import React from "react";
import { Percorso } from "../../types";

interface EnteInfoProps {
  percorso: Percorso;
}

/**
 * Componente informativo sull'ente pubblico erogatore e le competenze territoriali di riferimento.
 */
export const EnteInfo: React.FC<EnteInfoProps> = ({ percorso }) => {
  return (
    <div className="card w-full mb-lg">
      <div className="card-header">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
          Ufficio ed Ente Gestore
        </h3>
      </div>
      
      <div className="card-body" style={{ padding: "var(--space-md)", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <div>
            <strong style={{ display: "block" }}>Ente Nazionale / Comunale:</strong>
            <span style={{ color: "var(--color-text-secondary)" }}>{percorso.nomePortaleUfficiale}</span>
          </div>
          
          <div>
            <strong style={{ display: "block" }}>Competenza territoriale:</strong>
            <span style={{ color: "var(--color-text-secondary)" }}>Anagrafe Comunale di residenza o portale previdenziale INPS.</span>
          </div>

          <div>
            <strong style={{ display: "block" }}>Assistenza telefonica:</strong>
            <span style={{ color: "var(--color-text-secondary)" }}>Consulta il sito ufficiale per i contatti telefonici specifici o per i numeri verdi istituzionali.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
