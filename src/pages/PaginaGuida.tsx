import React, { useState } from "react";
import { Percorso, Documento } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { 
  CheckIcon, 
  UploadIcon, 
  TrashIcon, 
  FileTextIcon, 
  InfoCircledIcon,
  ExternalLinkIcon
} from "@radix-ui/react-icons";

export interface PaginaGuidaProps {
  percorso: Percorso;
  documenti: Documento[];
  onBack: () => void;
  onUploadDocument: (percorsoId: string, checklistItemId: string, fileNome: string) => void;
  onRemoveDocument: (percorsoId: string, checklistItemId: string) => void;
  onStepForward: (percorsoId: string) => void;
  onStepBackward: (percorsoId: string) => void;
}

export const PaginaGuida: React.FC<PaginaGuidaProps> = ({
  percorso,
  documenti,
  onBack,
  onUploadDocument,
  onRemoveDocument,
  onStepForward,
  onStepBackward
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
      "chk-3-1": "Visura_Catastale_Pertinenza_Torino.pdf",
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

      {/* Grid Layout Guida */}
      <div className="grid-dashboard">
        
        {/* Colonna Sinistra (Passaggi da seguire) */}
        <section className="col-8" aria-label="Passaggi della guida e documenti necessari">
          
          {/* I passaggi guidati */}
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

          {/* Documenti necessari */}
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
        </section>

        {/* Colonna Destra */}
        <section className="col-4" aria-label="Note di sicurezza e ufficio competente">
          
          {/* Note della Guida */}
          {percorso.note && (
            <div className="card w-full mb-lg" style={{ backgroundColor: "var(--color-warning-bg)", border: "1px solid var(--color-warning-border)" }}>
              <div className="card-body" style={{ padding: "var(--space-md)" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-warning)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-xs)" }}>
                  <InfoCircledIcon /> Suggerimenti Utili
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  {percorso.note}
                </p>
              </div>
            </div>
          )}

          {/* Ente Competente */}
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

          {/* Azioni di Guida */}
          <div className="card w-full">
            <div className="card-header">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
                Opzioni Guida
              </h3>
            </div>
            <div className="card-body" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => alert("Per completare l'istanza devi accedere al portale esterno. Questa guida raccoglie solo le informazioni utili.")}
              >
                Esporta checklist in PDF
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
