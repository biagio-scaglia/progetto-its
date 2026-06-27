# **Accessibility and Responsiveness**

## **Obiettivo**

Questa applicazione desktop deve essere accessibile, leggibile, inclusiva e robusta anche per utenti con poca familiarità digitale, difficoltà visive, difficoltà motorie o necessità di navigazione assistita.  
L’accessibilità è un requisito di progetto e non una rifinitura finale.designers.italia+1

La responsività non serve solo per mobile: deve garantire una buona esperienza anche su finestre ridotte, zoom elevato, scaling di sistema e diverse risoluzioni desktop.  
L’interfaccia deve restare comprensibile, navigabile e stabile in ogni configurazione ragionevole.agid+1

## **Principi**

* Progettare per includere, non per adattare a posteriori.designers.italia+1  
* Rendere ogni contenuto comprensibile anche senza contesto tecnico.  
* Garantire navigazione da tastiera completa.  
* Dare feedback chiari su focus, errori, caricamenti e stati.  
* Non affidare mai il significato solo al colore.agid+1  
* Mantenere leggibilità e struttura anche con zoom, font scaling o finestra ridotta.  
* Ridurre il carico cognitivo con gerarchia visiva forte e pattern prevedibili.

## **Accessibilità generale**

## **Regole obbligatorie**

