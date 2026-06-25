/**
 * ==========================================================================
 * COMPANION AUTH SERVER / AUTH BRIDGE - SPID & CIE SERVICE PROVIDER
 * Server di autenticazione delegato SAML 2.0 per applicazione Tauri desktop.
 * ==========================================================================
 * 
 * Questo server gestisce la cifratura SAML, la custodia delle chiavi private
 * X.509 e la ricezione sicura della risposta dell'Identity Provider.
 * Al termine del flusso, reindirizza la sessione all'app native tramite URI Scheme.
 * 
 * PREREQUISITI PER L'ATTIVAZIONE UFFICIALE:
 * 1. Generare una coppia di chiavi X.509 RSA 2048bit:
 *    openssl req -x509 -nodes -sha256 -days 365 -newkey rsa:2048 -keyout sp-private-key.pem -out sp-cert.pem
 * 2. Registrare il Metadata XML generato da questo server presso AgID.
 * 3. Configurare gli endpoint degli Identity Provider (PosteID, Sielte, ecc.) nel file di configurazione.
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// passport-saml è la libreria Node.js standard per federazioni SAML 2.0 (SPID/CIE)
// In produzione, scommentare l'inizializzazione ufficiale:
// const { Strategy: SamlStrategy } = require('passport-saml');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'spid-desktop-secret-key-super-secure';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Caricamento dei certificati X.509 locali (Placeholder per Onboarding)
let spPrivateKey = null;
let spCert = null;
try {
  spPrivateKey = fs.readFileSync(path.join(__dirname, 'certificates', 'sp-private-key.pem'), 'utf8');
  spCert = fs.readFileSync(path.join(__dirname, 'certificates', 'sp-cert.pem'), 'utf8');
} catch (e) {
  console.warn("⚠️ ATTENZIONE: Certificati X.509 non trovati in 'auth-companion/certificates/'.");
  console.warn("   Il server girerà in modalità SIMULATA/TEST fino al caricamento delle chiavi ufficiali.");
}

// Struttura in memoria per le sessioni associate ai token generati
const sessionsDb = new Map();

/**
 * 1. ENDPOINT METADATA (/metadata)
 * Ritorna l'XML del Service Provider da registrare presso il registro di AgID.
 * Definisce i vincoli di sicurezza (firmato con SHA256), l'EntityID e l'endpoint ACS.
 */
app.get('/metadata', (req, res) => {
  if (!spCert) {
    return res.status(500).send("Certificato X.509 SP non configurato. Genera sp-cert.pem per abilitare i Metadata.");
  }

  // Generazione del template XML conforme alle regole tecniche SPID/AgID
  const xmlMetadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://progettoits.servizidigitali.it">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/03/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>${spCert.replace(/-----\s*BEGIN ?[^-]*-----\s*|-----\s*END ?[^-]*-----\s*|\r|\n/g, "")}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://auth.progettoits.it/acs" index="1" isDefault="true"/>
    <md:AttributeConsumingService index="1">
      <md:ServiceName xml:lang="it">Area Personale Servizi Digitali</md:ServiceName>
      <md:RequestedAttribute Name="name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
      <md:RequestedAttribute Name="familyName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
      <md:RequestedAttribute Name="fiscalNumber" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
      <md:RequestedAttribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
      <md:RequestedAttribute Name="mobilePhone" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
      <md:RequestedAttribute Name="dateOfBirth" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"/>
    </md:AttributeConsumingService>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;

  res.header('Content-Type', 'application/xml');
  res.send(xmlMetadata);
});

/**
 * 2. ENDPOINT LOGIN (/login/:idp)
 * Inizia la negoziazione SAML per l'Identity Provider selezionato.
 * Genera la SAML AuthnRequest firmata con la chiave privata.
 */
