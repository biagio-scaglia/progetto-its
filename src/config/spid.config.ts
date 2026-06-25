// Configurazione a runtime delle variabili d'ambiente per SPID / CIE.
// Utilizza import.meta.env (sistema Vite standard) con fallback di sviluppo.

export const SPID_CONFIG = {
  // URL del Companion Backend / Auth Bridge
  companionBackendUrl: import.meta.env.VITE_SPID_COMPANION_BACKEND_URL || "http://localhost:3000",
  
  // EntityID registrato presso AgID
  entityId: import.meta.env.VITE_SPID_ENTITY_ID || "https://progettoits.servizidigitali.it",
  
  // Ambiente SPID attivo (test | validator | production)
  environment: (import.meta.env.VITE_SPID_ENVIRONMENT || "test") as "test" | "validator" | "production",
  
  // URL dei Metadata SAML 2.0
  metadataUrl: import.meta.env.VITE_SPID_METADATA_URL || "http://localhost:3000/metadata",
  
  // Assertion Consumer Service (ACS) per la ricezione delle asserzioni
  acsUrl: import.meta.env.VITE_SPID_ACS_URL || "http://localhost:3000/acs",
  
  // Deep Link URI Schema registrato in Tauri
  deepLinkScheme: import.meta.env.VITE_SPID_DEEP_LINK_SCHEME || "progettoits://auth",
  
  // Lista dei certificati X.509 richiesti da AgID (Mock localizzativo per configurazione)
  certificates: {
    spPrivatePath: "certificates/sp-private-key.pem",
    spPublicPath: "certificates/sp-cert.pem",
    agidPublicRegistryPath: "certificates/agid-metadata-signing.pem"
  }
};
