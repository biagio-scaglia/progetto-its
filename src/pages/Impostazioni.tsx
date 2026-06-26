import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { BRAND } from "../config/branding";
import { ProfiloUtente as ProfiloUtenteType } from "../types";
import { contieneEmoji } from "../repositories/profileRepository";
import { GeolocationData } from "../repositories/geolocationRepository";
import { PersonIcon, AccessibilityIcon, LockClosedIcon, InfoCircledIcon } from "@radix-ui/react-icons";

interface ImpostazioniProps {
  profilo: ProfiloUtenteType;
  onUpdate: (nuovoProfilo: ProfiloUtenteType) => void;
  geodata: GeolocationData;
  onRichiediGeolocalizzazione: () => void;
  onRevocaGeolocalizzazione: () => void;
}

export const Impostazioni: React.FC<ImpostazioniProps> = ({
  profilo,
  onUpdate,
  geodata,
  onRichiediGeolocalizzazione,
  onRevocaGeolocalizzazione
}) => {
  // Form States initialized from the current profile
  const [nome, setNome] = useState(profilo.nome);
  const [cognome, setCognome] = useState(profilo.cognome);
  const [comune, setComune] = useState(profilo.comune);
  const [provincia, setProvincia] = useState(profilo.provincia || "");
  const [email, setEmail] = useState(profilo.email || "");
  const [tel, setTel] = useState(profilo.cellulare || "");
  
  // Preference States
  const [reducedMotion, setReducedMotion] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [largeText, setLargeText] = useState(() => localStorage.getItem("pref-large-text") === "true");
  const [enableTTS, setEnableTTS] = useState(() => localStorage.getItem("pref-enable-tts") !== "false");

  const handleLargeTextToggle = (checked: boolean) => {
    setLargeText(checked);
    if (checked) {
      document.body.classList.add("accessibility-large-text");
      localStorage.setItem("pref-large-text", "true");
    } else {
      document.body.classList.remove("accessibility-large-text");
      localStorage.setItem("pref-large-text", "false");
    }
  };

  const handleTTSToggle = (checked: boolean) => {
    setEnableTTS(checked);
    if (checked) {
      localStorage.setItem("pref-enable-tts", "true");
    } else {
      localStorage.setItem("pref-enable-tts", "false");
      window.speechSynthesis.cancel();
    }
  };

  // Status message states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Anti-spam click guardrail
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setSaving(true);

    // Validazione immediata
    if (!nome.trim() || !cognome.trim() || !comune.trim()) {
      setErrorMessage("I campi Nome, Cognome e Comune di residenza sono obbligatori.");
      setSaving(false);
      return;
    }

    // Controllo emoji
    if (
      contieneEmoji(nome) || 
      contieneEmoji(cognome) || 
      contieneEmoji(comune) || 
      contieneEmoji(provincia) || 
      contieneEmoji(email) || 
      contieneEmoji(tel)
    ) {
      setErrorMessage("Non e' consentito l'uso di simboli grafici o emoji nei campi del profilo.");
      setSaving(false);
      return;
    }

    // Validazione sigla provincia
    if (provincia.trim() && provincia.trim().length !== 2) {
      setErrorMessage("La provincia deve essere indicata con la sigla di 2 lettere.");
      setSaving(false);
      return;
    }

    try {
      const updatedProfile: ProfiloUtenteType = {
        ...profilo,
        nome: nome.trim(),
        cognome: cognome.trim(),
        comune: comune.trim(),
        provincia: provincia.trim().toUpperCase() || undefined,
        email: email.trim() || undefined,
        cellulare: tel.trim() || undefined,
        consensoGeolocalizzazione: geodata.statoPermesso === 'concesso'
      };

      // Aggiorna lo stato tramite hook
      onUpdate(updatedProfile);
      
      setSuccessMessage("Modifiche salvate con successo nel database locale.");
      
      // Nascondi il banner di successo dopo 3 secondi
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Errore durante il salvataggio dei dati.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Impostazioni di {BRAND.name}</h2>
          <p className="page-subtitle">Configura le preferenze dell'applicazione di guida locale e gestisci i tuoi consensi sulla privacy.</p>
        </div>
      </div>

      {successMessage && (
        <Alert variant="success" title="Modifiche salvate">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="error" title="Errore di validazione">
          {errorMessage}
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
                Questi dati sono memorizzati esclusivamente sul tuo computer e vengono utilizzati all'interno dell'applicazione di orientamento.
              </p>
              
              <form onSubmit={handleSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-nome">Nome <span className="required-star">*</span></label>
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
                    <label className="form-label" htmlFor="profile-cognome">Cognome <span className="required-star">*</span></label>
                    <input 
                      id="profile-cognome"
                      type="text" 
                      className="form-input" 
                      value={cognome} 
                      onChange={e => setCognome(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-comune">Comune di residenza <span className="required-star">*</span></label>
                    <input 
                      id="profile-comune"
                      type="text" 
                      className="form-input" 
                      value={comune} 
                      onChange={e => setComune(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-provincia">Provincia (Sigla)</label>
                    <input 
                      id="profile-provincia"
                      type="text" 
                      maxLength={2}
                      className="form-input" 
                      value={provincia} 
                      onChange={e => setProvincia(e.target.value)} 
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label" htmlFor="profile-email">Indirizzo E-mail</label>
                    <input 
                      id="profile-email"
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label" htmlFor="profile-tel">Recapito Telefonico</label>
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
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvataggio..." : "Salva Dati Locali"}
                  </Button>
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
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Caratteri ingranditi (Zoom testo)</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Aumenta la dimensione del testo dell'applicazione per facilitare la lettura.
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={largeText} 
                  onChange={e => handleLargeTextToggle(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  aria-label="Attiva caratteri ingranditi"
                />
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Abilita Lettura Vocale (TTS)</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Mostra i pulsanti per ascoltare la lettura vocale dei contenuti principali dell'applicazione.
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableTTS} 
                  onChange={e => handleTTSToggle(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  aria-label="Attiva lettura vocale"
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

        {/* Colonna Destra (Privacy & Consensi) */}
        <section className="col-4" aria-label="Gestione consensi e privacy locale">
          <div className="card w-full mb-lg" style={{ borderTop: "4px solid var(--color-primary)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "6px" }}>
                <LockClosedIcon /> Privacy e Consensi
              </h3>
            </div>
            <div className="card-body" style={{ padding: "var(--space-md)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              
              <div style={{ padding: "var(--space-sm)", backgroundColor: "var(--color-background)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>Persistenza database:</span>
                <strong style={{ display: "block", color: "var(--color-success)", marginTop: "2px" }}>
                  Archiviazione Locale Offline (Attiva)
                </strong>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Geolocalizzazione Opzionale
                </strong>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.4", marginBottom: "var(--space-sm)" }}>
                  Consente all'app di ricavare coordinate approssimative lato client per determinare l'ufficio comunale e lo sportello INPS piu' vicino.
                </p>
                
                <div className="flex items-center gap-sm">
                  <input 
                    id="opt-geoloc"
                    type="checkbox"
                    checked={geodata.statoPermesso === 'concesso'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onRichiediGeolocalizzazione();
                      } else {
                        onRevocaGeolocalizzazione();
                      }
                    }}
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  />
                  <label htmlFor="opt-geoloc" style={{ fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer" }}>
                    Abilita Geolocalizzazione
                  </label>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-sm)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  <InfoCircledIcon /> Nota sulla privacy
                </h4>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                  Tutte le preferenze e i consensi espressi sono modificabili in qualunque momento. La disattivazione della geolocalizzazione non pregiudica le altre funzioni del software.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
