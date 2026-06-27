import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { BRAND } from "../config/branding";
import { ProfiloUtente as ProfiloUtenteType } from "../types";
import { contieneEmoji } from "../repositories/profileRepository";
import { GeolocationData } from "../repositories/geolocationRepository";
import { PersonIcon, AccessibilityIcon, LockClosedIcon, InfoCircledIcon, GearIcon } from "@radix-ui/react-icons";
import { SettingsService, AISettings } from "../services/settingsService";
import { COPY_SETTINGS } from "../config/microcopy";
import { CacheStore } from "../cache/cacheStore";

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

  // Local AI Settings States
  const [aiSettings, setAiSettings] = useState<AISettings>(() => SettingsService.getSettings());

  const handleAISettingChange = (key: keyof AISettings, value: any) => {
    const updated = SettingsService.saveSettings({ [key]: value });
    setAiSettings(updated);
  };

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
      
      setSuccessMessage(COPY_SETTINGS.saveSuccess);
      
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
        <Alert variant="error" title={COPY_SETTINGS.saveErrorTitle}>
          {errorMessage}
        </Alert>
      )}

      <div className="grid-dashboard">
        
        {/* Colonna Sinistra (Dati Utente / Profilo Locale) */}
        <section className="col-8" aria-label="Profilo personale e contatti">
          <div className="card w-full mb-lg">
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <PersonIcon /> {COPY_SETTINGS.profileSectionTitle}
              </h3>
            </div>
            
            <div className="card-body">
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-md)" }}>
                {COPY_SETTINGS.profileDescription}
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
                    {saving ? COPY_SETTINGS.savingButton : COPY_SETTINGS.saveButton}
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
                  className="switch-toggle"
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
                  className="switch-toggle"
                  aria-label="Attiva caratteri ingranditi"
                />
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>{COPY_SETTINGS.ttsLabel}</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    {COPY_SETTINGS.ttsDesc}
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableTTS} 
                  onChange={e => handleTTSToggle(e.target.checked)}
                  className="switch-toggle"
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
                  className="switch-toggle"
                  aria-label="Attiva salvataggio bozze automatico"
                />
              </div>

            </div>
          </div>

          {/* Configurazione Modelli AI Locali */}
          <div className="card w-full mt-lg" style={{ marginTop: "var(--space-lg)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <GearIcon /> {COPY_SETTINGS.engineSectionTitle}
              </h3>
            </div>
            
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: "var(--space-md)" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)" }}>
                {COPY_SETTINGS.engineDescription}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label" htmlFor="ai-endpoint">{COPY_SETTINGS.engineEndpointLabel}</label>
                  <input
                    id="ai-endpoint"
                    type="text"
                    className="form-input"
                    value={aiSettings.ollamaEndpoint}
                    onChange={e => handleAISettingChange("ollamaEndpoint", e.target.value)}
                    placeholder="http://localhost:11434"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label" htmlFor="ai-qwen-model">{COPY_SETTINGS.engineModelLabel}</label>
                  <input
                    id="ai-qwen-model"
                    type="text"
                    className="form-input"
                    value={aiSettings.qwenModel}
                    onChange={e => handleAISettingChange("qwenModel", e.target.value)}
                    placeholder="qwen2-7b"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label" htmlFor="ai-qwen-timeout">{COPY_SETTINGS.engineTimeoutLabel}</label>
                  <input
                    id="ai-qwen-timeout"
                    type="number"
                    className="form-input"
                    value={aiSettings.qwenTimeout}
                    onChange={e => handleAISettingChange("qwenTimeout", parseInt(e.target.value) || 30000)}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{COPY_SETTINGS.engineRewriteLabel}</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                      {COPY_SETTINGS.engineRewriteDesc}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.useQwenRewriting}
                    onChange={e => handleAISettingChange("useQwenRewriting", e.target.checked)}
                    className="switch-toggle"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sicurezza AI Locale (Defensive Layer) */}
          <div className="card w-full mt-lg" style={{ marginTop: "var(--space-lg)", borderTop: "4px solid var(--color-warning)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <LockClosedIcon /> {COPY_SETTINGS.securitySectionTitle}
              </h3>
            </div>
            
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: "var(--space-md)" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)" }}>
                {COPY_SETTINGS.securityDescription}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{COPY_SETTINGS.securityToggleLabel}</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                      {COPY_SETTINGS.securityToggleDesc}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.safeMode}
                    onChange={e => handleAISettingChange("safeMode", e.target.checked)}
                    className="switch-toggle"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{COPY_SETTINGS.protectionLevelLabel}</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                      {COPY_SETTINGS.protectionLevelDesc}
                    </span>
                  </div>
                  <select
                    value={aiSettings.protectionLevel}
                    onChange={e => handleAISettingChange("protectionLevel", e.target.value as any)}
                    style={{
                      padding: "var(--space-xs) var(--space-sm)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-background)",
                      color: "var(--color-text-primary)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="standard">{COPY_SETTINGS.protectionLevelNormal}</option>
                    <option value="strict">{COPY_SETTINGS.protectionLevelMax}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Integrazione Llama.cpp e Caching Locale */}
          <div className="card w-full mt-lg" style={{ marginTop: "var(--space-lg)", borderTop: "4px solid var(--color-primary)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-dark-blue)", display: "flex", alignItems: "center", gap: "8px" }}>
                <GearIcon /> Caching Locale e Runtime di Inferenza
              </h3>
            </div>
            
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: "var(--space-md)" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)" }}>
                Ottimizza i tempi di risposta della chat configurando il server locale per l'inferenza e i livelli di caching locali.
              </p>

              {/* Scelta Runtime */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                <strong style={{ fontSize: "0.95rem" }}>Motore di Risposta Locale (Runtime)</strong>
                <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem" }}>
                    <input 
                      type="radio" 
                      name="llmProvider"
                      checked={aiSettings.llmProvider === "ollama"}
                      onChange={() => handleAISettingChange("llmProvider", "ollama")}
                      style={{ cursor: "pointer" }}
                    />
                    Ollama (Default)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem" }}>
                    <input 
                      type="radio" 
                      name="llmProvider"
                      checked={aiSettings.llmProvider === "llama.cpp"}
                      onChange={() => handleAISettingChange("llmProvider", "llama.cpp")}
                      style={{ cursor: "pointer" }}
                    />
                    llama.cpp / llama-server
                  </label>
                </div>
              </div>

              {/* Endpoint llama.cpp */}
              {aiSettings.llmProvider === "llama.cpp" && (
                <div className="form-group" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                  <label className="form-label" htmlFor="llama-endpoint">Indirizzo Server llama.cpp</label>
                  <input
                    id="llama-endpoint"
                    type="text"
                    className="form-input"
                    value={aiSettings.llamaCppEndpoint}
                    onChange={e => handleAISettingChange("llamaCppEndpoint", e.target.value)}
                    placeholder="http://localhost:8080"
                  />
                  <span className="form-helper">L'indirizzo di rete locale in cui è in esecuzione il comando llama-server con il flag --port.</span>
                </div>
              )}

              {/* Exact Cache Toggle */}
              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Cache Esatta (Exact Cache)</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Riusa all'istante le risposte generate per domande identiche sullo stesso contesto documentale.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiSettings.enableExactCache}
                  onChange={e => handleAISettingChange("enableExactCache", e.target.checked)}
                  className="switch-toggle"
                />
              </div>

              {/* Semantic Cache Toggle */}
              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Cache Semantica (Semantic Cache)</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Riconosce e riusa risposte a domande formulate in modo differente ma con significato simile.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiSettings.enableSemanticCache}
                  onChange={e => handleAISettingChange("enableSemanticCache", e.target.checked)}
                  className="switch-toggle"
                />
              </div>

              {/* Semantic Threshold Slider */}
              {aiSettings.enableSemanticCache && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "0.95rem" }}>Soglia di Similarità Semantica</strong>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {Math.round(aiSettings.semanticSimilarityThreshold * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={aiSettings.semanticSimilarityThreshold}
                    onChange={e => handleAISettingChange("semanticSimilarityThreshold", parseFloat(e.target.value))}
                    style={{ width: "100%", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  />
                  <span className="form-helper">Valori più alti (es. 85-90%) garantiscono un riuso sicuro per domande estremamente simili.</span>
                </div>
              )}

              {/* Azione Pulizia Cache */}
              <div className="flex justify-between items-center">
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>Pulisci Archivio Cache</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Cancella tutte le risposte memorizzate localmente in memoria cache.
                  </span>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    CacheStore.invalidateAll();
                    alert("Archivio della cache locale svuotato con successo!");
                  }}
                  style={{ minHeight: "36px", padding: "6px 12px", fontSize: "0.85rem" }}
                  type="button"
                >
                  Svuota Cache
                </Button>
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
                <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>{COPY_SETTINGS.dataStatusLabel}</span>
                <strong style={{ display: "block", color: "var(--color-success)", marginTop: "2px" }}>
                  {COPY_SETTINGS.dataStatusValue}
                </strong>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--color-dark-blue)", marginBottom: "4px" }}>
                  Geolocalizzazione Opzionale
                </strong>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.4", marginBottom: "var(--space-sm)" }}>
                  {COPY_SETTINGS.geolocDesc}
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
                    className="switch-toggle"
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
