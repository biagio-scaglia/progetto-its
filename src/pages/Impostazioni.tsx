import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { PersonIcon, AccessibilityIcon } from "@radix-ui/react-icons";

export const Impostazioni: React.FC = () => {
  const [nome, setNome] = useState("Biagio Scaglia");
  const cf = "SCGBLG95A12L219Y";
  const [email, setEmail] = useState("biagio.scaglia@email.it");
  const [tel, setTel] = useState("+39 333 1234567");
  
  const [reducedMotion, setReducedMotion] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Impostazioni dell'Area Personale</h2>
          <p className="page-subtitle">Configura le preferenze dell'applicazione di guida locale e leggi le informazioni sull'integrazione dei dati.</p>
        </div>
      </div>

      {saved && (
        <Alert variant="success" title="Modifiche salvate con successo">
          Le impostazioni di guida locale sono state memorizzate con successo.
        </Alert>
      )}

      <div className="grid-dashboard">
        
        {/* Colonna Sinistra (Dati Utente / Profilo Locale) */}
        <section className="col-8" aria-label="Profilo personale e contatti">
          <div className="card w-full mb-lg">
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <PersonIcon /> Profilo Utente (Dati per compilazione locale)
              </h3>
            </div>
            
            <div className="card-body">
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
                Questi dati sono memorizzati esclusivamente in locale sul tuo computer e vengono utilizzati per riempire le bozze informative.
              </p>
              
              <form onSubmit={handleSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-nome">Nome Completo</label>
                    <input 
                      id="profile-nome"
                      type="text" 
                      className="form-input" 
                      value={nome} 
                      onChange={e => setNome(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-cf">Codice Fiscale</label>
                    <input 
                      id="profile-cf"
                      type="text" 
                      className="form-input" 
                      value={cf} 
                      disabled
                      style={{ backgroundColor: "var(--color-background)", color: "var(--color-text-disabled)", cursor: "not-allowed" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">Indirizzo E-mail per Avvisi</label>
                    <input 
                      id="profile-email"
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-tel">Recapito Telefonico per SMS</label>
                    <input 
                      id="profile-tel"
                      type="tel" 
                      className="form-input" 
                      value={tel} 
                      onChange={e => setTel(e.target.value)} 
                    />
                  </div>

                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
                  <Button type="submit">Salva Dati Locali</Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preferenze Accessibilità */}
          <div className="card w-full">
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <AccessibilityIcon /> Preferenze Accessibilità e Sistema
              </h3>
            </div>
            
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              
              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Riduci movimento e transizioni</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Semplifica le transizioni e disattiva le micro-animazioni rapide.
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={reducedMotion} 
                  onChange={e => setReducedMotion(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  aria-label="Attiva riduzione movimento"
                />
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Notifiche email ed SMS per scadenze</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Invia promemoria locali prima della data programmata delle guide attive.
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={e => setEmailAlerts(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  aria-label="Attiva notifiche scadenze"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Salvataggio automatico bozze</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Salva automaticamente i progressi nei moduli ogni 60 secondi localmente.
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoSave} 
                  onChange={e => setAutoSave(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  aria-label="Attiva salvataggio bozze automatico"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Colonna Destra (Predisposizione SPID/CIE) */}
        <section className="col-4" aria-label="Predisposizione SPID e CIE reale">
          <div className="card w-full mb-lg" style={{ borderTop: "4px solid var(--color-primary)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-dark-blue)" }}>
                Integrazione SPID / CIE
              </h3>
            </div>
            <div className="card-body" style={{ padding: "var(--space-md)", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                <div style={{ padding: "var(--space-sm)", backgroundColor: "var(--color-background)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Stato integrità:</span>
                  <strong style={{ display: "block", color: "var(--color-warning)", marginTop: "2px" }}>
                    Solo Consultazione Locale (Offline)
                  </strong>
                </div>
                
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  L'accesso con <strong>SPID</strong> o <strong>CIE</strong> rappresenta un'evoluzione pianificata. 
                  Trattandosi di sistemi reali di identità digitale gestiti da AgID, l'integrazione richiede protocolli di sicurezza standardizzati:
                </p>
                <ul style={{ paddingLeft: "16px", color: "var(--color-text-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Autenticazione tramite protocolli <strong>SAML 2.0</strong> (SPID) e <strong>OpenID Connect</strong> (CIE).</li>
                  <li>Integrazione dei tracciati con i nodi della <strong>Piattaforma Digitale Nazionale Dati (PDND)</strong>.</li>
                  <li>Firma XML dei metadati con certificati di cifratura qualificati registrati presso il registro AgID.</li>
                </ul>
                <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic", marginTop: "2px" }}>
                  Per ragioni di sicurezza, questa applicazione desktop non simula credenziali fittizie o scorciatoie insicure.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
