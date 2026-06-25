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
  console.log(`Avvio login SPID per IdP: ${idp}`);

  if (!spPrivateKey) {
    // MODALITA' SIMULATA (Onboarding mancante)
    // Mostriamo una schermata di caricamento che reindirizza a Tauri con un token simulato
    console.log("Esecuzione flusso simulato (mancano chiavi private)");
    const mockToken = jwt.sign({
      sub: "SPID-MOCK-USER-12345",
      nome: "Biagio",
      cognome: "Scaglia",
      codiceFiscale: "SCGBLG95A12L219Y",
      email: "biagio.scaglia@email.it",
      cellulare: "+39 333 1234567",
      dataNascita: "1995-01-12",
      luogoNascita: "Torino",
      tipoIdentita: "SPID",
      providerAutenticazione: idp.toUpperCase()
    }, JWT_SECRET, { expiresIn: '15m' });

    sessionsDb.set(mockToken, {
      spidCode: "SPID-MOCK-USER-12345",
      nome: "Biagio",
      cognome: "Scaglia",
      codiceFiscale: "SCGBLG95A12L219Y",
      email: "biagio.scaglia@email.it",
      cellulare: "+39 333 1234567",
      dataNascita: "1995-01-12",
      luogoNascita: "Torino",
      tipoIdentita: "SPID",
      providerAutenticazione: idp.toUpperCase()
    });

    // Reindirizzamento verso lo schema custom dell'applicazione desktop
    const deepLinkUrl = `progettoits://auth?token=${mockToken}`;
    
    // Pagina HTML intermedia per mostrare all'utente che l'autenticazione è andata a buon fine
    return res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>Autenticazione Completata</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f5f7fa; color: #1a1a1a; }
          .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; max-width: 500px; }
          .btn { background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-top: 20px; }
          h2 { color: #002766; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Connessione SPID Riuscita</h2>
          <p>L'autenticazione tramite <strong>${idp.toUpperCase()}</strong> è avvenuta con successo in ambiente di test locale.</p>
          <p>Stiamo per reindirizzarti all'applicazione desktop...</p>
          <a href="${deepLinkUrl}" class="btn">Apri Applicazione Desktop</a>
          
          <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 13px; color: #555;">
            <p>Se usi l'app nel browser o se lo schema deep link non si attiva, clicca qui:</p>
            <a href="http://localhost:1420/?token=${mockToken}" class="btn" style="background: #00875a; margin-top: 5px;">Apri in Localhost (Porta 1420)</a>
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
  }

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
