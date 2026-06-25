# **Design System**

## **Obiettivo**

Questa applicazione desktop deve trasmettere affidabilità, chiarezza, ordine e supporto pratico.  
L'interfaccia deve ricordare il linguaggio visivo dei servizi digitali italiani: istituzionale ma moderna, semplice ma non povera, accessibile, leggibile e orientata ai compiti dell’utente.

Non deve sembrare una startup SaaS, una dashboard fintech o una classica app AI generica.  
Deve sembrare uno strumento serio per aiutare le persone a orientarsi tra pratiche, servizi, documenti, scadenze e richieste amministrative.

## **Principi**

* Privilegiare sempre chiarezza, comprensibilità e orientamento all’azione.  
* Usare una gerarchia visiva forte ma sobria.  
* Ridurre il rumore visivo e gli elementi decorativi superflui.  
* Rendere ogni schermata leggibile anche da utenti poco esperti.  
* Favorire componenti prevedibili, coerenti e accessibili.  
* Ogni interazione deve dare sicurezza, non spettacolo.  
* La UI deve apparire autorevole ma umana.

## **Direzione visiva**

* Stile generale: istituzionale, pulito, ordinato, affidabile.  
* Mood: servizio pubblico digitale ben progettato, non portale vecchio, non SaaS americana.  
* Layout: rigoroso, con colonne chiare, spaziature regolari, sezioni leggibili.  
* Densità: media; non troppo vuota, non troppo compressa.  
* Aspetto: moderno e calmo, con enfasi su contenuto, moduli, stato delle pratiche e navigazione.

## **Colori**

La palette deve ispirarsi al linguaggio visivo istituzionale italiano.

## **Colori principali**

* Blu istituzionale come colore primario.  
* Blu più scuro per header, sidebar o elementi di ancoraggio.  
* Azzurro molto lieve solo per highlight secondari o superfici informative.  
* Neutri freddi o leggermente caldi per sfondi, bordi e testo.

## **Ruoli cromatici**

* Primary: azioni principali, link, focus, elementi attivi.  
* Surface: sfondo app, pannelli, card, moduli.  
* Border: separatori, contorni campi, griglie.  
* Text: testo principale, secondario, disattivato.  
* Success: esiti positivi, completato, inviato.  
* Warning: attenzione, dati mancanti, scadenza vicina.  
* Error: errori validazione, servizi non disponibili.  
* Info: spiegazioni, help box, stato informativo.

## **Regole**

* Evitare gradienti aggressivi.  
* Evitare colori neon, viola “AI”, glassmorphism, glow.  
* Il blu deve dominare, ma con uso misurato.  
* Gli stati semaforici devono essere chiari ma sobri.  
* Il contrasto deve restare elevato in tutti i casi.

## **Tipografia**

* Usare sans-serif moderna, leggibile, neutra.  
* Evitare font eccentrici, geometrici troppo “startup”, serif decorative.  
* Titoli chiari, compatti, con peso medio-alto.  
* Testo corpo sempre molto leggibile.  
* Dimensioni generose, soprattutto nei moduli e nelle schermate con molti contenuti.  
* La tipografia deve aiutare la scansione rapida.

## **Gerarchia**

* Display: rarissimo, solo in hero o schermate speciali.  
* H1: titolo pagina.  
* H2: sezioni principali.  
* H3: sottosezioni, card title, box title.  
* Body: testo standard.  
* Small: helper text, metadati, dettagli secondari.  
* Label: etichette campi e badge.

## **Icone**

Usare **Radix UI Icons** come libreria principale.

## **Regole per le icone**

* Usare icone semplici, lineari, piccole e coerenti.  
* Le icone devono accompagnare il testo, non sostituirlo quasi mai.  
* Evitare icone illustrative o troppo decorative.  
* Usare `currentColor` così da far ereditare il colore al contesto.  
* Dimensione standard piccola o media; niente icone giganti come elemento grafico dominante.  
* Icone sempre leggibili e con significato evidente.

## **Casi d’uso**

* Home  
* Ricerca  
* Documento  
* Persona/Profilo  
* Calendario  
* Orologio/Scadenza  
* Check/Stato completato  
* Alert/Errore  
* Freccia indietro / avanti  
* Chevron accordion  
* Chat / assistente  
* Upload / download  
* Archivio / fascicolo  
* Link esterno  
* Info / help

## **Componenti**

I componenti devono essere **custom**, non generici, ma ispirati al linguaggio dei servizi pubblici digitali italiani.  
Devono essere modulari, riusabili, molto coerenti e visivamente stabili.

## **Button**

Varianti:

* Primary  
* Secondary  
* Tertiary / ghost  
* Danger  
* Icon button  
* Back button

Regole:

* Label sempre chiara.  
* Mai usare solo icona per azioni importanti.  
* Stato hover, focus, disabled e loading sempre definiti.  
* Pulsanti principali pochi e ben distinguibili.

## **Input e form**

Componenti:

* Text input  
* Search input  
* Select  
* Combobox  
* Textarea  
* Checkbox  
* Radio  
* Switch solo dove veramente utile  
* Date picker  
* File uploader

Regole:

* Label sempre visibile.  
* Helper text sotto il campo.  
* Errori sotto il campo, chiari e non tecnici.  
* Focus ring evidente.  
* Campi ben spaziati e facili da completare.

## **Card**

Tipi:

* Card informativa  
* Card pratica  
* Card servizio  
* Card documento  
* Card stato

Regole:

