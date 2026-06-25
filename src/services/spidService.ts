import { SPID_CONFIG } from "../config/spid.config";
import { ProfiloCittadino } from "../types";
import { openUrl } from "@tauri-apps/plugin-opener";

export interface IdentityProvider {
  code: string;
  name: string;
  logoText: string;
  color: string;
}

export const SPID_IDPS: IdentityProvider[] = [
  { code: "poste", name: "PosteID", logoText: "Poste", color: "#ffcc00" },
  { code: "sielte", name: "SielteID", logoText: "Sielte", color: "#0066cc" },
  { code: "aruba", name: "Aruba ID", logoText: "Aruba", color: "#cc0000" },
  { code: "infocert", name: "InfoCert ID", logoText: "InfoCert", color: "#00b3b3" },
  { code: "lepida", name: "Lepida ID", logoText: "Lepida", color: "#800080" },
  { code: "namirial", name: "Namirial ID", logoText: "Namirial", color: "#ff6600" },
  { code: "spiditalia", name: "SpidItalia", logoText: "SpidIt", color: "#003366" },
  { code: "tim", name: "Tim ID", logoText: "TIM", color: "#0000ff" },
  { code: "aruba-cie", name: "Carta di Identità Elettronica (CIE)", logoText: "CIE", color: "#4caf50" }
];

export class SpidService {
  /**
   * Restituisce gli Identity Provider ufficiali accreditati da AgID.
   */
  static getIdps(): IdentityProvider[] {
    return SPID_IDPS.filter(idp => idp.code !== "aruba-cie"); // CIE ha un pulsante e un flusso separato (linee guida AgID)
  }

  /**
   * Avvia il flusso di login SPID aprendo il browser esterno sul Companion Server.
   * Il Companion Server si comporta come Service Provider SAML 2.0 reale:
   * 1. Genera la SAML AuthnRequest firmata con la chiave privata dell'applicazione.
   * 2. Reindirizza l'utente al server dell'IdP selezionato.
   */
  static async startSpidLogin(idpCode: string): Promise<void> {
    const url = `${SPID_CONFIG.companionBackendUrl}/login/${idpCode}`;
    try {
      // Usa l'opener nativo di Tauri v2 per avviare il browser di sistema sicuro
      await openUrl(url);
    } catch (err) {
      console.error("Impossibile aprire il browser per il login SPID:", err);
      // Fallback per test in ambiente web standard
      window.open(url, "_blank");
    }
  }

  /**
   * Recupera gli attributi anagrafici del cittadino scambiando il token di sessione
   * ricevuto al rientro dell'autenticazione.
   */
  static async getCittadinoProfile(token: string): Promise<ProfiloCittadino> {
    const response = await fetch(`${SPID_CONFIG.companionBackendUrl}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Errore recupero profilo: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Avvia il Single Logout (SLO) inviando la richiesta di terminazione sessione SAML.
   */
  static async logout(token: string): Promise<void> {
    try {
      await fetch(`${SPID_CONFIG.companionBackendUrl}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Errore durante SLO sul Companion Backend:", err);
    }
  }
}
