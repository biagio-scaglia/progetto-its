import React, { useState } from "react";
import { Percorso, Documento } from "../../types";
import { CheckIcon, UploadIcon, FileTextIcon, TrashIcon } from "@radix-ui/react-icons";

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
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});

  const handleDrag = (e: React.DragEvent, id: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: active }));
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUploadDocument(percorso.id, id, file.name);
    }
  };

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
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
          Documenti Necessari (Checklist di controllo)
        </h3>
      </div>
      
      <div className="card-body">
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
          Verifica di possedere tutti i documenti utili prima di accedere al portale istituzionale. Puoi caricare i file localmente per spuntare la checklist.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {percorso.documentiNecessari.map((item) => {
            const uploadedDoc = getDocumentInfo(item.documentoId);
            
            return (
              <div 
                key={item.id} 
                style={{ 
                  border: "1px solid var(--color-border)", 
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-md)",
                  backgroundColor: item.completato ? "rgba(0, 135, 90, 0.01)" : "transparent"
                }}
              >
                <div className="flex justify-between items-start" style={{ gap: "var(--space-md)", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
                  <div>
                    <div className="flex items-center gap-xs">
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{item.testo}</h4>
                      {item.obbligatorio ? (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-danger)", fontWeight: 700, backgroundColor: "var(--color-danger-bg)", padding: "2px 6px", borderRadius: "3px" }}>
                          Obbligatorio
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: 600, backgroundColor: "var(--color-background)", padding: "2px 6px", borderRadius: "3px" }}>
                          Consigliato
                        </span>
                      )}
                    </div>
                  </div>

                  {item.completato ? (
                    <span style={{ color: "var(--color-success)", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckIcon /> Pronto
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-warning)", fontWeight: 700, fontSize: "0.85rem" }}>
                      Da raccogliere
                    </span>
                  )}
                </div>

                {item.completato && uploadedDoc ? (
                  <div 
                    className="flex justify-between items-center"
                    style={{ 
                      backgroundColor: "var(--color-background)", 
                      padding: "var(--space-sm) var(--space-md)", 
                      borderRadius: "var(--radius-sm)",
                      border: "1px dashed var(--color-border)"
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <FileTextIcon style={{ color: "var(--color-primary)" }} />
                      <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{uploadedDoc.nome}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginLeft: "8px" }}>
                          ({uploadedDoc.dimensione})
                        </span>
                      </div>
                    </div>
                    
                    {percorso.stato !== "completato" && percorso.stato !== "scaduto" && (
                      <button
                        onClick={() => onRemoveDocument(percorso.id, item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-danger)",
                          cursor: "pointer",
                          padding: "4px",
                          display: "inline-flex"
                        }}
                        title="Rimuovi"
                        aria-label={`Rimuovi ${uploadedDoc.nome}`}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                ) : (
                  percorso.stato !== "completato" && percorso.stato !== "scaduto" ? (
                    <div 
                      onDragEnter={(e) => handleDrag(e, item.id, true)}
                      onDragOver={(e) => handleDrag(e, item.id, true)}
                      onDragLeave={(e) => handleDrag(e, item.id, false)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      style={{ 
                        border: dragActive[item.id] ? "2px dashed var(--color-primary)" : "2px dashed var(--color-border)", 
                        borderRadius: "var(--radius-sm)",
                        padding: "var(--space-sm) var(--space-md)",
                        textAlign: "center",
                        backgroundColor: dragActive[item.id] ? "var(--color-primary-light)" : "var(--color-background)",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)"
                      }}
                      onClick={() => simulateUpload(item.id)}
                    >
                      <UploadIcon style={{ color: "var(--color-text-secondary)", marginBottom: "2px" }} />
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                        Trascina qui il file o <strong>clicca per spuntarlo</strong>
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-disabled)", fontStyle: "italic" }}>
                      Percorso di guida concluso.
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