* Bordi leggeri.  
* Poco shadow, solo se necessario.  
* Titolo, descrizione breve, metadati, azione.  
* Nessun look da “feature card SaaS”.

## **Badge e status**

Tipi:

* Bozza  
* In corso  
* Completata  
* Da verificare  
* Scaduta  
* Richiede azione

Regole:

* Devono aiutare la lettura rapida dello stato.  
* Non affidarsi solo al colore.  
* Sempre abbinati a label testuale.

## **Alert e notice**

Tipi:

* Info  
* Success  
* Warning  
* Error

Regole:

* Struttura compatta ma leggibile.  
* Icona \+ titolo \+ testo breve.  
* Usare per spiegare, non per spaventare.  
* Linguaggio chiaro e orientato all’azione.

## **Navigation**

Componenti:

* Sidebar principale  
* Top bar  
* Breadcrumb se utile  
* Tabs  
* Section nav interna  
* Back action

Il pattern “back” è utile soprattutto in flussi a step o schermate di dettaglio, e Designers Italia lo tratta come componente importante per tornare al contesto precedente.

## **Tabelle e liste**

* Tabelle semplici, leggibili, con header chiari.  
* Liste più usate delle tabelle quando possibile.  
* Per documenti e pratiche privilegiare righe ben leggibili con metadati.  
* Azioni contestuali allineate e non nascoste inutilmente.

## **Accordion**

Perfetto per:

* FAQ  
* dettagli pratica  
* documenti richiesti  
* note procedurali

Regole:

* Titolo sempre chiaro.  
* Stato aperto/chiuso evidente.  
* Contenuto non eccessivo.

## **Stepper e progress**

Essenziale per flussi di pratica o assistenza guidata.

* Step corrente molto chiaro.  
* Step completati visibili.  
* Step futuri distinguibili ma non rumorosi.

## **Layout**

## **Shell desktop**

* Sidebar sinistra stabile.  
* Header superiore leggero.  
* Area contenuto centrale ampia.  
* Eventuale pannello secondario per dettagli o assistente.

## **Regole layout**

* Griglia ordinata.  
* Spaziatura coerente.  
* Max width leggibile nelle pagine dense.  
* Contenuto mai troppo largo senza struttura.  
* Titolo pagina sempre visibile in alto.  
* Azioni principali vicino al contenuto rilevante.

## **Responsive**

Anche se è desktop app, deve adattarsi bene a finestre ridotte.

* Sidebar comprimibile.  
* Tabelle degradano bene.  
* Card e moduli restano leggibili.  
* Nessun layout fragile o che collassa male.

## **Microcopy**

Il tono dei testi deve essere:

* chiaro;  
* istituzionale ma semplice;  
* rassicurante;  
* concreto;  
* non burocratese.

## **Regole**

* Dire sempre cosa succede.  
* Spiegare cosa serve all’utente.  
* Evitare sigle senza contesto.  
* Errori umani, non tecnici.  
* CTA esplicite: “Apri servizio”, “Controlla documenti”, “Salva bozza”, “Continua”.  
* Evitare copy marketing, hype, linguaggio da prodotto AI.

## **Accessibilità**

L’accessibilità è prioritaria, non opzionale.

## **Regole obbligatorie**

* Contrasto alto.  
* Focus ring visibile.  
* Navigazione da tastiera completa.  
* Label associate correttamente ai campi.  
* Icone decorative nascoste ai lettori di schermo se necessario.  
* Stato e significato mai affidati solo al colore.  
* Dimensioni cliccabili comode.  
* Struttura semantica coerente.

## **Motion**

* Animazioni minime e funzionali.  
* Transizioni brevi e morbide.  
* Niente effetti scenografici.  
* Usare movimento solo per chiarire cambi di stato, apertura pannelli, feedback su azioni.

## **Pattern schermate**

## **Dashboard**

* riepilogo pratiche;  
* scadenze;  
* documenti recenti;  
* azioni rapide;  
* alert importanti.

## **Dettaglio pratica**

* titolo;  
* stato;  
* step;  
* documenti;  
* note;  
* azioni disponibili;  
* cronologia.

## **Assistente**

* chat ordinata e sobria;  
* suggerimenti iniziali;  
* risposte strutturate;  
* box con link utili;  
* riferimenti a servizi o sezioni dell’app.

## **Archivio documenti**

* ricerca;  
* filtri;  
* elenco leggibile;  
* metadati chiari;  
* anteprima o dettagli.

## **Cose da evitare**

* Estetica AI generica.  
* Dashboard neon o cyber.  
* Glassmorphism.  
* Gradienti vistosi.  
* Ombre forti.  
* Card troppo tonde.  
* Icone enormi decorative.  
* Hero da landing page SaaS.  
* Troppa densità informativa senza gerarchia.  
* Effetti animati inutili.  
* Microcopy da startup.  
* Interfaccia che sembra una demo.

## **Implementazione tecnica**

* Frontend React \+ TypeScript.  
* Icone da `@radix-ui/react-icons` o equivalente libreria Radix Icons.  
* Componenti custom costruiti sopra primitive accessibili.  
* Naming dei componenti chiaro e stabile.  
* Nessuna dipendenza da template UI “marketing style”.  
* Tutti i componenti devono essere facilmente tematizzabili.

## **Obiettivo finale**

Ogni schermata deve sembrare parte di un ecosistema affidabile, vicino al mondo dei servizi pubblici digitali italiani, ma più chiaro, più ordinato e più accompagnato.  
L’utente non deve percepire “tecnologia”, ma **orientamento, fiducia e supporto pratico**.

