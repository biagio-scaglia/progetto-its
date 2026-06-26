import React, { useState, useEffect, useRef } from "react";
import { Percorso, Documento } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/ui/Button";
import { ExternalLinkIcon, DownloadIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { StepList } from "../components/guida/StepList";
import { DocumentChecklist } from "../components/guida/DocumentChecklist";

export interface PaginaGuidaProps {
  percorso: Percorso;
  documenti: Documento[];
  onBack: () => void;
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
  onStepForward,
  onStepBackward
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const prevStatoRef = useRef(percorso.stato);

  useEffect(() => {
    // Se lo stato passa a "completato" mentre l'utente è sulla pagina, mostra il modal di celebrazione
    if (percorso.stato === "completato" && prevStatoRef.current !== "completato") {
      setShowCelebration(true);
      setRating(null);
      setHoverRating(null);
      setFeedbackText("");
      setFeedbackSent(false);
    }
    prevStatoRef.current = percorso.stato;
  }, [percorso.stato]);

  return (
    <div className="guide-detail-page">
      {/* Modal di celebrazione interattivo per completamento guida */}
      {showCelebration && (
        <div 
          className="modal-overlay no-print"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 26, 77, 0.4)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setShowCelebration(false)}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1.5px solid var(--color-success-border)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: "90%",
              maxWidth: "520px",
              padding: "var(--space-md)",
              position: "relative",
              animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animazione stelline/coriandoli in CSS */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <div className="confetti-particle p1"></div>
              <div className="confetti-particle p2"></div>
              <div className="confetti-particle p3"></div>
              <div className="confetti-particle p4"></div>
              <div className="confetti-particle p5"></div>
              <div className="confetti-particle p6"></div>
            </div>

            {/* Icona di successo pulsante */}
            <div 
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "var(--color-success-bg)",
                border: "2px solid var(--color-success-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--space-sm)",
                boxShadow: "0 0 15px rgba(13, 110, 75, 0.2)",
                animation: "pulse 2s infinite"
              }}
            >
              <CheckCircledIcon style={{ width: "30px", height: "30px", color: "var(--color-success)" }} />
            </div>

            {/* Titolo e descrizione */}
            <h3 style={{ fontSize: "1.35rem", fontWeight: 600, color: "var(--color-success)", margin: "0 0 var(--space-xs) 0" }}>
              Complimenti! Guida Completata!
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 var(--space-sm) 0" }}>
              Hai completato tutti i passaggi procedurali e verificato i requisiti per la guida:<br/>
              <strong style={{ color: "var(--color-text-primary)", fontSize: "1rem" }}>{percorso.titolo}</strong>.
            </p>

            <div style={{ width: "100%", height: "1px", backgroundColor: "var(--color-border)", margin: "var(--space-sm) 0" }} />

            {/* Modulo di valutazione interattivo */}
            <div style={{ width: "100%", padding: "var(--space-xs) 0" }}>
              {!feedbackSent ? (
                <>
                  <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-dark-blue)", marginBottom: "var(--space-xs)" }}>
                    Quanto è stata utile questa guida per te?
                  </p>
                  
                  {/* Stelle interattive */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "var(--space-sm)" }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isHighlighted = (hoverRating !== null ? star <= hoverRating : rating !== null && star <= rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "2rem",
                            color: isHighlighted ? "#eab308" : "#cbd5e1",
                            transition: "transform 0.1s ease, color 0.1s ease",
                            transform: (hoverRating === star || rating === star) ? "scale(1.15)" : "scale(1)",
                            padding: "2px"
                          }}
                          aria-label={`Valuta ${star} stelle su 5`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>

                  {rating !== null && (
                    <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Lascia un commento o suggerimento facoltativo..."
                        style={{
                          width: "100%",
                          minHeight: "70px",
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          border: "1.5px solid var(--color-border)",
                          fontSize: "0.9rem",
                          resize: "vertical",
                          marginBottom: "var(--space-sm)",
                          outline: "none"
                        }}
                      />
                      <Button
                        variant="primary"
                        onClick={() => setFeedbackSent(true)}
                        style={{ width: "100%", minHeight: "38px", fontSize: "0.9rem" }}
                      >
                        Invia Valutazione
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: "var(--space-sm)", backgroundColor: "var(--color-success-bg)", borderRadius: "var(--radius-md)", animation: "fadeIn 0.3s ease-out" }}>
                  <p style={{ color: "var(--color-success)", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>
                    ✓ Grazie per il tuo feedback!
                  </p>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                    Le tue risposte ci aiutano a mantenere le guide semplici e accessibili.
                  </p>
                </div>
              )}
            </div>

            <div style={{ width: "100%", height: "1px", backgroundColor: "var(--color-border)", margin: "var(--space-sm) 0" }} />

            {/* Pulsanti di Azione */}
            <div style={{ display: "flex", width: "100%", gap: "var(--space-sm)", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "var(--space-sm)", width: "100%" }}>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setShowCelebration(false);
                    window.print();
                  }}
                  style={{ flex: 1, backgroundColor: "var(--color-success)", color: "#ffffff", minHeight: "44px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <DownloadIcon /> Esporta PDF
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShowCelebration(false);
                    onBack();
                  }}
                  style={{ flex: 1, minHeight: "44px" }}
                >
                  Torna all'Elenco
                </Button>
              </div>
              <button
                onClick={() => setShowCelebration(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-text-disabled)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: "4px 0"
                }}
              >
                Chiudi e resta sulla guida
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Torna ai percorsi & Esporta PDF */}
      <div className="mb-md flex items-center justify-between no-print" style={{ flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <Button variant="back" onClick={onBack}>
          Torna all'elenco dei percorsi
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => window.print()}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <DownloadIcon /> Esporta Guida in PDF
        </Button>
      </div>

      {/* Vista su Schermo */}
      <div className="screen-only no-print">
        {/* Intestazione Guida */}
        <div className="page-header" style={{ marginBottom: "var(--space-lg)" }}>
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-primary)" }}>
                {percorso.categoria}
              </span>
            </div>
            <h2 className="page-title">{percorso.titolo}</h2>
            <p className="page-subtitle">{percorso.descrizione}</p>
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
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>
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
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Apri {percorso.nomePortaleUfficiale} <ExternalLinkIcon />
            </a>
          </div>
        </div>

        {/* Success Alert Banner when completed */}
        {percorso.stato === "completato" && (
          <div 
            className="card"
            style={{
              padding: "var(--space-lg)",
              border: "2px solid var(--color-success)",
              backgroundColor: "var(--color-success-bg)",
              marginBottom: "var(--space-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
              animation: "slideDown 0.3s ease-out"
            }}
          >
            <h3 style={{ color: "var(--color-success)", fontSize: "1.3rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <CheckCircledIcon style={{ width: "24px", height: "24px" }} /> Congratulazioni! Guida completata con successo
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem", margin: 0 }}>
              Hai completato tutti i passaggi necessari per questo percorso. Ora puoi procedere con la richiesta ufficiale sul portale istituzionale dell'ente se non l'hai già fatto.
            </p>
            <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "4px" }}>
              <Button 
                variant="primary" 
                onClick={() => window.print()}
                style={{ backgroundColor: "var(--color-success)", fontSize: "0.9rem", padding: "8px 16px", minHeight: "36px" }}
              >
                Stampa / Salva PDF
              </Button>
              <Button 
                variant="secondary" 
                onClick={onBack}
                style={{ borderColor: "var(--color-success)", color: "var(--color-success)", fontSize: "0.9rem", padding: "8px 16px", minHeight: "36px" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(13, 110, 75, 0.05)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Torna ai miei percorsi
              </Button>
            </div>
          </div>
        )}

        {/* Stacked Layout Guida (Singola Colonna) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          
          {/* Checklist documenti */}
          <section aria-label="Documenti e requisiti necessari">
            <DocumentChecklist 
              percorso={percorso} 
              documenti={documenti} 
            />
          </section>

          {/* Passaggi della guida */}
          <section aria-label="Passaggi e procedura da seguire">
            <StepList 
              percorso={percorso} 
              onStepBackward={onStepBackward} 
              onStepForward={onStepForward} 
            />
          </section>

        </div>
      </div>

      {/* Blocco Stampa Dedicato (Visibile solo in Stampa/PDF) */}
      <div className="print-only">
        <div className="print-header">
          <div className="print-header-top">REPUBBLICA ITALIANA</div>
          <div className="print-header-subtitle">Dipartimento per la Trasformazione Digitale • Guida del Cittadino</div>
        </div>
        
        <h1 className="print-title">{percorso.titolo}</h1>
        <p className="print-subtitle">{percorso.descrizione}</p>
        
        <div className="print-meta-table">
          <div className="print-meta-row">
            <strong>Categoria:</strong> {percorso.categoria}
          </div>
          {percorso.dataUltimoAggiornamento && (
            <div className="print-meta-row">
              <strong>Aggiornato al:</strong> {percorso.dataUltimoAggiornamento}
            </div>
          )}
          <div className="print-meta-row">
            <strong>Stato:</strong> {percorso.stato === 'completato' ? 'Completato' : 'In Corso'}
          </div>
        </div>

        {percorso.documentiNecessari && percorso.documentiNecessari.length > 0 && (
          <div className="print-section">
            <h2>Documentazione e requisiti di base</h2>
            <ul className="print-list">
              {percorso.documentiNecessari.map((doc, idx) => (
                <li key={idx}>
                  [ {doc.completato ? "X" : " "} ] {doc.testo} {doc.obbligatorio ? "(Obbligatorio)" : "(Facoltativo)"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {percorso.passiNomi && percorso.passiNomi.length > 0 && (
          <div className="print-section page-break-before-avoid">
            <h2>Procedura e passaggi da seguire</h2>
            <ol className="print-steps">
              {percorso.passiNomi.map((passo, idx) => (
                <li key={idx} className="print-step-item">
                  <strong>{passo}</strong>
                  <p>{percorso.passiDettagli[idx] || "Nessun dettaglio aggiuntivo per questo passaggio."}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        <div className="print-footer">
          Documento generato dall'applicazione "Servizi Digitali" il {new Date().toLocaleDateString("it-IT")}. Le procedure ufficiali possono subire variazioni da parte degli enti competenti.
        </div>
      </div>
    </div>
  );
};
