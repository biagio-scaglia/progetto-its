import React, { useState, useEffect, useRef } from "react";
import { ProfiloUtente as ProfiloUtenteType } from "../types";
import { GeolocationData } from "../repositories/geolocationRepository";
import { 
  CheckCircledIcon, 
  TrashIcon,
  LoopIcon,
  InfoCircledIcon
} from "@radix-ui/react-icons";

interface ProfiloUtenteProps {
  profilo: ProfiloUtenteType;
  onReset: () => void;
  onNavigate: (page: string) => void;
  geodata: GeolocationData;
  loadingGeoloc: boolean;
  geolocError: string | null;
  onRichiediGeolocalizzazione: () => void;
  onRevocaGeolocalizzazione: () => void;
}

/**
 * Schermata del Profilo Utente Locale.
 * Consente la visualizzazione dell'anagrafica locale, il controllo della geolocalizzazione GPS
 * e la rimozione totale dei dati dal computer dell'utente.
 */
export const ProfiloUtente: React.FC<ProfiloUtenteProps> = ({
  profilo,
  onReset,
  onNavigate,
  geodata,
  loadingGeoloc,
  geolocError,
  onRichiediGeolocalizzazione,
  onRevocaGeolocalizzazione
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Anti-spam guardrail temporale locale
  const [lastActionTime, setLastActionTime] = useState(0);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const cancelResetBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (showConfirmReset) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const focusCancel = () => {
        cancelResetBtnRef.current?.focus();
      };
      const timer = setTimeout(focusCancel, 50);
      return () => clearTimeout(timer);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [showConfirmReset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showConfirmReset) {
        setShowConfirmReset(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmReset]);

  const handleToggleGeoloc = () => {
    const ora = Date.now();
    if (ora - lastActionTime < 1000) {
      return; // Previene invii multipli rapidi
    }
    setLastActionTime(ora);

    if (geodata.statoPermesso === 'concesso') {
      onRevocaGeolocalizzazione();
    } else {
      onRichiediGeolocalizzazione();
    }
  };

  const handleResetProfile = () => {
    onReset();
  };

  const isGeolocActive = geodata.statoPermesso === 'concesso' && geodata.coordinate !== null;

  return (
    <div className="profilo-page-container">
      
      {/* Profilo Header */}
      <div className="profile-header-card">
        <div className="profile-avatar-circle">
          <CheckCircledIcon className="verified-badge-icon" />
          <span>{profilo.nome[0]}{profilo.cognome[0]}</span>
        </div>
        
        <div className="profile-identity-info">
          <h3>{profilo.nome} {profilo.cognome}</h3>
          <p className="profile-cf">Profilo Personale Locale</p>
          <div className="provider-badge-wrapper">
            <span className="badge-identity-type spid">
              Utente Certificato
            </span>
            <span className="badge-provider-name">
              Area geografica: <strong>{profilo.comune} {profilo.provincia ? `(${profilo.provincia})` : ""}</strong>
            </span>
          </div>
        </div>
        
        <div className="profile-header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate("impostazioni")}
          >
            Modifica Dati
          </button>
        </div>
      </div>

      <div className="profile-details-grid">
        {/* Dati Anagrafici */}
        <div className="profile-section-card">
          <h4>Dati Identificativi dell'Utente</h4>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-label">Nome</span>
              <span className="detail-value">{profilo.nome}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cognome</span>
              <span className="detail-value">{profilo.cognome}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Comune di residenza</span>
              <span className="detail-value">{profilo.comune}</span>
            </div>
            {profilo.provincia && (
              <div className="detail-row">
                <span className="detail-label">Provincia</span>
                <span className="detail-value">{profilo.provincia}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Data Registrazione</span>
              <span className="detail-value">
                {profilo.dataRegistrazione ? new Date(profilo.dataRegistrazione).toLocaleDateString("it-IT") : "Non specificata"}
              </span>
            </div>
          </div>
        </div>

        {/* Dati di Contatto */}
        <div className="profile-section-card">
          <h4>Recapiti di Contatto</h4>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{profilo.email || "Non configurata"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cellulare</span>
              <span className="detail-value">{profilo.cellulare || "Non configurato"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Stato Consensi</span>
              <span className="detail-value">
                Privacy Accettata
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sezione Geolocalizzazione Reale */}
      <div className="card w-full">
        <div className="card-header" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
            Rilevamento della posizione geografica
          </h3>
        </div>
        
        <div className="card-body" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
            La geolocalizzazione consente all'applicazione di individuare in modo approssimativo la tua posizione per suggerirti gli uffici pubblici più vicini. L'elaborazione avviene interamente in locale sul tuo computer per tutelare la privacy.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
            <div className="flex items-center gap-sm">
              <strong style={{ fontSize: "0.95rem" }}>Stato Geolocalizzazione:</strong>
              <span style={{ 
                fontSize: "0.9rem", 
                fontWeight: 700, 
                color: isGeolocActive ? "var(--color-success)" : "var(--color-text-secondary)" 
              }}>
                {isGeolocActive ? "Attiva (Reale)" : "Disattivata"}
              </span>
            </div>
            
            <button 
              className={`btn ${isGeolocActive ? "btn-secondary" : "btn-primary"}`} 
              onClick={handleToggleGeoloc}
              disabled={loadingGeoloc}
              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
            >
              {isGeolocActive ? "Disattiva localizzazione" : "Abilita localizzazione"}
            </button>
          </div>

          {geolocError && (
            <div className="flex items-center gap-sm" style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "var(--space-xs)" }}>
              <InfoCircledIcon />
              <span>{geolocError}</span>
            </div>
          )}

          {loadingGeoloc && (
            <div className="flex items-center gap-sm" style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-sm)" }}>
              <LoopIcon className="animate-spin" />
              <span>Interrogazione sensori GPS del dispositivo in corso...</span>
            </div>
          )}

          {isGeolocActive && geodata.coordinate && geodata.closestCity && (
            <div 
              className="card-interactive"
              style={{ 
                padding: "var(--space-lg)", 
                backgroundColor: "var(--color-surface)", 
                borderRadius: "var(--radius-lg)", 
                border: "2px solid var(--color-border)",
                marginTop: "var(--space-md)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", fontSize: "0.85rem" }}>
                <div>
                  <strong style={{ display: "block" }}>Coordinate Rilevate (GPS reali):</strong>
                  <span className="font-mono" style={{ color: "var(--color-text-secondary)" }}>
                    {geodata.coordinate.lat.toFixed(6)}, {geodata.coordinate.lon.toFixed(6)}
                  </span>
                </div>
                
                <div>
                  <strong style={{ display: "block" }}>Capoluogo di Provincia più vicino:</strong>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {geodata.closestCity.nome} ({geodata.closestCity.provincia}) - Distante {geodata.closestCity.distanzaKm} km
                  </span>
                </div>

                <div>
                  <strong style={{ display: "block" }}>Precisione di rilevamento:</strong>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Approssimativa (Livello Provincia)
                  </span>
                </div>

                <div>
                  <strong style={{ display: "block" }}>Ufficio territorialmente suggerito:</strong>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Sedi Demografiche ed uffici INPS nella provincia di {geodata.closestCity.nome}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ripristino Dati */}
      <div className="card w-full" style={{ border: "1px solid var(--color-danger-border)", backgroundColor: "var(--color-danger-bg)" }}>
        <div className="card-body" style={{ padding: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-danger)", marginBottom: "4px" }}>
              Ripristino dell'applicazione
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
              Rimuove in modo permanente tutti i dati personali, le preferenze privacy, l'archivio locale e i percorsi di guida aperti, riportando l'applicazione allo stato iniziale.
            </p>
          </div>
          <div>
            <button 
              className="btn btn-outline-danger" 
              onClick={() => setShowConfirmReset(true)}
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              <TrashIcon /> Elimina Profilo Locale
            </button>
          </div>
        </div>
      </div>

      {/* Modal di conferma ripristino totale dell'applicazione */}
      {showConfirmReset && (
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
          onClick={() => setShowConfirmReset(false)}
        >
          <div 
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-desc"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-danger-border)",
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
              id="reset-dialog-title" 
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-danger)", margin: "0 0 var(--space-sm) 0" }}
            >
              Conferma ripristino applicazione
            </h3>
            
            <p 
              id="reset-dialog-desc" 
              style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 var(--space-lg) 0" }}
            >
              Questa operazione eliminerà in modo permanente tutti i tuoi dati, compreso il tuo profilo utente locale, i documenti caricati e l'avanzamento di tutti i percorsi guida attivi. Questa azione è irreversibile.
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button 
                ref={cancelResetBtnRef}
                className="btn btn-secondary" 
                onClick={() => setShowConfirmReset(false)}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem" }}
              >
                Annulla
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleResetProfile}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem", backgroundColor: "var(--color-danger)" }}
              >
                Ripristina applicazione
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-status-footer-bar">
        <span>
          Architettura: Database locale crittografato client-side
        </span>
        <span>
          Nessuna connessione esterna attiva
        </span>
      </div>

    </div>
  );
};
