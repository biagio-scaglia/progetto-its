export interface GeolocationData {
  statoPermesso: 'concesso' | 'negato' | 'richiesto' | 'ignoto';
  coordinate: { lat: number; lon: number; timestamp: number } | null;
  closestCity: { nome: string; provincia: string; distanzaKm: number } | null;
}

const STORAGE_KEY = "servizidigitali_posizione";

/**
 * Gestisce la persistenza locale dello stato dei permessi e dei dati geografici rilevati.
 */
export class GeolocationRepository {
  /**
   * Recupera i dati geografici e lo stato dei permessi memorizzati localmente.
   */
  static getGeodata(): GeolocationData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return {
          statoPermesso: 'ignoto',
          coordinate: null,
          closestCity: null
        };
      }
      return JSON.parse(data) as GeolocationData;
    } catch (error) {
      console.error("Errore durante il caricamento della geolocalizzazione locale:", error);
      return {
        statoPermesso: 'ignoto',
        coordinate: null,
        closestCity: null
      };
    }
  }

  /**
   * Scrive i dati di geolocalizzazione e lo stato dei permessi nel database locale.
   */
  static saveGeodata(geodata: GeolocationData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(geodata));
    } catch (error) {
      console.error("Errore durante il salvataggio dei dati di geolocalizzazione:", error);
    }
  }

  /**
   * Purgamento dei dati geografici locali (reset o revoca consenso).
   */
  static clearGeodata(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Errore durante il reset della geolocalizzazione locale:", error);
    }
  }
}
