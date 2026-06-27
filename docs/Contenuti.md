# **Components and Pages**

## **Obiettivo**

L’app deve essere composta da componenti riusabili, pagine coerenti e flussi chiari, con un’architettura UI ordinata e facilmente estendibile.  
Ogni schermata deve sembrare parte dello stesso ecosistema e supportare un utilizzo veloce, comprensibile e stabile.designers.italia+1

L’obiettivo non è creare molte schermate decorative, ma poche pagine forti, basate su componenti affidabili, accessibili e facili da mantenere.  
Ogni pagina deve aiutare l’utente a capire cosa fare, cosa manca e quale passo compiere dopo.agid.gov+1

## **Architettura dei componenti**

L’interfaccia deve usare una struttura a componenti modulari, con separazione chiara tra:

* primitive UI;  
* componenti compositi;  
* pattern di pagina;  
* sezioni di dominio;  
* pagine complete.

Questa organizzazione aiuta coerenza, manutenzione e performance, e si allinea al principio di costruire servizi digitali attraverso componenti e moduli assemblabili.designers.italia+2

## **Livelli componenti**

## **1\. Primitive UI**

Componenti base, stilizzati secondo il design system:

* Button  
* IconButton  
* Input  
* Textarea  
* Select  
* Checkbox  
* Radio  
* Switch  
* Badge  
* Alert  
* Divider  
* Spinner  
* Tooltip  
* Skeleton  
* Dialog  
* Sheet  
* Tabs  
* Accordion

Questi componenti devono essere il fondamento di tutto il resto.

## **2\. Componenti applicativi**

Costruiti sulle primitive:

* SearchBar  
* FilterBar  
* PageHeader  
* EmptyState  
* ErrorState  
* StatusBadge  
* Stepper  
* SummaryCard  
* DocumentCard  
* ServiceCard  
* PracticeCard  
* TimelineItem  
* UploadArea  
* InfoNotice  
* QuickActionCard  
* AssistantMessage  
* UserMessage  
* ResultListItem  
* DetailSection

## **3\. Pattern di sezione**

Blocchi più grandi:

* DashboardOverview  
* PracticeListSection  
* DocumentListSection  
* DeadlinesPanel  
* AssistantPanel  
* ActivityTimeline  
* ChecklistSection  
* PersonalDataSummary  
* ServiceLinksSection  
* RequiredDocumentsSection  
* SubmissionSummary  
* SearchResultsSection

## **4\. Page templates**

Template riutilizzabili:

* Dashboard page  
* Entity list page  
* Detail page  
* Guided flow page  
* Document workspace page  
* Search page  
* Settings page  
* Assistant page

## **Regole componenti**

* Ogni componente deve avere API semplice e prevedibile.  
* Evitare componenti monolitici troppo intelligenti.  
* Separare aspetto, contenuto e stato.  
* I componenti devono avere varianti limitate e chiare.  
* Le proprietà devono essere coerenti tra componenti simili.  
* Le icone vanno da Radix UI Icons, integrate con `currentColor` e dimensioni coerenti.github+1  
* I componenti devono poter funzionare bene anche con contenuti lunghi, dati mancanti o stati di errore.

## **Componenti obbligatori**

## **AppShell**

Struttura base dell’app:

* sidebar;  
* top bar;  
* area contenuto;  
* slot per pannello laterale opzionale;  
* area notifiche o feedback.

## **Sidebar**

Voci principali suggerite:

* Home  
* Pratiche  
* Servizi  
* Documenti  
* Assistente  
* Scadenze  
* Ricerca  
* Impostazioni

Regole:

* stato attivo evidente;  
* versioni expanded e collapsed;  
* icona \+ label;  
* supporto tastiera;  
* nessuna complessità inutile.

## **TopBar**

Contiene:

* titolo pagina;  
* breadcrumb o back quando necessario;  
* ricerca globale;  
* azioni rapide;  
* eventuale profilo/impostazioni.

## **PageHeader**

