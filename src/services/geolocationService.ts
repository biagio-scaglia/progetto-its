/**
 * Database offline delle coordinate geografiche dei 110 capoluoghi di provincia italiani.
 * Consente di determinare la vicinanza territoriale senza interrogare API esterne di geocoding su cloud.
 */
export const CITIES_DB = [
  // Piemonte
  { nome: "Torino", lat: 45.0703, lon: 7.6869, provincia: "TO" },
  { nome: "Alessandria", lat: 44.9129, lon: 8.6154, provincia: "AL" },
  { nome: "Asti", lat: 44.9012, lon: 8.2068, provincia: "AT" },
  { nome: "Biella", lat: 45.5630, lon: 8.0579, provincia: "BI" },
  { nome: "Cuneo", lat: 44.3896, lon: 7.5479, provincia: "CN" },
  { nome: "Novara", lat: 45.4468, lon: 8.6212, provincia: "NO" },
  { nome: "Verbania", lat: 45.9220, lon: 8.5513, provincia: "VB" },
  { nome: "Vercelli", lat: 45.3245, lon: 8.4190, provincia: "VC" },
  // Valle d'Aosta
  { nome: "Aosta", lat: 45.7373, lon: 7.3206, provincia: "AO" },
  // Lombardia
  { nome: "Milano", lat: 45.4642, lon: 9.1900, provincia: "MI" },
  { nome: "Bergamo", lat: 45.6983, lon: 9.6773, provincia: "BG" },
  { nome: "Brescia", lat: 45.5416, lon: 10.2118, provincia: "BS" },
  { nome: "Como", lat: 45.8081, lon: 9.0852, provincia: "CO" },
  { nome: "Cremona", lat: 45.1333, lon: 10.0333, provincia: "CR" },
  { nome: "Lecco", lat: 45.8558, lon: 9.3976, provincia: "LC" },
  { nome: "Lodi", lat: 45.3139, lon: 9.5032, provincia: "LO" },
  { nome: "Mantova", lat: 45.1564, lon: 10.7914, provincia: "MN" },
  { nome: "Monza", lat: 45.5845, lon: 9.2735, provincia: "MB" },
  { nome: "Pavia", lat: 45.1850, lon: 9.1557, provincia: "PV" },
  { nome: "Sondrio", lat: 46.1690, lon: 9.8700, provincia: "SO" },
  { nome: "Varese", lat: 45.8197, lon: 8.8250, provincia: "VA" },
  // Trentino-Alto Adige
  { nome: "Bolzano", lat: 46.4908, lon: 11.3398, provincia: "BZ" },
  { nome: "Trento", lat: 46.0679, lon: 11.1211, provincia: "TN" },
  // Veneto
  { nome: "Venezia", lat: 45.4408, lon: 12.3155, provincia: "VE" },
  { nome: "Belluno", lat: 46.1412, lon: 12.2162, provincia: "BL" },
  { nome: "Padova", lat: 45.4064, lon: 11.8768, provincia: "PD" },
  { nome: "Rovigo", lat: 45.0701, lon: 11.7904, provincia: "RO" },
  { nome: "Treviso", lat: 45.6669, lon: 12.2431, provincia: "TV" },
  { nome: "Verona", lat: 45.4384, lon: 10.9916, provincia: "VR" },
  { nome: "Vicenza", lat: 45.5479, lon: 11.5497, provincia: "VI" },
  // Friuli-Venezia Giulia
  { nome: "Trieste", lat: 45.6495, lon: 13.7768, provincia: "TS" },
  { nome: "Gorizia", lat: 45.9409, lon: 13.6217, provincia: "GO" },
  { nome: "Pordenone", lat: 45.9566, lon: 12.6605, provincia: "PN" },
  { nome: "Udine", lat: 46.0711, lon: 13.2346, provincia: "UD" },
  // Liguria
  { nome: "Genova", lat: 44.4056, lon: 8.9463, provincia: "GE" },
  { nome: "Imperia", lat: 43.8860, lon: 8.0289, provincia: "IM" },
  { nome: "La Spezia", lat: 44.1107, lon: 9.8434, provincia: "SP" },
  { nome: "Savona", lat: 44.3080, lon: 8.4810, provincia: "SV" },
  // Emilia-Romagna
  { nome: "Bologna", lat: 44.4949, lon: 11.3426, provincia: "BO" },
  { nome: "Ferrara", lat: 44.8381, lon: 11.6198, provincia: "FE" },
  { nome: "Forlì", lat: 44.2227, lon: 12.0409, provincia: "FC" },
  { nome: "Cesena", lat: 44.1394, lon: 12.2431, provincia: "FC" },
  { nome: "Modena", lat: 44.6471, lon: 10.9252, provincia: "MO" },
  { nome: "Parma", lat: 44.8015, lon: 10.3279, provincia: "PR" },
  { nome: "Piacenza", lat: 45.0526, lon: 9.6930, provincia: "PC" },
  { nome: "Ravenna", lat: 44.4184, lon: 12.2035, provincia: "RA" },
  { nome: "Reggio Emilia", lat: 44.6982, lon: 10.6312, provincia: "RE" },
  { nome: "Rimini", lat: 44.0594, lon: 12.5684, provincia: "RN" },
  // Toscana
  { nome: "Firenze", lat: 43.7696, lon: 11.2558, provincia: "FI" },
  { nome: "Arezzo", lat: 43.4631, lon: 11.8781, provincia: "AR" },
  { nome: "Grosseto", lat: 42.7603, lon: 11.1119, provincia: "GR" },
  { nome: "Livorno", lat: 43.5485, lon: 10.3106, provincia: "LI" },
  { nome: "Lucca", lat: 43.8429, lon: 10.5027, provincia: "LU" },
  { nome: "Massa", lat: 44.0366, lon: 10.1414, provincia: "MS" },
  { nome: "Pisa", lat: 43.7085, lon: 10.4036, provincia: "PI" },
  { nome: "Pistoia", lat: 43.9317, lon: 10.9178, provincia: "PT" },
  { nome: "Prato", lat: 43.8777, lon: 11.1022, provincia: "PO" },
  { nome: "Siena", lat: 43.3188, lon: 11.3308, provincia: "SI" },
  // Umbria
  { nome: "Perugia", lat: 43.1107, lon: 12.3908, provincia: "PG" },
  { nome: "Terni", lat: 42.5641, lon: 12.6414, provincia: "TR" },
  // Marche
  { nome: "Ancona", lat: 43.6158, lon: 13.5189, provincia: "AN" },
  { nome: "Ascoli Piceno", lat: 42.8540, lon: 13.5753, provincia: "AP" },
  { nome: "Fermo", lat: 43.1614, lon: 13.7183, provincia: "FM" },
  { nome: "Macerata", lat: 43.3005, lon: 13.4533, provincia: "MC" },
  { nome: "Pesaro", lat: 43.9103, lon: 12.9135, provincia: "PU" },
  { nome: "Urbino", lat: 43.7263, lon: 12.6365, provincia: "PU" },
  // Lazio
  { nome: "Roma", lat: 41.9028, lon: 12.4964, provincia: "RM" },
  { nome: "Frosinone", lat: 41.6394, lon: 13.3411, provincia: "FR" },
  { nome: "Latina", lat: 41.4676, lon: 12.9036, provincia: "LT" },
  { nome: "Rieti", lat: 42.4047, lon: 12.8624, provincia: "RI" },
  { nome: "Viterbo", lat: 42.4174, lon: 12.1047, provincia: "VT" },
  // Abruzzo
  { nome: "L'Aquila", lat: 42.3498, lon: 13.3995, provincia: "AQ" },
  { nome: "Chieti", lat: 42.3510, lon: 14.1675, provincia: "CH" },
  { nome: "Pescara", lat: 42.4618, lon: 14.2185, provincia: "PE" },
  { nome: "Teramo", lat: 42.6588, lon: 13.7044, provincia: "TE" },
  // Molise
  { nome: "Campobasso", lat: 41.5604, lon: 14.6684, provincia: "CB" },
  { nome: "Isernia", lat: 41.5966, lon: 14.2341, provincia: "IS" },
  // Campania
  { nome: "Napoli", lat: 40.8518, lon: 14.2681, provincia: "NA" },
  { nome: "Avellino", lat: 40.9140, lon: 14.7903, provincia: "AV" },
  { nome: "Benevento", lat: 41.1306, lon: 14.7780, provincia: "BN" },
  { nome: "Caserta", lat: 41.0747, lon: 14.3347, provincia: "CE" },
  { nome: "Salerno", lat: 40.6785, lon: 14.7650, provincia: "SA" },
  // Puglia
  { nome: "Bari", lat: 41.1171, lon: 16.8719, provincia: "BA" },
  { nome: "Barletta", lat: 41.3184, lon: 16.2806, provincia: "BT" },
  { nome: "Andria", lat: 41.2294, lon: 16.2974, provincia: "BT" },
  { nome: "Trani", lat: 41.2725, lon: 16.4150, provincia: "BT" },
  { nome: "Brindisi", lat: 40.6384, lon: 17.9458, provincia: "BR" },
  { nome: "Foggia", lat: 41.4622, lon: 15.5447, provincia: "FG" },
  { nome: "Lecce", lat: 40.3533, lon: 18.1741, provincia: "LE" },
  { nome: "Taranto", lat: 40.4644, lon: 17.2470, provincia: "TA" },
  // Basilicata
  { nome: "Potenza", lat: 40.6398, lon: 15.8051, provincia: "PZ" },
  { nome: "Matera", lat: 40.6664, lon: 16.6043, provincia: "MT" },
  // Calabria
  { nome: "Catanzaro", lat: 38.9054, lon: 16.5948, provincia: "CZ" },
  { nome: "Cosenza", lat: 39.2983, lon: 16.2537, provincia: "CS" },
  { nome: "Crotone", lat: 39.0808, lon: 17.1275, provincia: "KR" },
  { nome: "Reggio Calabria", lat: 38.1113, lon: 15.6473, provincia: "RC" },
  { nome: "Vibo Valentia", lat: 38.6756, lon: 16.1017, provincia: "VV" },
  // Sicilia
  { nome: "Palermo", lat: 38.1157, lon: 13.3615, provincia: "PA" },
  { nome: "Agrigento", lat: 37.3106, lon: 13.5756, provincia: "AG" },
  { nome: "Caltanissetta", lat: 37.4901, lon: 14.0622, provincia: "CL" },
  { nome: "Catania", lat: 37.5079, lon: 15.0830, provincia: "CT" },
  { nome: "Enna", lat: 37.5670, lon: 14.2785, provincia: "EN" },
  { nome: "Messina", lat: 38.1938, lon: 15.5540, provincia: "ME" },
  { nome: "Ragusa", lat: 36.9282, lon: 14.7172, provincia: "RG" },
  { nome: "Siracusa", lat: 37.0755, lon: 15.2866, provincia: "SR" },
  { nome: "Trapani", lat: 38.0177, lon: 12.5150, provincia: "TP" },
  // Sardegna
  { nome: "Cagliari", lat: 39.2238, lon: 9.1217, provincia: "CA" },
  { nome: "Sassari", lat: 40.7259, lon: 8.5556, provincia: "SS" },
  { nome: "Nuoro", lat: 40.3195, lon: 9.3271, provincia: "NU" },
  { nome: "Oristano", lat: 39.9059, lon: 8.5916, provincia: "OR" },
  { nome: "Carbonia", lat: 39.1670, lon: 8.5222, provincia: "SU" },
  { nome: "Iglesias", lat: 39.3102, lon: 8.5372, provincia: "SU" },
  { nome: "Lanusei", lat: 39.8789, lon: 9.5422, provincia: "NU" },
  { nome: "Tortolì", lat: 39.9261, lon: 9.6586, provincia: "NU" },
  { nome: "Olbia", lat: 40.9230, lon: 9.4975, provincia: "SS" },
  { nome: "Tempio Pausania", lat: 40.8986, lon: 9.1171, provincia: "SS" },
  { nome: "Sanluri", lat: 39.5615, lon: 8.8996, provincia: "SU" },
  { nome: "Villacidro", lat: 39.4566, lon: 8.7303, provincia: "SU" }
];

