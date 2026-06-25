import { useState, useCallback } from "react";
import { 
  ProfiloUtente, 
  Percorso, 
  Documento, 
  Scadenza, 
  Messaggio, 
  PrioritaScadenza 
} from "../types";
import { ProfileRepository } from "../repositories/profileRepository";
import { PercorsiRepository } from "../repositories/percorsiRepository";
import { DocumentiRepository } from "../repositories/documentiRepository";
import { ScadenzeRepository } from "../repositories/scadenzeRepository";
import { ChatRepository } from "../repositories/chatRepository";
import { GeolocationRepository, GeolocationData } from "../repositories/geolocationRepository";
import { GeolocationService } from "../services/geolocationService";
import { SERVIZI_MOCK } from "../mockData";

/**
 * Hook custom per la gestione dello stato globale dell'applicazione.
 * Separa la logica di business dai componenti di interfaccia (UI).
 */
export function useAppState() {
  // Stato del profilo utente
  const [profilo, setProfilo] = useState<ProfiloUtente | null>(() => 
    ProfileRepository.getProfile()
  );

  // Stato dei percorsi guidati
  const [percorsi, setPercorsi] = useState<Percorso[]>(() => 
    PercorsiRepository.getPercorsi()
  );

  // Stato dei documenti locali
  const [documenti, setDocumenti] = useState<Documento[]>(() => 
    DocumentiRepository.getDocumenti()
  );

  // Stato delle scadenze
  const [scadenze, setScadenze] = useState<Scadenza[]>(() => 
    ScadenzeRepository.getScadenze()
  );

  // Stato dei messaggi dell'assistente virtuale
  const [messaggi, setMessaggi] = useState<Messaggio[]>(() => 
    ChatRepository.getMessaggi()
  );

  // Stato della geolocalizzazione reale
  const [geodata, setGeodata] = useState<GeolocationData>(() =>
    GeolocationRepository.getGeodata()
  );
  const [loadingGeoloc, setLoadingGeoloc] = useState<boolean>(false);
  const [geolocError, setGeolocError] = useState<string | null>(null);

  // Aggiorna il profilo utente
  const updateProfile = useCallback((nuovoProfilo: ProfiloUtente) => {
    ProfileRepository.saveProfile(nuovoProfilo);
    setProfilo(nuovoProfilo);
  }, []);

  // Richiede l'accesso GPS reale e aggiorna coordinate e comune più vicino
  const richiediGeolocalizzazione = useCallback(async () => {
    setLoadingGeoloc(true);
    setGeolocError(null);
    try {
      const position = await GeolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const closest = GeolocationService.trovaCapoluogoPiuVicino(latitude, longitude);
      
      const newGeodata: GeolocationData = {
        statoPermesso: 'concesso',
        coordinate: {
          lat: latitude,
          lon: longitude,
          timestamp: position.timestamp
        },
        closestCity: closest
      };
      
      GeolocationRepository.saveGeodata(newGeodata);
      setGeodata(newGeodata);
      
      // Sincronizza il consensoGeolocalizzazione a true nel profilo
      if (profilo) {
        const nuovoProfilo = { ...profilo, consensoGeolocalizzazione: true };
        ProfileRepository.saveProfile(nuovoProfilo);
        setProfilo(nuovoProfilo);
      }
    } catch (err: any) {
      let errMsg = "Errore durante il rilevamento della posizione.";
      let permessoStato: 'negato' | 'ignoto' = 'ignoto';
      
      // Mappatura codici errore Geolocation API standard
      if (err.code === 1) { // PERMISSION_DENIED
        errMsg = "Permesso negato dall'utente o dal sistema operativo.";
        permessoStato = 'negato';
      } else if (err.code === 2) { // POSITION_UNAVAILABLE
        errMsg = "Informazioni di localizzazione non disponibili sul dispositivo.";
      } else if (err.code === 3) { // TIMEOUT
        errMsg = "Tempo massimo per il rilevamento della posizione esaurito.";
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setGeolocError(errMsg);
      
      const newGeodata: GeolocationData = {
        statoPermesso: permessoStato,
        coordinate: null,
        closestCity: null
      };
      GeolocationRepository.saveGeodata(newGeodata);
      setGeodata(newGeodata);
      
      // Rilasciamo il consenso nel profilo se c'è stato un rifiuto
      if (profilo && profilo.consensoGeolocalizzazione) {
        const nuovoProfilo = { ...profilo, consensoGeolocalizzazione: false };
        ProfileRepository.saveProfile(nuovoProfilo);
        setProfilo(nuovoProfilo);
      }
    } finally {
      setLoadingGeoloc(false);
    }
  }, [profilo]);

  // Revoca il consenso ed elimina tutti i dati geografici reali salvati
  const revocaGeolocalizzazione = useCallback(() => {
    GeolocationRepository.clearGeodata();
    setGeodata({
      statoPermesso: 'negato',
      coordinate: null,
      closestCity: null
    });
    setGeolocError(null);
    
    if (profilo) {
      const nuovoProfilo = { ...profilo, consensoGeolocalizzazione: false };
      ProfileRepository.saveProfile(nuovoProfilo);
      setProfilo(nuovoProfilo);
    }
  }, [profilo]);

  // Ripristina l'applicazione allo stato iniziale (cancella tutto)
  const resetApp = useCallback(() => {
    ProfileRepository.clearAllData();
    setProfilo(null);
    
    // Ricarica i dati dai valori mock iniziali o vuoti
    const initialPercorsi = PercorsiRepository.getPercorsi();
    const initialDocumenti = DocumentiRepository.getDocumenti();
    const initialScadenze = ScadenzeRepository.getScadenze();
    const initialMessaggi = ChatRepository.getMessaggi();
    
    setPercorsi(initialPercorsi);
    setDocumenti(initialDocumenti);
    setScadenze(initialScadenze);
    setMessaggi(initialMessaggi);

    // Reset geodata
    setGeodata({
      statoPermesso: 'ignoto',
      coordinate: null,
      closestCity: null
    });
    setGeolocError(null);
  }, []);

  // Cambia stato di completamento di una scadenza
  const toggleScadenza = useCallback((id: string) => {
    setScadenze(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, completata: !s.completata } : s));
      ScadenzeRepository.saveScadenze(updated);
      return updated;
    });
  }, []);

  // Aggiunge una nuova scadenza custom
  const addScadenza = useCallback((titolo: string, descrizione: string, data: string, priorita: PrioritaScadenza) => {
    const newScad: Scadenza = {
      id: `scad-${Date.now()}`,
      titolo,
      descrizione,
      data,
      priorita,
      completata: false
    };
    setScadenze(prev => {
      const updated = [newScad, ...prev];
      ScadenzeRepository.saveScadenze(updated);
      return updated;
    });
  }, []);

  // Avanza di un passo in un percorso guida
  const stepForward = useCallback((percorsoId: string) => {
    setPercorsi(prev => {
      const updated = prev.map(p => {
        if (p.id !== percorsoId) return p;
        
        const nextStep = p.passoCorrente + 1;
        const isFinished = nextStep >= p.totalePassi;
        
        
        const newEvent = {
          id: `ev-step-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: isFinished ? "Percorso Guida Concluso" : "Passo Completato",
          descrizione: isFinished 
            ? `Hai completato tutti i passaggi della guida per: ${p.titolo}.` 
            : `Completato il passo: ${p.passiNomi[p.passoCorrente]}. Ora sei al passo: ${p.passiNomi[nextStep]}.`
        };

        return {
          ...p,
          passoCorrente: isFinished ? p.passoCorrente : nextStep,
          stato: isFinished ? ("completato" as const) : p.stato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      });
      PercorsiRepository.savePercorsi(updated);
      return updated;
    });
  }, []);

  // Ritorna al passo precedente in un percorso guida
  const stepBackward = useCallback((percorsoId: string) => {
    setPercorsi(prev => {
      const updated = prev.map(p => {
        if (p.id !== percorsoId) return p;
        
        const prevStep = Math.max(0, p.passoCorrente - 1);
        
        const newEvent = {
          id: `ev-step-back-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Ritorno al Passo Precedente",
          descrizione: `Sei ritornato al passo: ${p.passiNomi[prevStep]}.`
        };

        return {
          ...p,
          passoCorrente: prevStep,
          stato: p.stato === "completato" ? ("in_corso" as const) : p.stato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      });
      PercorsiRepository.savePercorsi(updated);
      return updated;
    });
  }, []);

  // Associa un file caricato a un elemento checklist della guida
  const uploadDocument = useCallback((percorsoId: string, checklistItemId: string, fileNome: string) => {
    const newDocId = `doc-${Date.now()}`;
    let percorsoTitolo = "";

    setPercorsi(prev => {
      const updatedPercorsi = prev.map(p => {
        if (p.id !== percorsoId) return p;
        percorsoTitolo = p.titolo;

        const updatedChecklist = p.documentiNecessari.map(item =>
          item.id === checklistItemId
            ? { ...item, completato: true, documentoId: newDocId }
            : item
        );

        let newStato = p.stato;

        const newEvent = {
          id: `ev-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Documento Spuntato",
          descrizione: `Hai registrato la presenza del file: ${fileNome} per la checklist di controllo.`
        };

        return {
          ...p,
          documentiNecessari: updatedChecklist,
          stato: newStato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      });

      // 1. Crea il documento standalone nell'archivio
      const newDoc: Documento = {
        id: newDocId,
        nome: fileNome,
        tipo: fileNome.split(".").pop()?.toUpperCase() || "PDF",
        dimensione: "245 KB",
        dataCaricamento: new Date().toISOString().split("T")[0],
        collegatoAPercorsoId: percorsoId,
        percorsoTitolo: percorsoTitolo,
        stato: "valido"
      };

      setDocumenti(prevDocs => {
        const docs = [newDoc, ...prevDocs];
        DocumentiRepository.saveDocumenti(docs);
        return docs;
      });

      PercorsiRepository.savePercorsi(updatedPercorsi);
      return updatedPercorsi;
    });
  }, []);

  // Rimuove un documento caricato da un elemento checklist
  const removeDocument = useCallback((percorsoId: string, checklistItemId: string) => {
    let docIdToRemove: string | undefined;

    setPercorsi(prev => {
      const updatedPercorsi = prev.map(p => {
        if (p.id !== percorsoId) return p;

        const updatedChecklist = p.documentiNecessari.map(item => {
          if (item.id === checklistItemId) {
            docIdToRemove = item.documentoId;
            return { ...item, completato: false, documentoId: undefined };
          }
          return item;
        });

        let newStato = p.stato;

        const newEvent = {
          id: `ev-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Documento Rimosso",
          descrizione: "Hai deselezionato un documento obbligatorio. La checklist risulta incompleta."
        };

        return {
          ...p,
          documentiNecessari: updatedChecklist,
          stato: newStato,
          cronologia: [...p.cronologia, newEvent],
          dataAggiornamento: new Date().toISOString().split("T")[0]
        };
      });

      if (docIdToRemove) {
        setDocumenti(prevDocs => {
          const docs = prevDocs.filter(d => d.id !== docIdToRemove);
          DocumentiRepository.saveDocumenti(docs);
          return docs;
        });
      }

      PercorsiRepository.savePercorsi(updatedPercorsi);
      return updatedPercorsi;
    });
  }, []);

  // Avvia una nuova guida dal catalogo dei servizi
  const startPercorso = useCallback((servizioId: string) => {
    const srv = SERVIZI_MOCK.find(s => s.id === servizioId);
    if (!srv) return null;

    const exists = percorsi.find(p => p.titolo.toLowerCase().includes(srv.titolo.toLowerCase()) && p.stato !== "completato");
    if (exists) {
      return exists.id;
    }

    const newPercorsoId = `percorso-${Date.now()}`;
    const randomCode = `GUIDA-NEW-${Math.floor(1000 + Math.random() * 9000)}`;

    const customPassiNomi = srv.passiNomi || ["Prepara Requisiti", "Collegamento Portale PA", "Conferma Domanda"];
    const customPassiDettagli = srv.passiDettagli || [
      `Assicurati di possedere i seguenti requisiti: ${srv.requisiti.join(", ")}.`,
      `Accedi al portale ufficiale "${srv.nomePortaleUfficiale}" all'indirizzo ${srv.linkPortaleUfficiale} usando la tua identità digitale.`,
      `Una volta inviata la domanda sul portale ministeriale, segna come concluso questo percorso di guida.`
    ];

    const newPercorso: Percorso = {
      id: newPercorsoId,
      codice: randomCode,
      titolo: `Guida per: ${srv.titolo}`,
      descrizione: srv.descrizione,
      categoria: srv.categoria,
      stato: "bozza",
      dataAggiornamento: new Date().toISOString().split("T")[0],
      passoCorrente: 0,
      totalePassi: customPassiNomi.length,
      passiNomi: customPassiNomi,
      passiDettagli: customPassiDettagli,
      documentiNecessari: srv.requisiti.map((req, index) => ({
        id: `chk-new-${index}-${Date.now()}`,
        testo: req,
        completato: false,
        obbligatorio: index === 0
      })),
      cronologia: [
        {
          id: `ev-new-${Date.now()}`,
          data: new Date().toLocaleString("it-IT", { hour12: false }).replace(/\//g, "-").slice(0, 16),
          titolo: "Percorso Guida Attivato",
          descrizione: `Hai attivato la guida per: ${srv.titolo}. Segui i passi descritti.`
        }
      ],
      linkPortaleUfficiale: srv.linkPortaleUfficiale,
      nomePortaleUfficiale: srv.nomePortaleUfficiale,
      cose: srv.cose,
      aCosaServe: srv.aCosaServe,
      cosaServePrima: srv.cosaServePrima,
      problemiFrequenti: srv.problemiFrequenti,
      noteImportanti: srv.noteImportanti,
      fontiRiferimenti: srv.fontiRiferimenti,
      dataUltimoAggiornamento: srv.dataUltimoAggiornamento
    };

    setPercorsi(prev => {
      const updated = [newPercorso, ...prev];
      PercorsiRepository.savePercorsi(updated);
      return updated;
    });

    return newPercorsoId;
  }, [percorsi]);

  // Carica un documento standalone (indipendente da un percorso)
  const uploadNewDoc = useCallback((nome: string, tipo: string, dimensione: string) => {
    const newDoc: Documento = {
      id: `doc-${Date.now()}`,
      nome,
      tipo,
      dimensione,
      dataCaricamento: new Date().toISOString().split("T")[0],
      stato: "valido"
    };
    setDocumenti(prev => {
      const updated = [newDoc, ...prev];
      DocumentiRepository.saveDocumenti(updated);
      return updated;
    });
  }, []);

  // Rimuove in modo definitivo un documento dall'archivio locale
  const deleteDoc = useCallback((id: string) => {
    setDocumenti(prev => {
      const updated = prev.filter(d => d.id !== id);
      DocumentiRepository.saveDocumenti(updated);
      return updated;
    });

    setPercorsi(prev => {
      const updated = prev.map(p => ({
        ...p,
        documentiNecessari: p.documentiNecessari.map(item =>
          item.documentoId === id
            ? { ...item, completato: false, documentoId: undefined }
            : item
        )
      }));
      PercorsiRepository.savePercorsi(updated);
      return updated;
    });
  }, []);

  // Invia un messaggio in chat ed esegue la simulazione di risposta dell'assistente locale
  const sendMessage = useCallback((testo: string) => {
    const userMsg: Messaggio = {
      id: `msg-user-${Date.now()}`,
      mittente: "utente",
      testo,
      timestamp: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    };

    setMessaggi(prev => {
      const updated = [...prev, userMsg];
      ChatRepository.saveMessaggi(updated);
      return updated;
    });

    // Ritardo per simulazione risposta
    setTimeout(() => {
      let replyText = "";
      let linkInterno: string | undefined;
      let linkTesto: string | undefined;
      let suggerimenti: string[] = [];
      const query = testo.toLowerCase();

      if (query.includes("scadenz") || query.includes("calendar")) {
        const inSospeso = scadenze.filter(s => !s.completata);
        if (inSospeso.length > 0) {
          replyText = `Attualmente hai ${inSospeso.length} scadenze amministrative importanti in sospeso:\n` +
            inSospeso.map(s => `• ${s.titolo} (entro il ${s.data})`).join("\n") +
            `\n\nPuoi visualizzare e aggiungere promemoria nel calendario delle scadenze.`;
          linkInterno = "scadenze";
          linkTesto = "Apri Calendario Scadenze";
        } else {
          replyText = `Non hai scadenze in sospeso registrate in locale. Puoi aggiungerne di nuove nel calendario delle scadenze.`;
          linkInterno = "scadenze";
          linkTesto = "Apri Calendario Scadenze";
        }
        suggerimenti = ["Come posso iniziare una guida?", "Quali servizi sono disponibili?"];
      } else if (query.includes("cie") || query.includes("carta d'identità") || query.includes("carta identita")) {
        const cie = percorsi.find(p => p.titolo.toLowerCase().includes("carta") || p.titolo.toLowerCase().includes("cie"));
        if (cie) {
          replyText = `Hai una guida attiva per il rilascio della CIE (${cie.codice}).\n` +
            `Sei al passo: "${cie.passiNomi[cie.passoCorrente]}".\n` +
            `Ricordati di raccogliere tutti i documenti obbligatori prima di recarti allo sportello.`;
          linkInterno = "pratiche";
          linkTesto = "Vedi i miei percorsi";
        } else {
          replyText = `Per richiedere la Carta d'Identità Elettronica (CIE), devi prenotare un appuntamento sul portale ministeriale e pagare i diritti di segreteria (€22,21). Puoi avviare il percorso guidato nel catalogo servizi per controllare tutti i passaggi.`;
          linkInterno = "servizi";
          linkTesto = "Sfoglia Catalogo Guide";
        }
        suggerimenti = ["Quali sono le mie scadenze?", "Come cambio residenza?"];
      } else if (query.includes("residenza")) {
        const res = percorsi.find(p => p.titolo.toLowerCase().includes("residenza"));
        if (res) {
          replyText = `Hai aperto la guida al 'Cambio di Residenza online'.\n` +
            `Sei al passo: "${res.passiNomi[res.passoCorrente]}" (${res.passiDettagli[res.passoCorrente]}).\n` +
            `Ricordati di verificare l'elenco dei requisiti ed i documenti catastali necessari.`;
          linkInterno = "pratiche";
          linkTesto = "Vedi i miei percorsi";
        } else {
          replyText = `Il Cambio di Residenza online si compila sul portale nazionale ANPR. Avvia il percorso guida nel catalogo dei servizi per controllare l'elenco dei requisiti e dei documenti necessari.`;
          linkInterno = "servizi";
          linkTesto = "Sfoglia Catalogo Guide";
        }
        suggerimenti = ["Come richiedo l'Assegno Unico?", "Quali sono le mie scadenze?"];
      } else if (query.includes("assegno") || query.includes("inps")) {
        const au = percorsi.find(p => p.titolo.toLowerCase().includes("assegno"));
        if (au) {
          replyText = `Hai una guida attiva per l'Assegno Unico INPS (${au.codice}).\n` +
            `Sei al passo: "${au.passiNomi[au.passoCorrente]}".\n` +
            `Assicurati di verificare se ci sono richieste di integrazione e controlla i documenti necessari.`;
          linkInterno = "pratiche";
          linkTesto = "Vedi i miei percorsi";
        } else {
          replyText = `L'Assegno Unico INPS richiede di compilare la domanda inserendo i dati dei figli e l'IBAN per l'accredito sul portale MyINPS. Puoi attivare la guida nel catalogo servizi per organizzare i passaggi.`;
          linkInterno = "servizi";
          linkTesto = "Apri Catalogo Guide";
        }
        suggerimenti = ["Come cambio residenza?", "Mostrami le mie scadenze"];
      } else {
        replyText = `Ho ricevuto la tua richiesta: "${testo}".\n\nIn quanto Software di Guida, posso darti istruzioni pratiche su come procedere. Prova a chiedermi delle "scadenze", del "Cambio di Residenza", della "CIE" o dell'assegno "INPS" per vedere lo stato delle tue guide o dei servizi disponibili.`;
        suggerimenti = ["Quali sono le mie scadenze?", "Come cambio residenza?", "Quali servizi sono disponibili?"];
      }

      const assistantMsg: Messaggio = {
        id: `msg-ast-${Date.now()}`,
        mittente: "assistente",
        testo: replyText,
        timestamp: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        linkInterno,
        linkTesto,
        suggerimenti
      };

      setMessaggi(currentMsgs => {
        const finalMsgs = [...currentMsgs, assistantMsg];
        ChatRepository.saveMessaggi(finalMsgs);
        return finalMsgs;
      });
    }, 850);
  }, [scadenze, percorsi]);

  const clearChat = useCallback(() => {
    ChatRepository.clearMessaggi();
    const initial = ChatRepository.getMessaggi();
    setMessaggi(initial);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessaggi(prev => {
      const updated = prev.filter(m => m.id !== id);
      ChatRepository.saveMessaggi(updated);
      return updated;
    });
  }, []);

  return {
    profilo,
    percorsi,
    documenti,
    scadenze,
    messaggi,
    geodata,
    loadingGeoloc,
    geolocError,
    updateProfile,
    resetApp,
    toggleScadenza,
    addScadenza,
    stepForward,
    stepBackward,
    uploadDocument,
    removeDocument,
    startPercorso,
    uploadNewDoc,
    deleteDoc,
    sendMessage,
    clearChat,
    deleteMessage,
    richiediGeolocalizzazione,
    revocaGeolocalizzazione
  };
}
