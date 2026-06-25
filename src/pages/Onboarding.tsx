import React, { useState } from "react";
import { ProfiloUtente } from "../types";
import { ProfileRepository, contieneEmoji } from "../repositories/profileRepository";
import { InfoCircledIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";
import { CITIES_DB } from "../services/geolocationService";

// Estrazione ed ordinamento dei suggerimenti geografici da CITIES_DB
const LISTA_COMUNI = CITIES_DB.map(c => c.nome).sort((a, b) => a.localeCompare(b, "it"));
const LISTA_PROVINCE = Array.from(new Set(CITIES_DB.map(c => c.provincia))).sort();

interface OnboardingProps {
  onComplete: (profilo: ProfiloUtente) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Form States
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [comune, setComune] = useState("");
  const [provincia, setProvincia] = useState("");
  const [email, setEmail] = useState("");
  const [cellulare, setCellulare] = useState("");
  
  // Privacy States
  const [consensoPrivacy, setConsensoPrivacy] = useState(false);
  const [consensoGeoloc, setConsensoGeoloc] = useState(false);
  
  // Error States
  const [error, setError] = useState<string | null>(null);

  const triggerError = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      const overlay = document.querySelector(".onboarding-overlay");
      if (overlay) {
        overlay.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const handleNextStep = () => {
    setError(null);
    
    if (step === 2) {
      // Validazione dati anagrafici
      if (!nome.trim() || !cognome.trim() || !comune.trim()) {
        triggerError("I campi Nome, Cognome e Comune di residenza sono obbligatori.");
        return;
      }
      
      // Controllo emoji
      if (contieneEmoji(nome) || contieneEmoji(cognome) || contieneEmoji(comune) || contieneEmoji(provincia) || contieneEmoji(email) || contieneEmoji(cellulare)) {
        triggerError("I dati inseriti non possono contenere simboli grafici o emoji.");
        return;
      }

      // Validazione email se presente
      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          triggerError("L'indirizzo email inserito non e' valido.");
          return;
        }
      }

      // Validazione cellulare se presente
      if (cellulare.trim()) {
        const cellRegex = /^\+?[0-9\s\-]+$/;
        if (!cellRegex.test(cellulare.trim())) {
          triggerError("Il numero di cellulare inserito non e' valido.");
          return;
        }
      }

      // Validazione provincia
      if (provincia.trim() && provincia.trim().length !== 2) {
        triggerError("La provincia deve essere indicata con la sigla di 2 lettere.");
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consensoPrivacy) {
      triggerError("E' necessario prestare il consenso al salvataggio locale dei dati per poter utilizzare l'applicazione.");
      return;
    }

    try {
      const nuovoProfilo: ProfiloUtente = {
        nome: nome.trim(),
        cognome: cognome.trim(),
        comune: comune.trim(),
        provincia: provincia.trim().toUpperCase() || undefined,
        email: email.trim() || undefined,
        cellulare: cellulare.trim() || undefined,
        onboardingCompletato: true,
        consensoPrivacy: true,
        consensoGeolocalizzazione: consensoGeoloc,
        dataRegistrazione: new Date().toISOString()
      };

      // Salva nel repository locale (effettua anche le validazioni interne)
      ProfileRepository.saveProfile(nuovoProfilo);
      onComplete(nuovoProfilo);
    } catch (err: any) {
      triggerError(err.message || "Errore durante il salvataggio dei dati locali.");
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        
        {/* Progress Stepper */}
        <div className="onboarding-stepper" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
          <div className={`step-dot ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <span className="step-label">Introduzione</span>
          </div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <span className="step-label">Dati Personali</span>
          </div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <span className="step-label">Consensi</span>
          </div>
        </div>

        {error && (
          <div className="onboarding-error-banner" role="alert">
            <InfoCircledIcon className="error-icon" />
            <div className="error-text">{error}</div>
          </div>
        )}

        <div className="onboarding-card">
          {/* STEP 1: PRESENTAZIONE */}
          {step === 1 && (
            <div className="onboarding-step-content">
              <h2 className="onboarding-title">Benvenuto nell'Area Personale di Guida ai Servizi</h2>
              
              <div className="onboarding-body">
                <p>
                  Questo software ti aiuta a orientarti tra i passaggi procedurali, i documenti necessari e i contatti per completare i servizi demografici e amministrativi italiani.
                </p>
                <p>
                  L'applicazione si avvia come uno spazio di lavoro pulito e privo di dati pre-caricati. Sarai tu a selezionare ed attivare le guide che ti interessano direttamente dal nostro catalogo servizi, ad aggiungere le tue scadenze personali e ad archiviare i tuoi documenti in totale privacy e sicurezza sul tuo dispositivo.
                </p>
                
                <div className="notice-box-onboarding">
                  <InfoCircledIcon className="notice-icon" />
                  <div className="notice-text">
                    <strong>Informativa Istituzionale Importante</strong>
                    <br />
                    Questa applicazione e' uno strumento di organizzazione e affiancamento personale ad uso esclusivo del cittadino. Non rappresenta in alcun modo una Pubblica Amministrazione, non sostituisce gli enti pubblici e non effettua invii ufficiali di domande per tuo conto.
                  </div>
                </div>
              </div>

              <div className="onboarding-footer-actions">
                <div /> {/* Spacer */}
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Inizia <ArrowRightIcon style={{ marginLeft: "4px" }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INSERIMENTO DATI */}
          {step === 2 && (
            <div className="onboarding-step-content">
              <h2 className="onboarding-title">Dati per la compilazione locale</h2>
              <p className="onboarding-subtitle">
                Inserisci i dati essenziali che l'applicazione utilizzera' per personalizzare le guide ed evidenziare i requisiti.
              </p>
              
              <div className="onboarding-body">
                <div className="onboarding-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-nome">Nome <span className="required-star">*</span></label>
                    <input
                      id="ob-nome"
                      type="text"
                      className="form-input"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Es. Mario"
                      required
                    />
                    <span className="field-explanation">Richiesto per precompilare i promemoria locali.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-cognome">Cognome <span className="required-star">*</span></label>
                    <input
                      id="ob-cognome"
                      type="text"
                      className="form-input"
                      value={cognome}
                      onChange={e => setCognome(e.target.value)}
                      placeholder="Es. Rossi"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-comune">Comune di Residenza <span className="required-star">*</span></label>
                    <input
                      id="ob-comune"
                      type="text"
                      className="form-input"
                      value={comune}
                      onChange={e => setComune(e.target.value)}
                      placeholder="Es. Roma"
                      list="ob-comuni-list"
                      required
                    />
                    <datalist id="ob-comuni-list">
                      {LISTA_COMUNI.map(com => (
                        <option key={com} value={com} />
                      ))}
                    </datalist>
                    <span className="field-explanation">Consente di identificare il tuo ufficio anagrafico locale.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-provincia">Provincia (Sigla)</label>
                    <input
                      id="ob-provincia"
                      type="text"
                      maxLength={2}
                      className="form-input"
                      value={provincia}
                      onChange={e => setProvincia(e.target.value.toUpperCase())}
                      placeholder="Es. RM"
                      list="ob-province-list"
                    />
                    <datalist id="ob-province-list">
                      {LISTA_PROVINCE.map(prov => (
                        <option key={prov} value={prov} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label" htmlFor="ob-email">Indirizzo E-mail (Opzionale)</label>
                    <input
                      id="ob-email"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="mario.rossi@provider.it"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label" htmlFor="ob-cellulare">Numero di Cellulare (Opzionale)</label>
                    <input
                      id="ob-cellulare"
                      type="text"
                      className="form-input"
                      value={cellulare}
                      onChange={e => setCellulare(e.target.value)}
                      placeholder="+39 333 1234567"
                    />
                  </div>
                </div>
              </div>

              <div className="onboarding-footer-actions">
                <button className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeftIcon style={{ marginRight: "4px" }} /> Indietro
                </button>
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Continua <ArrowRightIcon style={{ marginLeft: "4px" }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRIVACY & CONSENSI */}
          {step === 3 && (
            <div className="onboarding-step-content">
              <h2 className="onboarding-title">Informativa sulla privacy locale e consensi</h2>
              
              <div className="onboarding-body">
                <div className="privacy-info-block">
                  <p>
                    <strong>Salvataggio dei dati in locale:</strong> Tutti i dati personali inseriti in questa applicazione, comprese le informazioni del profilo e i documenti caricati, vengono memorizzati esclusivamente nella memoria locale protetta del tuo dispositivo. Nessun dato viene inviato a server cloud esterni o trasmesso via internet.
                  </p>
                  <p>
                    <strong>Geolocalizzazione facoltativa:</strong> L'applicazione puo' utilizzare la geolocalizzazione per rilevare in modo approssimativo la tua posizione geografica al solo scopo di suggerire le sedi fisiche degli uffici demografici o degli sportelli INPS piu' vicini. La funzione e' facoltativa, spenta per impostazione predefinita e puo' essere attivata o disattivata in qualsiasi momento.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "var(--space-lg)" }}>
                  <div className="consent-check-item">
                    <input
                      id="chk-privacy"
                      type="checkbox"
                      className="consent-checkbox"
                      checked={consensoPrivacy}
                      onChange={e => setConsensoPrivacy(e.target.checked)}
                      required
                    />
                    <label htmlFor="chk-privacy" className="consent-label">
                      <strong>Consenso al trattamento e salvataggio locale dei dati (Obbligatorio)</strong>
                      <br />
                      <span className="consent-desc">Acconsento al salvataggio locale delle informazioni da me inserite al fine di abilitare la personalizzazione dei percorsi di guida.</span>
                    </label>
                  </div>

                  <div className="consent-check-item" style={{ marginTop: "var(--space-md)" }}>
                    <input
                      id="chk-geoloc"
                      type="checkbox"
                      className="consent-checkbox"
                      checked={consensoGeoloc}
                      onChange={e => setConsensoGeoloc(e.target.checked)}
                    />
                    <label htmlFor="chk-geoloc" className="consent-label">
                      <strong>Consenso all'uso opzionale della geolocalizzazione (Facoltativo)</strong>
                      <br />
                      <span className="consent-desc">Acconsento all'uso dei dati di localizzazione per il suggerimento automatico degli uffici pubblici territoriali vicini a me.</span>
                    </label>
                  </div>
                  
                  <div className="onboarding-footer-actions" style={{ marginTop: "var(--space-xl)" }}>
                    <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                      <ArrowLeftIcon style={{ marginRight: "4px" }} /> Indietro
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "var(--color-success)" }}>
                      Completa ed entra <CheckIcon style={{ marginLeft: "4px" }} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
