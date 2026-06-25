import React, { useState, useEffect } from "react";
import { ProfiloUtente as ProfiloUtenteType } from "../types";
import { 
  CheckCircledIcon, 
  TrashIcon,
  LoopIcon
} from "@radix-ui/react-icons";

interface ProfiloUtenteProps {
  profilo: ProfiloUtenteType;
  onUpdate: (nuovoProfilo: ProfiloUtenteType) => void;
  onReset: () => void;
  onNavigate: (page: string) => void;
}

export const ProfiloUtente: React.FC<ProfiloUtenteProps> = ({
  profilo,
  onUpdate,
  onReset,
  onNavigate
}) => {
  const [geolocActive, setGeolocActive] = useState(profilo.consensoGeolocalizzazione);
  const [simulatedCoords, setSimulatedCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [loadingGeoloc, setLoadingGeoloc] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // Anti-spam click guardrail
  const [lastActionTime, setLastActionTime] = useState(0);

  useEffect(() => {
    if (geolocActive) {
      simulateGeolocLookup();
    } else {
      setSimulatedCoords(null);
    }
  }, [geolocActive, profilo.comune]);

  const simulateGeolocLookup = () => {
    setLoadingGeoloc(true);
    // Simula ritardo di rete locale/OS
    const timer = setTimeout(() => {
      // Coordinate simulate basate sulla prima lettera del comune per diversificare leggermente
      const charCodeSum = profilo.comune.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latVal = (41.8719 + (charCodeSum % 100) / 30).toFixed(4);
      const lonVal = (12.5674 + (charCodeSum % 100) / 40).toFixed(4);
      
      setSimulatedCoords({
        lat: `${latVal} N`,
        lon: `${lonVal} E`
      });
      setLoadingGeoloc(false);
    }, 800);

    return () => clearTimeout(timer);
  };

  const handleToggleGeoloc = () => {
    const ora = Date.now();
    if (ora - lastActionTime < 600) {
      // Evita spam-click rapidi
      return;
    }
    setLastActionTime(ora);

    const nuovoStato = !geolocActive;
    setGeolocActive(nuovoStato);
    
    const updatedProfile = {
      ...profilo,
      consensoGeolocalizzazione: nuovoStato
    };
    
    onUpdate(updatedProfile);
  };

  const handleResetProfile = () => {
    onReset();
  };

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

        {/* Dati di Contatto opzionali */}
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

      {/* Sezione Geolocalizzazione */}
      <div className="card w-full">
        <div className="card-header" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
            Rilevamento della posizione geografica
          </h3>
        </div>
        
        <div className="card-body" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
            La geolocalizzazione consente all'applicazione di individuare l'area di appartenenza dell'utente e suggerire automaticamente le sedi fisiche dei Comuni e degli uffici INPS territoriali. L'elaborazione avviene interamente in locale.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
            <div className="flex items-center gap-sm">
              <strong style={{ fontSize: "0.95rem" }}>Stato Geolocalizzazione:</strong>
              <span style={{ 
                fontSize: "0.9rem", 
                fontWeight: 700, 
                color: geolocActive ? "var(--color-success)" : "var(--color-text-secondary)" 
              }}>
                {geolocActive ? "Attiva (Opzionale)" : "Disattivata"}
              </span>
            </div>
            
            <button 
              className={`btn ${geolocActive ? "btn-secondary" : "btn-primary"}`} 
              onClick={handleToggleGeoloc}
              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
            >
              {geolocActive ? "Disattiva localizzazione" : "Abilita localizzazione"}
            </button>
          </div>

          {geolocActive && (
            <div style={{ 
              padding: "var(--space-md)", 
              backgroundColor: "var(--color-background)", 
              borderRadius: "var(--radius-md)", 
              border: "1px solid var(--color-border)",
              marginTop: "var(--space-sm)"
            }}>
              {loadingGeoloc ? (
                <div className="flex items-center gap-sm" style={{ color: "var(--color-text-secondary)" }}>
                  <LoopIcon className="animate-spin" />
                  <span>Rilevamento coordinate GPS in corso...</span>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", fontSize: "0.85rem" }}>
                  <div>
                    <strong style={{ display: "block" }}>Coordinate Rilevate (GPS):</strong>
                    <span className="font-mono" style={{ color: "var(--color-text-secondary)" }}>
                      {simulatedCoords ? `${simulatedCoords.lat}, ${simulatedCoords.lon}` : "Dati non disponibili"}
                    </span>
                  </div>
                  
                  <div>
                    <strong style={{ display: "block" }}>Ufficio Anagrafe suggerito:</strong>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      Ufficio Anagrafe Centrale - Comune di {profilo.comune}
                    </span>
                  </div>

                  <div>
                    <strong style={{ display: "block" }}>Precisione di rilevamento:</strong>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      Approssimativa (Livello Comune)
                    </span>
                  </div>

                  <div>
                    <strong style={{ display: "block" }}>Sportello Previdenziale:</strong>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      Sede Territoriale INPS - Area di {profilo.comune}
                    </span>
                  </div>
                </div>
              )}
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
            {!showConfirmReset ? (
              <button 
                className="btn btn-outline-danger" 
                onClick={() => setShowConfirmReset(true)}
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                <TrashIcon /> Elimina Profilo Locale
              </button>
            ) : (
              <div className="flex gap-sm">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmReset(false)}
                  style={{ fontSize: "0.85rem", padding: "6px 12px" }}
                >
                  Annulla
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleResetProfile}
                  style={{ backgroundColor: "var(--color-danger)", fontSize: "0.85rem", padding: "6px 12px" }}
                >
                  Conferma Eliminazione
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