* Tutti gli elementi interattivi devono essere raggiungibili da tastiera.  
* Ogni controllo deve avere un nome accessibile chiaro.  
* I campi devono avere label vere, non solo placeholder.  
* Gli errori devono essere testuali e associati al campo corretto.  
* Focus sempre visibile e ad alto contrasto.[designers.italia](https://designers.italia.it/design-system/fondamenti/accessibilita/)  
* Le icone non devono essere l’unica fonte di significato.  
* Stati come errore, successo, warning e completato devono avere testo esplicito.[agid](https://www.agid.gov.it/it/design-servizi/accessibilita/linee-guida-accessibilita-pa)

## **Semantica**

* Usare struttura semantica corretta.  
* Heading in ordine logico.  
* Landmark chiare: navigation, main, aside, header, footer quando applicabile.  
* Liste vere per insiemi di elementi.  
* Tabelle solo per dati tabellari reali.  
* Dialog e sheet con ruoli e comportamento coerente.

## **Tastiera**

* Tab order naturale.  
* Nessun trap di focus non gestito.  
* Escape chiude modali, dialog e overlay quando appropriato.  
* Enter e Space attivano i controlli secondo convenzione.  
* Sidebar, tab, accordion e menu devono essere completamente navigabili da tastiera.[designers.italia](https://designers.italia.it/design-system/fondamenti/accessibilita/)

## **Testi**

* Linguaggio semplice e diretto.  
* Evitare frasi burocratiche inutilmente dense.  
* Evitare sigle non spiegate.  
* Helper text breve e utile.  
* Errori chiari, mai tecnici o colpevolizzanti.

## **Contrasto e leggibilità**

* Tutto il testo deve avere contrasto elevato con lo sfondo.medium+1  
* Focus ring sempre ben visibile.  
* Link riconoscibili anche senza basarsi solo sul colore.  
* Badge e stati devono essere leggibili anche in condizioni di bassa visione.  
* Evitare testo troppo chiaro su sfondi colorati.  
* Evitare grigi troppo deboli per informazioni importanti.

## **Regole pratiche**

* Testo principale: contrasto alto.  
* Testo secondario: comunque leggibile.  
* Placeholder: mai usato come unica istruzione.  
* Testo su pulsanti primary: molto contrastato.  
* Bordi dei campi abbastanza visibili anche in stato default.

## **Dimensioni e target cliccabili**

* Pulsanti, checkbox, radio e menu item devono avere area cliccabile comoda.  
* Le azioni frequenti non devono essere piccole o troppo vicine tra loro.  
* Le icone cliccabili isolate vanno evitate per azioni critiche.  
* Le righe cliccabili di liste e tabelle devono avere hover e focus chiari.

## **Stati interattivi**

Ogni componente interattivo deve avere almeno:

* default;  
* hover;  
* focus-visible;  
* active;  
* disabled;  
* loading, se applicabile.

## **Regole**

* Disabled non deve sembrare un errore.  
* Loading deve essere chiaro e non ambiguo.  
* Success e warning devono avere anche testo.  
* I feedback devono comparire vicino all’azione che li ha generati.

## **Dialog, modali e pannelli**

* Devono spostare il focus in modo corretto all’apertura.  
* Devono restituire il focus al trigger alla chiusura.  
* Devono avere titolo chiaro.  
* Devono avere chiusura evidente.  
* Non usare modali per contenuti lunghissimi.  
* Se il contenuto è complesso, preferire pagina dedicata o pannello laterale.

## **Form**

I form sono centrali nell’app, quindi devono essere estremamente chiari.

## **Regole**

* Label sopra il campo.  
* Helper text sotto la label o sotto il campo.  
* Error text sotto il campo.  
* Campi obbligatori ben indicati.  
* Raggruppare i campi per senso logico.  
* Evitare form troppo lunghi in un solo blocco.  
* Usare step, sezioni o accordion quando utile.

## **Validazione**

* Validazione inline quando ha senso.  
* Error summary in alto nei form lunghi.  
* Messaggi orientati alla correzione.  
* Non dire solo “campo non valido”; dire cosa manca o cosa correggere.

## **Tabelle, liste e dati**

* Preferire liste strutturate alle tabelle quando il confronto colonna per colonna non è necessario.  
* Tabelle con intestazioni chiare.  
* Righe con azioni ben accessibili.  
* Nessuna dipendenza da hover-only per mostrare azioni importanti.  
* Su viewport stretti o finestre ridotte, prevedere adattamento leggibile.

## **Responsive behavior**

Questa è una desktop app, ma deve essere adattiva.

## **Breakpoint logici**

* Large desktop.  
* Standard desktop.  
* Narrow desktop window.  
* Very narrow window.

Non pensare solo a “desktop fisso”: molte persone usano finestre affiancate, scaling di sistema o monitor piccoli.

## **Regole di adattamento**

* Sidebar comprimibile o collassabile.  
* Pannelli secondari nascosti o spostati sotto il contenuto quando lo spazio si riduce.  
* Tabelle che degradano in liste o card se diventano illeggibili.  
* Toolbar che si compatta senza rompere la gerarchia.  
* I moduli restano leggibili senza tagli o overflow.  
* Nessun testo troncato in modo critico.

## **Zoom e scaling**

L’interfaccia deve funzionare bene con:

* zoom browser/webview;  
* text scaling;  
* display scaling del sistema operativo.

## **Regole**

* Nessun layout rigido basato su altezze fisse inutili.  
* Evitare contenitori che rompono il testo su zoom elevato.  
* I pulsanti non devono spezzarsi male.  
* Titoli e paragrafi devono rifluire bene.  
* Le aree scrollabili devono restare usabili.

## **Motion e riduzione movimento**

* Le animazioni devono essere minime.  
* Rispettare `prefers-reduced-motion`.  
* Evitare transizioni lunghe o decorative.  
* Nessuna animazione indispensabile per capire un contenuto.  
* Accordion, panel e dialog possono animarsi, ma in modo rapido e sobrio.

## **Icone e contenuti non testuali**

* Le icone decorative devono essere ignorabili dai lettori di schermo.  
* Le icone informative devono avere supporto testuale o label accessibile.  
* I documenti caricati devono mostrare nome, tipo e stato in testo.  
* Le azioni come download, allega, elimina o apri non devono dipendere solo dall’icona.

## **Errori e feedback**

* Messaggi d’errore chiari, brevi, utili.  
* Evitare codici interni o stack trace.  
* Suggerire il passo successivo.  
* Nei casi bloccanti, indicare cosa può fare l’utente.  
* Nei casi non bloccanti, non interrompere inutilmente il flusso.

## **Pattern da seguire**

## **Sidebar**

* Ordine stabile.  
* Voci chiare.  
* Stato attivo evidente.  
* Navigabile da tastiera.

## **Stepper**

* Stato corrente molto chiaro.  
* Step completati riconoscibili.  
* Testo leggibile anche senza colore.

## **Alert**

* Icona \+ titolo \+ descrizione breve.  
* Contrasto forte.  
* Nessun linguaggio allarmistico inutile.

## **Search**

* Campo facilmente individuabile.  
* Shortcut eventuale chiaramente mostrata.  
* Risultati navigabili anche da tastiera.

## **Cose da evitare**

* Contrasto basso.  
* Testo piccolo.  
* Focus invisibile.  
* Hover come unico segnale di interazione.  
* Dialog senza gestione del focus.  
* Layout rigidi che si rompono quando la finestra si restringe.  
* Sidebar non comprimibili.  
* Tabelle enormi senza fallback.  
* Errori vaghi o tecnici.  
* Icone senza label.  
* Placeholder usati come unica istruzione.  
* Animazioni inutili o distraenti.

## **Test minimi da fare**

* Navigazione completa solo tastiera.  
* Uso con zoom alto.  
* Uso con finestra desktop stretta.  
* Verifica contrasti.  
* Test con screen reader, almeno sui flussi principali.  
* Test dei form con errori.  
* Test di modali, sheet, tab e accordion.  
* Test dei documenti e delle liste pratiche con molti elementi.

## **Obiettivo finale**

L’app deve risultare accessibile e stabile per il maggior numero possibile di persone, in linea con i principi di inclusione e accessibilità promossi da Designers Italia e AgID.designers.italia+2  
Ogni schermata deve poter essere letta, capita e usata senza fatica inutile, anche in condizioni non ideali.agid+1