Ogni pagina deve iniziare con:

* titolo;  
* sottotitolo opzionale;  
* stato o badge;  
* azioni principali coerenti.

## **SearchBar**

Ricerca centrale dell’app:

* input chiaro;  
* placeholder utile;  
* pulsante opzionale;  
* filtri vicini;  
* risultati facili da leggere.

## **StatusBadge**

Stati standard:

* bozza;  
* in corso;  
* completata;  
* da integrare;  
* scaduta;  
* non disponibile.

## **Alert / Notice**

Usare per:

* documenti mancanti;  
* errore invio;  
* servizio temporaneamente indisponibile;  
* suggerimenti utili;  
* conferme di salvataggio.

## **EmptyState**

Tutte le sezioni vuote devono avere:

* titolo;  
* spiegazione;  
* azione consigliata;  
* eventuale icona;  
* tono chiaro e pratico.

## **Skeleton e loading**

Per evitare percezione di lentezza:

* skeleton per liste;  
* skeleton per card;  
* loader piccoli per azioni puntuali;  
* evitare spinner giganti a schermo intero salvo casi estremi.

## **Pagine principali**

## **1\. Dashboard**

Scopo:  
dare una visione immediata della situazione dell’utente.

Blocchi:

* riepilogo pratiche;  
* prossime scadenze;  
* documenti recenti;  
* azioni rapide;  
* messaggi o alert;  
* riprendi ultima attività.

La dashboard deve essere leggibile in pochi secondi.

## **2\. Pratiche**

Pagina elenco pratiche:

* lista o tabella leggera;  
* filtri;  
* ricerca;  
* stato;  
* data aggiornamento;  
* azioni rapide.

Serve a vedere tutto ciò che l’utente sta seguendo o ha già gestito.

## **3\. Dettaglio pratica**

Pagina fondamentale.

Sezioni:

* header con titolo e stato;  
* step del processo;  
* riepilogo dati;  
* documenti collegati;  
* checklist;  
* cronologia eventi;  
* note;  
* link utili;  
* azioni.

Questa pagina deve essere la più chiara dell’intera app.

## **4\. Servizi**

Catalogo o pagina orientativa dei servizi:

* categorie;  
* schede servizio;  
* breve spiegazione;  
* requisiti;  
* link;  
* livello di urgenza o frequenza d’uso.

Deve aiutare l’utente a trovare il servizio giusto, non a perdersi.

## **5\. Documenti**

Area documentale:

* elenco file;  
* filtri;  
* stato;  
* tag;  
* collegamento a pratiche;  
* anteprima metadati;  
* upload e organizzazione.

Non deve sembrare un file manager generico, ma un archivio utile per pratiche e servizi.

## **6\. Assistente**

Chat sobria e guidata:

* messaggi utente e risposta;  
* suggerimenti iniziali;  
* link rapidi a pagine interne;  
* riferimenti a servizi;  
* box riepilogo con “passi consigliati”.

L’assistente non deve vivere isolato: deve portare l’utente dentro le sezioni corrette dell’app.

## **7\. Scadenze**

Vista orientata al tempo:

* elenco scadenze;  
* priorità;  
* data;  
* contesto pratica o documento;  
* reminder;  
* prossime azioni.

## **8\. Ricerca globale**

Serve a cercare:

* pratiche;  
* servizi;  
* documenti;  
* scadenze;  
* pagine suggerite.

I risultati devono essere leggibili e categorizzati.

## **9\. Impostazioni**

Sezioni:

* profilo locale;  
* preferenze UI;  
* gestione dati locali;  
* import/export o backup se previsti;  
* privacy locale;  
* configurazioni assistente.

## **10\. Help / guida**

Pagina di supporto interno:

* come usare l’app;  
* domande frequenti;  
* note privacy;  
* contatti o link ufficiali utili.

## **Flussi principali**

L’app deve supportare almeno questi flussi:

