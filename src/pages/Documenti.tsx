import React, { useState, useEffect, useRef } from "react";
import { Documento, StatoDocumento } from "../types";
import { 
  MagnifyingGlassIcon, 
  UploadIcon, 
  DownloadIcon, 
  TrashIcon, 
  FileTextIcon, 
  ArrowRightIcon,
  Cross2Icon
} from "@radix-ui/react-icons";
import { Alert } from "../components/ui/Alert";

export interface DocumentiProps {
  documenti: Documento[];
  onUploadNewDoc: (nome: string, tipo: string, dimensione: string) => void;
  onDeleteDoc: (id: string) => void;
  onNavigateToPercorso: (percorsoId: string) => void;
}

export const Documenti: React.FC<DocumentiProps> = ({
  documenti,
  onUploadNewDoc,
  onDeleteDoc,
  onNavigateToPercorso
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatoDocumento | "tutti">("tutti");
  const [dragOver, setDragOver] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Documento | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (docToDelete) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const focusCancel = () => {
        cancelBtnRef.current?.focus();
      };
      const timer = setTimeout(focusCancel, 50);
      return () => clearTimeout(timer);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [docToDelete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && docToDelete) {
        setDocToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [docToDelete]);

  const handleConfirmDelete = () => {
    if (docToDelete) {
      onDeleteDoc(docToDelete.id);
      const deletedName = docToDelete.nome;
      setDocToDelete(null);
      setToastMessage(`Documento "${deletedName}" eliminato con successo dall'archivio.`);
    }
  };

  // Filter documents
  const filteredDocumenti = documenti.filter((doc) => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tutti" || doc.stato === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (stato: StatoDocumento) => {
    switch (stato) {
      case "valido":
        return { bg: "var(--color-success-bg)", color: "var(--color-success)", border: "var(--color-success-border)", label: "Valido" };
      case "da_verificare":
        return { bg: "var(--color-warning-bg)", color: "var(--color-warning)", border: "var(--color-warning-border)", label: "In verifica" };
      case "scaduto":
      default:
        return { bg: "var(--color-danger-bg)", color: "var(--color-danger)", border: "var(--color-danger-border)", label: "Scaduto" };
    }
  };

  const simulateNewUpload = () => {
    const defaultFiles = [
      { nome: "Ricevuta_Tassa_TARI_2026.pdf", tipo: "PDF", dim: "310 KB" },
      { nome: "CUD_Redditi_Lavoro_2025.pdf", tipo: "PDF", dim: "1.4 MB" },
      { nome: "Certificato_Stato_Famiglia_ANPR.pdf", tipo: "PDF", dim: "215 KB" },
      { nome: "Copia_Patente_Guida_Fronte.png", tipo: "PNG", dim: "520 KB" }
    ];
    
    const randomFile = defaultFiles[Math.floor(Math.random() * defaultFiles.length)];
    onUploadNewDoc(randomFile.nome, randomFile.tipo, randomFile.dim);
    setToastMessage(`Documento "${randomFile.nome}" aggiunto con successo.`);
  };

  return (
    <div>
      {/* Intestazione */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Il mio Archivio Documenti</h2>
          <p className="page-subtitle">Raccogli e tieni pronti i tuoi certificati, moduli e ricevute per allegarli facilmente sui portali della PA.</p>
        </div>
      </div>

      {/* Alert di feedback locale in cima */}
      {toastMessage && (
        <Alert 
          variant="success" 
          title="Operazione completata" 
          className="mb-md"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: "4px",
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center"
              }}
              aria-label="Chiudi avviso"
            >
              <Cross2Icon />
            </button>
          </div>
        </Alert>
      )}

      {/* Caricamento d'esempio */}
      <div 
        className="card w-full mb-lg"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const f = e.dataTransfer.files[0];
            const ext = f.name.split(".").pop()?.toUpperCase() || "PDF";
            const sizeStr = f.size > 1024 * 1024 
              ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` 
              : `${Math.round(f.size / 1024)} KB`;
            onUploadNewDoc(f.name, ext, sizeStr);
            setToastMessage(`Documento "${f.name}" aggiunto con successo.`);
          }
        }}
        onClick={simulateNewUpload}
        style={{
          border: dragOver ? "2px dashed var(--color-primary)" : "2px dashed var(--color-border)",
          backgroundColor: dragOver ? "var(--color-primary-light)" : "var(--color-surface)",
          textAlign: "center",
          padding: "var(--space-xl)",
          cursor: "pointer",
          transition: "all var(--transition-fast)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-xs)" }}>
          <UploadIcon style={{ width: "32px", height: "32px", color: "var(--color-primary)", marginBottom: "4px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
            Trascina qui un file per prepararlo in archivio
          </h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            Oppure <strong>fai clic qui</strong> per simulare il caricamento di un documento di prova (es. Stato di Famiglia).
          </p>
          <p style={{ color: "var(--color-text-disabled)", fontSize: "0.75rem" }}>
            Formati accettati: PDF, JPEG, PNG (Max 10MB per file)
          </p>
        </div>
      </div>

      {/* Ricerca e Filtri */}
      <div className="card w-full mb-lg" style={{ padding: "var(--space-md)", gap: "var(--space-md)" }}>
        <div className="flex justify-between items-center" style={{ gap: "var(--space-md)", flexWrap: "wrap" }}>
          
          <div className="search-wrapper">
            <label htmlFor="search-docs" className="sr-only">Cerca documento</label>
            <MagnifyingGlassIcon className="search-icon-inside" aria-hidden="true" />
            <input
              id="search-docs"
              type="text"
              className="search-input"
              placeholder="Cerca per nome file o formato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)"
                }}
                aria-label="Cancella ricerca"
              >
                <Cross2Icon />
              </button>
            )}
          </div>
        </div>

        {/* Tab di filtro per stato */}
        <div 
          className="flex" 
          style={{ 
            marginTop: "var(--space-md)", 
            borderBottom: "1px solid var(--color-border)",
            gap: "var(--space-xs)",
            overflowX: "auto",
            paddingBottom: "1px"
          }}
          role="tablist"
          aria-label="Filtra documenti per validità"
        >
          {([
            { id: "tutti", label: "Tutti i file" },
            { id: "valido", label: "Validi" },
            { id: "da_verificare", label: "In verifica" },
            { id: "scaduto", label: "Scaduti" }
          ] as { id: StatoDocumento | "tutti"; label: string }[]).map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                  color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontWeight: isSelected ? "700" : "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  outlineOffset: "-3px"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista Documenti */}
      {filteredDocumenti.length === 0 ? (
        <div className="card w-full" style={{ padding: "var(--space-xxl)", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
            Nessun documento trovato
          </h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
            Nessun file presente per questa categoria o termine cercato.
          </p>
        </div>
      ) : (
        <div className="list-group">
          {filteredDocumenti.map((doc) => {
            const badgeStyle = getStatusBadgeStyle(doc.stato);
            return (
              <div key={doc.id} className="list-item" style={{ padding: "var(--space-md) var(--space-lg)" }}>
                <div className="list-item-left" style={{ flex: 1 }}>
                  <div className="list-item-icon" style={{ color: "var(--color-primary)" }}>
                    <FileTextIcon style={{ width: "22px", height: "22px" }} />
                  </div>
                  
                  <div className="list-item-content" style={{ flex: 1, marginRight: "var(--space-md)" }}>
                    <div className="flex items-center gap-sm" style={{ flexWrap: "wrap" }}>
                      <span className="list-item-title" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                        {doc.nome}
                      </span>
                      <span 
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          textTransform: "uppercase"
                        }}
                      >
                        {badgeStyle.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-sm mt-xs" style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
                      <span>Formato: <strong>{doc.tipo}</strong></span>
                      <span>•</span>
                      <span>Dimensione: <strong>{doc.dimensione}</strong></span>
                      <span>•</span>
                      <span>Preparato il: <strong>{doc.dataCaricamento}</strong></span>
                      
                      {doc.collegatoAPercorsoId && doc.percorsoTitolo && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => onNavigateToPercorso(doc.collegatoAPercorsoId!)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-primary)",
                              fontWeight: 700,
                              cursor: "pointer",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "2px",
                              textDecoration: "underline"
                            }}
                          >
                            Destinato a: {doc.percorsoTitolo} <ArrowRightIcon style={{ width: "12px" }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="list-item-right" style={{ flexShrink: 0 }}>
                  <button 
                    className="btn-icon" 
                    title="Scarica documento"
                    onClick={() => alert(`Download in corso del file locale: ${doc.nome}`)}
                    aria-label={`Scarica ${doc.nome}`}
                  >
                    <DownloadIcon />
                  </button>
                  <button 
                    className="btn-icon" 
                    title="Elimina documento"
                    onClick={() => setDocToDelete(doc)}
                    style={{ color: "var(--color-danger)" }}
                    aria-label={`Elimina ${doc.nome}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal di conferma eliminazione */}
      {docToDelete && (
        <div 
          className="modal-overlay no-print"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 26, 77, 0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out"
          }}
          onClick={() => setDocToDelete(null)}
        >
          <div 
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-desc"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
              width: "90%",
              maxWidth: "480px",
              padding: "var(--space-lg)",
              animation: "slideUp 0.2s ease-out",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 
              id="delete-dialog-title" 
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-dark-blue)", margin: "0 0 var(--space-sm) 0" }}
            >
              Conferma eliminazione documento
            </h3>
            
            <p 
              id="delete-dialog-desc" 
              style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 var(--space-lg) 0" }}
            >
              Sei sicuro di voler eliminare definitivamente il documento <strong style={{ color: "var(--color-text-primary)" }}>{docToDelete.nome}</strong> dall'archivio locale? Questa azione non può essere annullata.
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button 
                ref={cancelBtnRef}
                className="btn btn-secondary" 
                onClick={() => setDocToDelete(null)}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem" }}
              >
                Annulla
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleConfirmDelete}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem", backgroundColor: "var(--color-danger)" }}
              >
                Elimina documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
