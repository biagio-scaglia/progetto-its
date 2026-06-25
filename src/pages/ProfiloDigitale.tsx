import React, { useState } from "react";
import { 
  PersonIcon, 
  InfoCircledIcon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  ExitIcon, 
  ExternalLinkIcon, 
  LockClosedIcon, 
  SymbolIcon,
  ClipboardIcon
} from "@radix-ui/react-icons";
import { SpidService, IdentityProvider } from "../services/spidService";
import { SpidSessionState, ProfiloCittadino } from "../types";
import { SPID_CONFIG } from "../config/spid.config";

interface ProfiloDigitaleProps {
  session: SpidSessionState;
  onLoginSuccess: (session: SpidSessionState) => void;
  onLogout: () => void;
}

export const ProfiloDigitale: React.FC<ProfiloDigitaleProps> = ({
  session,
  onLoginSuccess,
  onLogout
}) => {
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const idps = SpidService.getIdps();

  const handleIdpSelect = async (idp: IdentityProvider) => {
    setShowIdpModal(false);
    setLoading(true);
    setErrorMessage(null);
    try {
      // Avvia il login reale aprendo il browser esterno puntato al backend companion
      await SpidService.startSpidLogin(idp.code);
      
      // Mostriamo un messaggio informativo all'utente sul fatto che il browser è aperto
      const alertDiv = document.createElement("div");
      alertDiv.className = "spid-toast-info";
      alertDiv.innerHTML = `
        <strong>Browser aperto</strong><br/>
        Completa l'accesso nella finestra del browser. Se non si apre automaticamente, il backend è avviato su ${SPID_CONFIG.companionBackendUrl}.
      `;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 6000);
    } catch (err: any) {
      setErrorMessage(`Errore nell'avvio del login SPID: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCieLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // CIE usa un flusso analogo a SPID ma con endpoint specifico sul bridge
      await SpidService.startSpidLogin("cie");
    } catch (err: any) {
      setErrorMessage(`Errore nell'avvio del login CIE: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const profile = await SpidService.getCittadinoProfile(manualToken.trim());
      onLoginSuccess({
        isAuthenticated: true,
        token: manualToken.trim(),
        profilo: profile,
        dataAutenticazione: new Date().toISOString(),
        scadenzaSessione: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      });
      setManualToken("");
    } catch (err: any) {
      setErrorMessage(`Token non valido o backend non raggiungibile: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMockSession = () => {
    // Genera una sessione mock locale istantanea per bypassare il backend in fase di sviluppo/demo offline
    const mockProfile: ProfiloCittadino = {
      spidCode: "SPID-LOCAL-DEMO-99999",
      nome: "Biagio",
      cognome: "Scaglia",
      codiceFiscale: "SCGBLG95A12L219Y",
      sesso: "M",
      dataNascita: "1995-01-12",
      luogoNascita: "Torino",
      provinciaNascita: "TO",
      email: "biagio.scaglia@email.it",
      cellulare: "+39 333 1234567",
      pec: "biagio.scaglia@pec.it",
      indirizzoDomicilio: "Corso Duca degli Abruzzi 24, 10129 Torino (TO)",
      providerAutenticazione: "PosteID",
      tipoIdentita: "SPID"
    };

    onLoginSuccess({
      isAuthenticated: true,
      token: "mock-local-token-offline-testing",
      profilo: mockProfile,
      dataAutenticazione: new Date().toISOString(),
      scadenzaSessione: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    if (session.token) {
      await SpidService.logout(session.token);
    }
    onLogout();
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="profilo-page-container">
      {errorMessage && (
        <div className="alert-banner error" role="alert">
          <CrossCircledIcon className="alert-icon" />
          <div className="alert-content">
            <strong>Errore di Autenticazione</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 1. SCHERMATA NON AUTENTICATO */}
      {!session.isAuthenticated ? (
        <div className="auth-card-unauthenticated">
          <div className="auth-card-header">
            <div className="auth-badge-icon">
              <LockClosedIcon className="lock-icon" />
            </div>
            <h2>Identità Digitale Nazionale</h2>
            <p className="auth-lead-text">
              Collega la tua identità <strong>SPID</strong> o <strong>CIE</strong> per accedere in modo sicuro ai tuoi dati anagrafici e personalizzare i percorsi di guida con i servizi pubblici italiani.
            </p>
          </div>

          <div className="auth-action-box">
            {/* Bottone Ufficiale SPID - Linee Guida Designers Italia */}
            <button 
              className="btn-spid-primary" 
              onClick={() => setShowIdpModal(true)}
              disabled={loading}
              aria-haspopup="dialog"
            >
              <span className="spid-btn-logo">
                <span className="spid-btn-l">S</span>
                <span className="spid-btn-l">P</span>
                <span className="spid-btn-l">I</span>
                <span className="spid-btn-l">D</span>
              </span>
              <span className="spid-btn-text">Entra con SPID</span>
            </button>

            {/* Bottone Ufficiale CIE - Linee Guida Designers Italia */}
            <button 
              className="btn-cie-primary" 
              onClick={handleCieLogin}
              disabled={loading}
            >
              <div className="cie-btn-logo-wrapper">
                <span className="cie-logo-c">C</span>
                <span className="cie-logo-i">I</span>
                <span className="cie-logo-e">E</span>
              </div>
              <span className="cie-btn-text">Entra con CIE</span>
            </button>
          </div>

          <div className="auth-info-footer">
            <InfoCircledIcon />
            <span>
              L'applicazione non memorizza la tua password. L'autenticazione avviene esclusivamente sui server dei gestori di identità accreditati AgID tramite protocollo sicuro SAML 2.0.
            </span>
          </div>
        </div>
      ) : (
        /* 2. SCHERMATA AUTENTICATO */
        <div className="profile-dashboard-wrapper">
          <div className="profile-header-card">
            <div className="profile-avatar-circle">
              <CheckCircledIcon className="verified-badge-icon" />
              <span>{session.profilo?.nome[0]}{session.profilo?.cognome[0]}</span>
            </div>
            <div className="profile-identity-info">
              <h3>{session.profilo?.nome} {session.profilo?.cognome}</h3>
              <p className="profile-cf">{session.profilo?.codiceFiscale}</p>
              <div className="provider-badge-wrapper">
                <span className={`badge-identity-type ${session.profilo?.tipoIdentita?.toLowerCase()}`}>
                  {session.profilo?.tipoIdentita}
                </span>
                <span className="badge-provider-name">
                  Fornito da: <strong>{session.profilo?.providerAutenticazione || "Sconosciuto"}</strong>
                </span>
              </div>
            </div>
            <div className="profile-header-actions">
              <button 
                className="btn-outline-danger" 
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? <SymbolIcon className="animate-spin" /> : <ExitIcon />}
                <span>Scollega Identità</span>
              </button>
            </div>
          </div>

          <div className="profile-details-grid">
            {/* Dati Anagrafici */}
            <div className="profile-section-card">
              <h4>Anagrafica Cittadino</h4>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">Nome</span>
                  <span className="detail-value">{session.profilo?.nome}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cognome</span>
                  <span className="detail-value">{session.profilo?.cognome}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Codice Fiscale</span>
                  <span className="detail-value font-mono">{session.profilo?.codiceFiscale}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label font-mono">Genere / Sesso</span>
                  <span className="detail-value">{session.profilo?.sesso || "Non specificato"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Data di Nascita</span>
                  <span className="detail-value">
                    {session.profilo?.dataNascita ? new Date(session.profilo.dataNascita).toLocaleDateString("it-IT") : "Non specificato"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Luogo di Nascita</span>
                  <span className="detail-value">
                    {session.profilo?.luogoNascita} {session.profilo?.provinciaNascita ? `(${session.profilo.provinciaNascita})` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Dati di Contatto e Recapiti */}
            <div className="profile-section-card">
              <h4>Recapiti e Domicilio Digitale</h4>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">Email ordinaria</span>
                  <span className="detail-value">{session.profilo?.email || "Non specificata"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cellulare / Telefono</span>
                  <span className="detail-value">{session.profilo?.cellulare || "Non specificato"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">PEC (Domicilio Digitale)</span>
                  <span className="detail-value">{session.profilo?.pec || "Nessun indirizzo PEC collegato"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Indirizzo di Domicilio</span>
                  <span className="detail-value address-value">{session.profilo?.indirizzoDomicilio || "Non specificato"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Codice Identificativo SPID</span>
                  <span className="detail-value font-mono text-small">{session.profilo?.spidCode || "Non disponibile"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-status-footer-bar">
            <span className="status-footer-timestamp">
              Sessione creata il: {session.dataAutenticazione ? new Date(session.dataAutenticazione).toLocaleString("it-IT") : ""}
            </span>
            <span className="status-footer-protocol">
              Protocollo Sicuro: SAML 2.0 (AgID conforme) • Cifratura SHA-256
            </span>
          </div>
        </div>
      )}

      {/* 3. IDENTITY PROVIDER SELECTION MODAL */}
      {showIdpModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="idp-modal-title">
          <div className="modal-content idp-selector-modal">
            <div className="modal-header">
              <h3 id="idp-modal-title">Seleziona il tuo gestore SPID</h3>
              <button 
                className="btn-close-modal" 
                onClick={() => setShowIdpModal(false)}
                aria-label="Chiudi finestra"
              >
                &times;
              </button>
            </div>
            <div className="idp-grid">
              {idps.map((idp) => (
                <button
                  key={idp.code}
                  className="idp-button"
                  style={{ borderLeft: `4px solid ${idp.color}` }}
                  onClick={() => handleIdpSelect(idp)}
                >
                  <div className="idp-logo-badge" style={{ backgroundColor: idp.color }}>
                    {idp.logoText}
                  </div>
                  <span className="idp-name">{idp.name}</span>
                </button>
              ))}
            </div>
            <div className="modal-footer">
              <a 
                href="https://www.spid.gov.it/richiedi-spid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="modal-footer-link"
              >
                Non hai SPID? Scopri come ottenerlo <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. SVILUPPATORI / GUIDA TECNICA COMPLIANCE AGID */}
      <div className="developer-onboarding-panel">
        <button 
          className="dev-panel-header-toggle" 
          onClick={() => setShowDevPanel(!showDevPanel)}
          aria-expanded={showDevPanel}
        >
          <span>⚙️ Istruzioni di Onboarding & Sandbox per Sviluppatori</span>
          <span className="toggle-chevron">{showDevPanel ? "▲" : "▼"}</span>
        </button>

        {showDevPanel && (
          <div className="dev-panel-content">
            <div className="dev-intro">
              <h5>Architettura dell'Integrazione SPID</h5>
              <p>
                In conformità con le specifiche AgID, le chiavi private X.509 non possono risiedere nell'app client native desktop (rischio di decompilazione). L'architettura adotta un <strong>Companion Auth Server / Auth Bridge</strong> locale in Node.js che gestisce gli endpoint SAML firmati e restituisce la sessione tramite URL Schema.
              </p>
            </div>

            <div className="dev-grid-columns">
              <div className="dev-col-left">
                <h6>1. Generazione Certificati X.509</h6>
                <p>Genera la coppia di chiavi RSA 2048bit da posizionare in <code>auth-companion/certificates/</code>:</p>
                <div className="code-block-wrapper">
                  <pre>
                    <code>{`openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
  -keyout sp-private-key.pem \\
  -out sp-cert.pem`}</code>
                  </pre>
                  <button 
                    className="btn-icon-only" 
                    title="Copia negli appunti"
                    onClick={() => copyToClipboard(`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout sp-private-key.pem -out sp-cert.pem`)}
                  >
                    {copiedText ? <CheckCircledIcon style={{color: "var(--color-success)"}} /> : <ClipboardIcon />}
                  </button>
                </div>

                <h6>2. Metadata XML del Service Provider</h6>
                <p>Verifica l'XML di configurazione generato dinamicamente dal server bridge per il registro AgID:</p>
                <a 
                  href={`${SPID_CONFIG.companionBackendUrl}/metadata`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-external-dev"
                >
                  Visualizza Metadata XML <ExternalLinkIcon />
                </a>
              </div>

              <div className="dev-col-right">
                <h6>3. Simulazione Manuale (Bypass SAML)</h6>
                <p>Se il Companion Server è in esecuzione in modalità SIMULATA (senza chiavi), esegui il login e incolla qui il token JWT risultante:</p>
                
                <form onSubmit={handleManualTokenSubmit} className="dev-manual-token-form">
                  <input
                    type="text"
                    placeholder="Incolla il token JWT ricevuto..."
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    className="dev-token-input"
                  />
                  <button 
                    type="submit" 
                    className="btn-small-primary" 
                    disabled={loading || !manualToken.trim()}
                  >
                    Collega con Token
                  </button>
                </form>

                <div className="divider-or">oppure</div>

                <button 
                  className="btn-small-secondary" 
                  onClick={handleLoadMockSession}
                >
                  <PersonIcon /> Carica Sessione Demo Locale (Offline)
                </button>
                <p className="dev-note-desc">
                  Consente di testare istantaneamente tutta la UI di personalizzazione dei percorsi di guida senza avviare il server in Node.js.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