/**
 * Formula trigonometrica di Haversine per calcolare la distanza ortodromica 
 * tra due coordinate terrestri in chilometri.
 */
function calcolaDistanzaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0; // Raggio medio terrestre in chilometri
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Servizio per la gestione a basso livello della geolocalizzazione tramite browser API.
 */
export class GeolocationService {
  /**
   * Verifica se la funzionalità di geolocalizzazione è supportata dal dispositivo.
   */
  static isSupported(): boolean {
    return typeof window !== "undefined" && "geolocation" in navigator;
  }

  /**
   * Ottiene la posizione corrente del dispositivo.
   */
  static getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error("La geolocalizzazione non e' supportata dal dispositivo corrente."));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false, // Bassa precisione per risparmio batteria e finalità di macro-orientamento
        timeout: 12000,            // Timeout massimo di 12 secondi
        maximumAge: 180000,        // Accetta posizioni cacheate fino a 3 minuti fa
        ...options
      });
    });
  }

  /**
   * Identifica il capoluogo di provincia italiano geograficamente più vicino alle coordinate fornite.
   */
  static trovaCapoluogoPiuVicino(lat: number, lon: number) {
    if (CITIES_DB.length === 0) {
      throw new Error("Il database delle città non e' caricato.");
    }

    let piuVicino = CITIES_DB[0];
    let minDistanza = calcolaDistanzaHaversine(lat, lon, piuVicino.lat, piuVicino.lon);

    for (let i = 1; i < CITIES_DB.length; i++) {
      const city = CITIES_DB[i];
      const dist = calcolaDistanzaHaversine(lat, lon, city.lat, city.lon);
      if (dist < minDistanza) {
        minDistanza = dist;
        piuVicino = city;
      }
    }

    return {
      nome: piuVicino.nome,
      provincia: piuVicino.provincia,
      distanzaKm: Math.round(minDistanza * 10) / 10 // Arrotondamento a 1 cifra decimale
    };
  }
}