* capire quale servizio serve;  
* seguire una pratica;  
* controllare documenti necessari;  
* vedere cosa manca;  
* monitorare scadenze;  
* ricevere aiuto dall’assistente;  
* trovare rapidamente informazioni già presenti.

I flussi devono essere brevi, leggibili e modulari, in linea con l’idea di moduli e passaggi proposta da Designers Italia per i servizi digitali.designers.italia+1

## **Ottimizzazione velocità**

L’app deve sembrare immediata, anche con molte pratiche o documenti.  
La percezione di velocità è importante quanto la velocità tecnica reale, e Tauri è adatto proprio a costruire app desktop leggere con attenzione a bundle size e performance.[oflight](https://www.oflight.co.jp/en/columns/tauri-v2-performance-bundle-size)

## **Regole generali**

* Caricare solo ciò che serve davvero.  
* Evitare componenti pesanti sempre montati.  
* Separare pagine e sezioni con lazy loading.  
* Evitare librerie UI inutilmente grandi.  
* Ridurre re-render inutili.  
* Mantenere lo stato locale ben segmentato.  
* Fare parsing e operazioni pesanti fuori dal main rendering flow.

## **UI performance**

* Usare skeleton al posto di blocchi vuoti.  
* Virtualizzare liste molto lunghe.  
* Debounce sulla ricerca.  
* Memoizzazione dei componenti costosi.  
* Evitare effetti che causano layout thrashing.  
* Preferire transizioni semplici a animazioni complesse.

## **Architettura performance**

* Ogni pagina carica solo i dati che usa.  
* Ogni sezione deve poter fallire senza rompere tutta la pagina.  
* I componenti grandi devono essere composti da sottocomponenti piccoli.  
* Ridurre nesting inutile.  
* Estrarre logica pesante in hook o servizi dedicati.  
* Tenere l’AppShell stabile e cambiare il contenuto interno.

## **Tauri / desktop performance**

* Minimizzare il bundle frontend quando possibile.[oflight](https://www.oflight.co.jp/en/columns/tauri-v2-performance-bundle-size)  
* Evitare dipendenze JS non necessarie.  
* Usare il layer Rust per operazioni native o pesanti quando serve.  
* Non bloccare la UI con parsing, file scan o indicizzazione.  
* Usare operazioni asincrone e feedback chiari.  
* Ottimizzare avvio, memoria a riposo e tempi di apertura delle pagine.[oflight](https://www.oflight.co.jp/en/columns/tauri-v2-performance-bundle-size)

## **Gestione stati**

Ogni pagina e componente importante deve prevedere:

* initial;  
* loading;  
* success;  
* empty;  
* partial;  
* error.

Questo evita interfacce fragili e migliora la percezione di affidabilità.[designers.italia](https://designers.italia.it/design-system/componenti/)

## **Convenzioni naming componenti**

Pattern consigliato:

* `AppShell`  
* `MainSidebar`  
* `TopBar`  
* `PageHeader`  
* `PracticeCard`  
* `DocumentCard`  
* `StatusBadge`  
* `AssistantPanel`  
* `DeadlineList`  
* `ServiceGrid`  
* `SearchResultsSection`

Nomi chiari, orientati al dominio, senza abbreviazioni inutili.

## **Cose da evitare**

* Componenti giga con troppe responsabilità.  
* Card decorative senza funzione.  
* Pagine duplicate con piccole differenze.  
* Tabelle dense non filtrabili.  
* Animazioni pesanti.  
* Effetti grafici da SaaS.  
* Dipendenze UI enormi “per comodità”.  
* Stato globale usato per tutto.  
* Logica business mischiata al rendering.  
* Overlay che bloccano inutilmente il lavoro.

## **Obiettivo finale**

L’app deve apparire come un sistema ordinato di componenti affidabili e pagine chiare, capace di accompagnare l’utente nei servizi e nelle pratiche senza attrito.  
Ogni parte deve risultare consistente, rapida, accessibile e coerente con un prodotto ispirato ai servizi digitali pubblici italiani.

