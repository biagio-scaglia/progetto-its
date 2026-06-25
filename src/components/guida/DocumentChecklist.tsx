import React from "react";
import { Percorso, Documento } from "../../types";
import { FileTextIcon } from "@radix-ui/react-icons";

interface DocumentChecklistProps {
  percorso: Percorso;
  documenti: Documento[];
  onUploadDocument: (percorsoId: string, checklistItemId: string, fileNome: string) => void;
  onRemoveDocument: (percorsoId: string, checklistItemId: string) => void;
}

/**
 * Componente per spuntare i requisiti documentali del cittadino legati a un percorso guida.
 */
export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  percorso,
  documenti,
  onUploadDocument,
  onRemoveDocument
}) => {

  const simulateUpload = (itemId: string) => {
    const mockFileNames = {
      "chk-1-3": "Vecchio_Documento_Scaduto_Scaglia.pdf",
      "chk-2-3": "Modulo_Firma_Responsabilita_Genitore.pdf",
      "chk-3-1": "Visura_Catastale_Pertinenza.pdf",
      "chk-3-2": "Copia_Carta_Identita_Moglie.pdf"
    };
    
    const fileName = mockFileNames[itemId as keyof typeof mockFileNames] || "Documento_Preparato_Cittadino.pdf";
    onUploadDocument(percorso.id, itemId, fileName);
  };

  const getDocumentInfo = (docId?: string) => {
    if (!docId) return null;
    return documenti.find(d => d.id === docId);
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-dark-blue)" }}>
          Documenti da preparare
        </h3>
      </div>
      
      <div className="card-body" style={{ padding: "var(--space-lg)" }}>
        <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
          Controlla di avere questi documenti prima di procedere con la domanda ufficiale sul sito dell'ente.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {percorso.documentiNecessari.map((item) => {
            const uploadedDoc = getDocumentInfo(item.documentoId);
            
            return (
              <div 
                key={item.id} 
                style={{ 
                  border: "2px solid var(--color-border)", 
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-md)",
                  backgroundColor: item.completato ? "var(--color-success-bg)" : "var(--color-surface)"
                }}
              >
                <div className="flex justify-between items-center" style={{ gap: "var(--space-md)", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
                  <div>
                    <div className="flex items-center gap-sm">
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{item.testo}</h4>
                      {item.obbligatorio ? (
                        <span style={{ fontSize: "0.85rem", color: "var(--color-danger)", fontWeight: 700, backgroundColor: "var(--color-danger-bg)", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-danger-border)" }}>
                          Obbligatorio
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", fontWeight: 700, backgroundColor: "var(--color-gray-badge-bg)", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                          Facoltativo
                        </span>
                      )}
                    </div>
                  </div>

                  {item.completato ? (
                    <span style={{ color: "var(--color-success)", fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                      Documento Pronto
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-warning)", fontWeight: 800, fontSize: "1rem" }}>
                      Da aggiungere
                    </span>
                  )}
                </div>

                {item.completato && uploadedDoc ? (
                  <div 
                    className="flex justify-between items-center"
                    style={{ 
                      backgroundColor: "var(--color-surface)", 
                      padding: "var(--space-md)", 
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      marginTop: "var(--space-sm)",
                      flexWrap: "wrap",
                      gap: "var(--space-md)"
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <FileTextIcon style={{ color: "var(--color-primary)", width: "24px", height: "24px" }} />
                      <div>
                        <span style={{ fontSize: "1rem", fontWeight: 700 }}>{uploadedDoc.nome}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginLeft: "8px" }}>
                          ({uploadedDoc.dimensione})
                        </span>
                      </div>
                    </div>
                    
                    {percorso.stato !== "completato" && percorso.stato !== "scaduto" && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => onRemoveDocument(percorso.id, item.id)}
                        style={{
                          color: "var(--color-danger)",
                          borderColor: "var(--color-danger)",
                          fontSize: "0.95rem",
                          padding: "8px 16px",
                          minHeight: "36px"
                        }}
                        aria-label={`Rimuovi ${uploadedDoc.nome}`}
                      >
                        Rimuovi file
                      </button>
                    )}
                  </div>
                ) : (
                  percorso.stato !== "completato" && percorso.stato !== "scaduto" ? (
                    <div style={{ marginTop: "var(--space-sm)" }}>
                      <button 
                        className="btn btn-secondary w-full"
                        style={{ display: "flex", justifyContent: "center" }}
                        onClick={() => simulateUpload(item.id)}
                      >
                        Seleziona e aggiungi questo documento
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.95rem", color: "var(--color-text-disabled)", fontStyle: "italic", marginTop: "var(--space-sm)" }}>
                      Questa guida è stata completata.
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
