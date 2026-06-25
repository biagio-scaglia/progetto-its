import React from "react";
import { Percorso, Documento } from "../../types";

interface DocumentChecklistProps {
  percorso: Percorso;
  documenti: Documento[];
}

/**
 * Componente informativo statico che mostra i requisiti documentali per una guida,
 * senza consentire l'inserimento o caricamento di dati da parte dell'utente.
 */
export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  percorso
}) => {
  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--color-dark-blue)" }}>
          Documenti e requisiti necessari
        </h3>
      </div>
      
      <div className="card-body" style={{ padding: "var(--space-lg)" }}>
        <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
          Assicurati di possedere questi requisiti e documenti prima di procedere con la compilazione sul portale ufficiale dell'ente.
        </p>
        
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "var(--space-sm)", margin: 0 }}>
          {percorso.documentiNecessari.map((item) => (
            <li 
              key={item.id} 
              style={{ fontSize: "1rem", color: "var(--color-text-primary)", lineHeight: "1.4" }}
            >
              <span style={{ fontWeight: 500 }}>{item.testo}</span>{" "}
              {item.obbligatorio ? (
                <span style={{ color: "var(--color-danger)", fontSize: "0.85rem", fontWeight: 600, backgroundColor: "var(--color-danger-bg)", padding: "2px 6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-danger-border)", marginLeft: "6px" }}>
                  Obbligatorio
                </span>
              ) : (
                <span style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", fontWeight: 600, backgroundColor: "var(--color-gray-badge-bg)", padding: "2px 6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", marginLeft: "6px" }}>
                  Facoltativo
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