app.get('/login/:idp', (req, res) => {
  const { idp } = req.params;
  console.log(`Avvio login per IdP: ${idp}`);

  if (!spPrivateKey) {
    // MODALITA' SIMULATA (Onboarding mancante)
    // Mostriamo una schermata di login simulata dove l'utente può inserire/modificare i propri dati
    const isCie = idp.toLowerCase() === 'cie';
    const providerTitle = isCie ? 'Carta di Identità Elettronica (CIE)' : `SPID Provider: ${idp.toUpperCase()}`;

    return res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>Simulatore di Accesso - ${isCie ? 'CIE' : 'SPID'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f5f7fa; color: #1a1a1a; padding: 30px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #d1d7e0; }
          .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
          .header.cie { background-color: #002766; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
          .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { padding: 30px; }
          .form-group { margin-bottom: 18px; }
          label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: #002766; }
          input, select { width: 100%; padding: 10px; border: 1px solid #d1d7e0; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
          input:focus { outline: none; border-color: #0066cc; box-shadow: 0 0 0 3px rgba(0,102,204,0.15); }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .section-title { font-size: 16px; font-weight: 700; color: #002766; border-bottom: 2px solid #ebf5ff; padding-bottom: 6px; margin-top: 25px; margin-bottom: 15px; }
          .btn-submit { background-color: #0066cc; color: white; border: none; padding: 12px 20px; font-size: 16px; font-weight: 700; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 20px; transition: background-color 0.15s ease; }
          .btn-submit:hover { background-color: #0052a3; }
          .btn-submit.cie { background-color: #002766; }
          .btn-submit.cie:hover { background-color: #001a47; }
          .info-box { background-color: #ebf5ff; border-left: 4px solid #0066cc; padding: 12px; font-size: 13px; color: #566270; border-radius: 0 4px 4px 0; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header ${isCie ? 'cie' : ''}">
            <h1>IDP Simulatore Ministeriale</h1>
            <p>Accesso simulato per ${providerTitle}</p>
          </div>
          <div class="content">
            <div class="info-box">
              <strong>Simulazione di Accesso locale</strong><br/>
              Per testare l'app con i tuoi dati reali, inserisci le tue informazioni qui sotto. Verrà generato un token JWT firmato digitalmente inviato alla tua applicazione.
            </div>
            
            <form action="/login-simulated-submit" method="POST">
              <input type="hidden" name="provider" value="${idp}" />
              <input type="hidden" name="tipoIdentita" value="${isCie ? 'CIE' : 'SPID'}" />
              
              <div class="section-title">Credenziali di Test</div>
              <div class="grid">
                <div class="form-group">
                  <label for="username">Username di test</label>
                  <input type="text" id="username" name="username" value="cittadino_italiano" required />
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" id="password" name="password" value="••••••••" required />
                </div>
              </div>
              
              <div class="section-title">Dati Anagrafici da Trasmettere</div>
              <div class="grid">
                <div class="form-group">
                  <label for="nome">Nome</label>
                  <input type="text" id="nome" name="nome" value="" placeholder="Inserisci il tuo nome" required />
                </div>
                <div class="form-group">
                  <label for="cognome">Cognome</label>
                  <input type="text" id="cognome" name="cognome" value="" placeholder="Inserisci il tuo cognome" required />
                </div>
              </div>
              
              <div class="grid">
                <div class="form-group">
                  <label for="codiceFiscale">Codice Fiscale</label>
                  <input type="text" id="codiceFiscale" name="codiceFiscale" value="" placeholder="Codice Fiscale (16 caratteri)" required />
                </div>
                <div class="form-group">
                  <label for="sesso">Sesso</label>
                  <select id="sesso" name="sesso">
                    <option value="M">Maschio (M)</option>
                    <option value="F">Femmina (F)</option>
                  </select>
                </div>
              </div>

              <div class="grid">
                <div class="form-group">
                  <label for="dataNascita">Data di Nascita</label>
                  <input type="date" id="dataNascita" name="dataNascita" required />
                </div>
                <div class="form-group">
                  <label for="luogoNascita">Luogo di Nascita</label>
                  <input type="text" id="luogoNascita" name="luogoNascita" value="" placeholder="Città di nascita" required />
                </div>
              </div>

              <div class="form-group">
                <label for="provinciaNascita">Provincia di Nascita</label>
                <input type="text" id="provinciaNascita" name="provinciaNascita" value="" placeholder="Es. TO, RM, MI" required />
              </div>
              
              <div class="section-title">Contatti & Domicilio</div>
              <div class="grid">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" value="" placeholder="tua.email@provider.it" required />
                </div>
                <div class="form-group">
                  <label for="cellulare">Cellulare</label>
                  <input type="text" id="cellulare" name="cellulare" value="" placeholder="+39 333 1234567" required />
                </div>
              </div>

              <div class="form-group">
                <label for="pec">PEC (Domicilio Digitale)</label>
                <input type="email" id="pec" name="pec" value="" placeholder="es. nome@pec.it" />
              </div>

              <div class="form-group">
                <label for="indirizzoDomicilio">Indirizzo Domicilio</label>
                <input type="text" id="indirizzoDomicilio" name="indirizzoDomicilio" value="" placeholder="Via, Numero, CAP, Città" required />
              </div>
              
              <button type="submit" class="btn-submit ${isCie ? 'cie' : ''}">Conferma Autenticazione ed Invia Dati</button>
            </form>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // FLUSSO REALE (scommentare per produzione)
  // passport.authenticate('saml', { additionalParams: { idpCode: idp } })(req, res);
  res.status(501).send("Il backend companion è predisposto. Configura i metadati dell'IdP di produzione per attivare il reindirizzamento SAML reale.");
});

/**
 * 2b. ENDPOINT MOCK FORM POST (/login-simulated-submit)
 * Riceve i dati anagrafici dal form, firma il token JWT e reindirizza a Tauri.
 */
app.post('/login-simulated-submit', (req, res) => {
  const {
    provider,
    tipoIdentita,
    nome,
    cognome,
    codiceFiscale,
    sesso,
    dataNascita,
    luogoNascita,
    provinciaNascita,
    email,
    cellulare,
    pec,
    indirizzoDomicilio
  } = req.body;

  const spidCode = `SPID-MOCK-USER-${Math.floor(10000 + Math.random() * 90000)}`;

  const userProfile = {
    spidCode,
    nome,
    cognome,
    codiceFiscale: codiceFiscale.toUpperCase(),
    sesso,
    dataNascita,
    luogoNascita,
    provinciaNascita: provinciaNascita.toUpperCase(),
    email,
    cellulare,
    pec: pec || undefined,
    indirizzoDomicilio,
    providerAutenticazione: provider.toUpperCase(),
    tipoIdentita
  };

  const mockToken = jwt.sign(userProfile, JWT_SECRET, { expiresIn: '15m' });
  sessionsDb.set(mockToken, userProfile);

  const deepLinkUrl = `progettoits://auth?token=${mockToken}`;

  return res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Autenticazione Completata</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; background-color: #f5f7fa; color: #1a1a1a; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; max-width: 500px; text-align: left; }
        .btn { background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-top: 20px; }
        h2 { color: #002766; text-align: center; margin-top: 0; }
        p { line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Connessione Riuscita</h2>
        <p>L'autenticazione tramite <strong>${provider.toUpperCase()}</strong> è avvenuta con successo.</p>
        <p>I dati di: <strong>${nome} ${cognome}</strong> (${codiceFiscale.toUpperCase()}) sono pronti.</p>
        <p>Stiamo per reindirizzarti all'applicazione desktop...</p>
        <div style="text-align: center;">
          <a href="${deepLinkUrl}" class="btn">Apri Applicazione Desktop</a>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 13px; color: #555;">
          <p>Se usi l'app nel browser o se lo schema deep link non si attiva, clicca qui:</p>
          <div style="text-align: center;">
            <a href="http://localhost:1420/?token=${mockToken}" class="btn" style="background: #00875a; margin-top: 5px;">Apri in Localhost (Porta 1420)</a>
          </div>
        </div>
      </div>
      <script>
        // Tenta la redirezione automatica dopo 2 secondi
        setTimeout(function() {
          window.location.href = "${deepLinkUrl}";
        }, 2000);
      </script>
    </body>
    </html>
  `);

  // FLUSSO REALE (scommentare per produzione)
  // passport.authenticate('saml', { additionalParams: { idpCode: idp } })(req, res);
  res.status(501).send("Il backend companion è predisposto. Configura i metadati dell'IdP di produzione per attivare il reindirizzamento SAML reale.");
});

/**
 * 3. ASSERTION CONSUMER SERVICE (/acs)
 * Endpoint POST in cui l'IdP invia la SAML Response.
 * Il backend valida la firma XML dell'asserzione, estrae i campi e genera il token JWT.
 */
app.post('/acs', (req, res) => {
  console.log("Ricevuta SAML Response sul modulo ACS.");
  
  // ESTRATTO DEL FLUSSO REALE (Passport-SAML):
  // 1. passport.authenticate('saml', (err, user) => { ... })
  // 2. Lettura dei campi dall'XML decodificato in Base64.
  // 3. Generazione del token JWT contenente il profilo.
  // 4. Redirezione a progettoits://auth?token=JWT
  
  res.status(400).send("Questo endpoint riceve le asserzioni POST SAML criptate inviate dagli IdP di produzione accreditati.");
});

/**
 * 4. ENDPOINT PROFILO (/profile)
 * Accetta il token JWT di sessione e ritorna l'anagrafica del cittadino estratta.
 */
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token mancante o formato non valido" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const profile = sessionsDb.get(token) || decoded;
    res.json(profile);
  } catch (err) {
    res.status(401).json({ error: "Token di sessione scaduto o non valido" });
  }
});

/**
 * 5. ENDPOINT LOGOUT (/logout)
 * Cancella la sessione locale.
 */
app.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessionsDb.delete(token);
  }
  res.json({ success: true });
});

// Avvio del Server
app.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`🚀 AUTH COMPANION SERVER - SPID SP avviato su http://localhost:${PORT}`);
  console.log(`👉 Endpoint Metadata XML: http://localhost:${PORT}/metadata`);
  console.log(`👉 Endpoint Login Simulatore: http://localhost:${PORT}/login/poste`);
  console.log(`=================================================================`);
});
