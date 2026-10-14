// Testo del regolamento. Per modificarlo basta aggiornare questo file.
//
// Ogni capitolo ha un `id` (usato nei link, es. encoderp.it/regolamento/#generale),
// un testo introduttivo facoltativo (`intro`) e una lista di articoli
// numerati in automatico (Art. 2.3 → #art-2-3).
// Un capitolo con `pending: true` e senza articoli viene mostrato "In preparazione".
//
// Il testo di un articolo (e di `intro`) è una lista di blocchi:
//   'testo'                              paragrafo (**grassetto** supportato)
//   { list: ['...', '...'] }             elenco puntato
//   { steps: ['...', '...'] }            elenco numerato
//   { note: '...', kind: 'info' }        riquadro (kind: 'info' | 'warning')
//   { table: { head: [...], rows: [[...], ...] } }
//   { map: { ... } }                     mappa con luoghi evidenziati (vedi components/RuleMap.vue)
//
// Per dividere un capitolo in sottocategorie si aggiunge `group: 'Nome'` al primo
// articolo di ogni gruppo: vale anche per i successivi finché non ne inizia un altro.
// La numerazione resta continua (vedi capitolo Assalti).

export const rules = {
  title: 'Regolamento',
  subtitle: 'Regolamento generale del server Encode Roleplay',
  version: '1.0',
  updated: '2026-10-14',
  // Mostra l'etichetta "Bozza" finché il testo non è approvato dallo staff
  draft: false,

  // Mostrati nell'apertura della pagina
  intro: [
    'La nostra filosofia è semplice: meno costrizioni, più immersione.',
    'Le regole esistono per garantire rispetto, coerenza e qualità del roleplay, non per limitare l\'immaginazione.',
  ],

  sections: [
    {
      id: 'generale',
      title: 'Generale',
      intro: [
        'Il regolamento è stato scritto in modo volutamente libero e creativo: l\'obiettivo è non imporre restrizioni che limitino la creatività dei giocatori.',
        'Si basa sul buon senso delle persone. In caso di abusi, lo staff potrà introdurre regole più restrittive. Ogni modifica verrà comunicata nei canali Discord dedicati.',
      ],
      articles: [
        {
          group: 'Regolamento roleplay',
          title: 'Powergame',
          body: ['Compiere azioni impossibili per una persona reale, anche quando la fisica di GTA le rende realizzabili.'],
        },
        {
          title: 'Powerplay',
          body: ['Imporre azioni ed effetti al personaggio altrui, senza lasciargli la possibilità di reagire o rispondere in RP.'],
        },
        {
          title: 'RDM (Random Deathmatch)',
          body: [
            'Uccidere o ferire un giocatore senza un motivo roleplay.',
            'È vietato anche provocare un giocatore con il solo scopo di far iniziare una sparatoria.',
          ],
        },
        {
          title: 'VDM (Vehicle Deathmatch)',
          body: ['Uccidere o ferire un giocatore con un veicolo senza un motivo roleplay.'],
        },
        {
          title: 'Fail RP',
          body: ['Comportamenti che rompono l\'immersione o la coerenza del roleplay, ad esempio ignorare ferite gravi o avere reazioni irrealistiche.'],
        },
        {
          title: 'Metagame',
          body: ['Usare informazioni ottenute fuori dal gioco (chat OOC, stream, Discord) per influenzare le decisioni del proprio personaggio.'],
        },
        {
          title: 'No-Fear',
          body: ['Non mostrare paura, o una reazione plausibile, in una situazione di pericolo.'],
        },
        {
          title: 'Revenge Kill',
          body: ['Uccidere per vendetta al di fuori di un contesto roleplay adeguato.'],
        },
        {
          title: 'Combat log / Slog',
          body: [
            '**Combat log**: uscire dal server durante un\'azione per evitare una situazione di svantaggio.',
            '**Combat slog**: entrare in gioco sapendo che è in corso un\'azione, per avvantaggiare la propria fazione.',
            { note: 'L\'utilizzo del comando **/logout** durante un\'azione è considerato combat slog.', kind: 'warning' },
          ],
        },
        {
          title: 'Bug abusing',
          body: ['Sfruttare a proprio vantaggio un bug, un errore di gioco o un glitch.'],
        },
        {
          title: 'Bunny hop',
          body: ['Usare salti o movimenti ripetuti per ottenere un vantaggio ingiusto in combattimento, o per spostarsi in modo non realistico.'],
        },
        {
          title: 'Cop baiting',
          body: ['Provocare intenzionalmente le forze dell\'ordine per ottenere una reazione, senza un valido motivo roleplay.'],
        },
        {
          title: 'Mix chat',
          body: ['Mescolare la chat IC e OOC, oppure usare il canale sbagliato.'],
        },
        {
          group: 'Regolamento server',
          title: 'Linguaggio',
          body: ['Sono vietati il linguaggio offensivo e discriminatorio e le molestie, sia in OOC sia in IC.'],
        },
        {
          title: 'Cheating, trolling e molestie',
          body: [
            'Sono vietati:',
            {
              list: [
                '**cheating**: l\'uso di software o programmi di cheating, di qualsiasi tipo;',
                '**trolling**: **tutti** i comportamenti da troll;',
                '**molestie**: importunare o molestare altri giocatori.',
              ],
            },
            { note: 'Queste infrazioni comportano il **ban permanente**.', kind: 'warning' },
          ],
        },
        {
          title: 'Tortura e RP a sfondo sessuale',
          body: [
            'Sono vietati la tortura e il roleplay a sfondo sessuale.',
            'Fa eccezione la tortura leggera e non disturbante, consentita nei rapimenti (vedi il capitolo [Rapimenti e ostaggi](#rapimenti)).',
          ],
        },
        {
          title: 'Ambientazione',
          body: ['Il personaggio deve essere coerente con la città in cui è ambientato il server: Los Santos, in America.'],
        },
        {
          title: 'Tossicità',
          body: [
            'Nel server non sono ammessi atteggiamenti tossici.',
            'Non sono tollerati litigi, insulti o discussioni in OOC nati da eventi accaduti in gioco o fuori. Se è necessario chiarire una situazione, il confronto deve avvenire in modo civile e rispettoso.',
          ],
        },
        {
          title: 'Ferite e incoscienza',
          body: [
            'Un giocatore ferito deve interpretare in modo realistico il dolore e le conseguenze delle ferite riportate.',
            'Un player incosciente non può parlare né comunicare in alcun modo con altri giocatori.',
            { note: 'In caso di morte causata da un bug, è possibile chiedere il ress tramite report.', kind: 'info' },
          ],
        },
        {
          title: 'Amnesia post-morte',
          body: [
            'Ciò che il personaggio ricorda dipende da come si conclude la scena:',
            {
              table: {
                head: ['Situazione', 'Cosa ricorda', 'Cosa non ricorda'],
                rows: [
                  [
                    '**Respawn in ospedale**',
                    'Nulla: il personaggio riparte da zero rispetto a quell\'episodio.',
                    'Luogo, dinamica, responsabili e quanto accaduto poco prima della morte.',
                  ],
                  [
                    '**Curato e rianimato dai medici**',
                    'La dinamica generale dell\'accaduto.',
                    'Luogo esatto, nomi, volti, vestiti, targhe e ogni altro dettaglio che permetta di identificare i responsabili.',
                  ],
                ],
              },
            },
          ],
        },
        {
          title: 'Clip durante le assistenze',
          body: [
            'Per essere valida in un\'assistenza, una clip deve rispettare entrambi i requisiti:',
            { list: ['essere integra, senza tagli né modifiche;', 'includere sia l\'audio del gioco (desktop) sia l\'audio del giocatore che registra.'] },
          ],
        },
        {
          title: 'Loot',
          body: [
            'Le azioni a scopo loot sono severamente vietate.',
            'In generale è sempre consentito lootare:',
            { list: ['munizioni;', 'cibo;', 'acqua;', 'bende.'] },
            'Qualsiasi altro oggetto (telefono, armi, contanti e così via) può essere preso solo con una valida motivazione RP.',
          ],
        },
        {
          title: 'Furto di veicolo di un player',
          body: [
            {
              table: {
                head: ['Veicolo', 'Regola'],
                rows: [
                  ['Veicoli dei giocatori', 'Il furto è consentito solo con una valida motivazione RP'],
                  ['Veicoli delle forze dell\'ordine', 'Il furto è consentito, ma chi lo compie ne subisce le conseguenze in RP'],
                ],
              },
            },
          ],
        },
        {
          title: 'Contenuti audio',
          body: ['È vietata la riproduzione di contenuti audio, comprese canzoni e tracce musicali, che siano offensivi, discriminatori, estremisti, eccessivamente volgari o contrari alle regole delle piattaforme di streaming.'],
        },
        {
          title: 'Riferimenti fuori dal gioco',
          body: [
            'Durante qualsiasi azione IC è severamente vietato usare termini o riferimenti allo staff, a Discord, ai ticket, alle assistenze o a qualsiasi altro elemento esterno al gioco.',
            'I problemi tecnici e le situazioni che richiedono un intervento esterno vanno gestiti tramite i canali di assistenza e il sistema di report.',
            'Solo in caso di necessità, e se ci si trova in un luogo isolato, lontano da altre scene roleplay, è consentito uscire temporaneamente dal personaggio per il tempo strettamente necessario a risolvere il problema.',
          ],
        },
        {
          group: 'Scene ostili',
          title: 'Avvio delle azioni ostili',
          body: [
            'Un ingaggio non può partire dal nulla: deve esserci una **escalation**, cioè un passaggio dal piano **verbale** a quello **fisico**.',
            'Anche la vittima deve rispondere alla scena in RP. Ignorarla, o reagire senza motivo, è Fail RP o No-Fear. Se è lei a reagire con violenza per prima, l\'aggressore può rispondere subito.',
            '**Eccezione:** l\'escalation non è richiesta se tra le parti esiste già un contesto RP avviato (un conflitto in corso tra fazioni o individui) e negli assalti pianificati. Anche in questi casi il motivo deve essere maturato in gioco prima dell\'azione.',
          ],
        },
        {
          title: 'Fear RP e valore della vita',
          body: [
            'Ogni personaggio deve reagire in modo coerente a una minaccia credibile. La reazione può variare in base al carattere (paura, sottomissione, trattativa, ma anche orgoglio, sfida o spavalderia), purché sia interpretata in modo realistico e coerente con la storia del personaggio.',
            {
              table: {
                head: ['Comportamento consentito', 'Comportamento No-Fear'],
                rows: [
                  [
                    'Rifiutarsi di collaborare',
                    'Ignorare le armi puntate',
                  ],
                  [
                    'Rispondere con una sfida',
                    'Comportarsi come se la minaccia non esistesse',
                  ],
                  [
                    'Tentare di fuggire',
                    'Reagire in modo impossibile in netta inferiorità (ad esempio uno contro più persone armate) senza un\'opportunità concreta',
                  ],
                ],
              },
            },
            'Chi sceglie di opporsi ne accetta le conseguenze in RP, comprese ferite gravi, rapimento o morte.',
            { note: 'Le conseguenze subite non sono, da sole, un motivo di segnalazione. Si può segnalare solo se l\'aggressore ha violato il regolamento, ad esempio non ha avviato correttamente la scena o ha agito senza un motivo RP.', kind: 'info' },
            'L\'orgoglio non può essere un pretesto per provocare una sparatoria senza motivo RP (vedi [RDM](#art-1-3) e [Cop baiting](#art-1-12)).',
          ],
        },
      ],
    },
    {
      id: 'precisazioni',
      title: 'Precisazioni',
      articles: [
        {
          title: 'VDM',
          body: [
            'Investire altri giocatori durante un\'azione roleplay (ad esempio per aprirsi una via di fuga o durante un inseguimento) non è VDM, purché sia coerente con il contesto RP e non abbia come unico scopo quello di arrecare danno.',
            'Sono invece vietati gli investimenti compiuti per divertimento, per trollare o senza un valido motivo RP: questi comportamenti sono considerati VDM e vengono sanzionati.',
          ],
        },
        {
          title: 'Pneumatici forati',
          body: [
            'I veicoli con uno o più pneumatici forati non sono obbligati a fermarsi immediatamente: il danno subito è già uno svantaggio significativo.',
            'Se il conducente decide di proseguire con il veicolo danneggiato e provoca incidenti o danni a persone o cose, può andare incontro a conseguenze roleplay più gravi, come l\'aggravamento delle imputazioni o l\'aumento della pena detentiva.',
          ],
        },
        {
          title: 'Scarica di adrenalina',
          body: [
            'In situazioni di forte stress, come inseguimenti o sparatorie, è consentito interpretare una temporanea scarica di adrenalina che permetta al personaggio di continuare l\'azione senza fermarsi subito per ferite o dolori lievi.',
            'Questo principio non vale per ferite gravi o potenzialmente invalidanti e non autorizza comportamenti irrealistici o contrari al roleplay. Al termine dell\'azione, il giocatore deve interpretare in modo coerente le conseguenze delle ferite riportate.',
          ],
        },
      ],
    },
    {
      id: 'multi-pg',
      title: 'Multi-PG',
      articles: [
        {
          title: 'Personaggi separati',
          body: [
            'Chi acquista il doppio PG deve considerare i due personaggi come entità completamente separate.',
            'È severamente vietato trasferire informazioni, conoscenze o collegamenti ottenuti con un personaggio all\'altro (metagame tra personaggi).',
            { note: 'La violazione di questa regola comporta provvedimenti da parte dello staff, fino alla possibile rimozione di uno dei due personaggi.', kind: 'warning' },
          ],
        },
        {
          title: 'Fazioni',
          body: ['Con il doppio PG non è possibile far parte sia di una fazione criminale sia di un ente investigativo o giudiziario.'],
        },
        {
          title: 'Beni e denaro',
          body: [
            'Non è possibile trasferire beni, denaro, proprietà o qualsiasi altro vantaggio da un PG all\'altro.',
            { note: 'Ogni tentativo di aggirare questa regola è una violazione del regolamento e può comportare provvedimenti, fino al possibile wipe del personaggio coinvolto.', kind: 'warning' },
          ],
        },
      ],
    },
    {
      id: 'medici',
      title: 'Medici',
      articles: [
        {
          title: 'Coinvolgimento nelle azioni',
          body: [
            'Il personale medico non è una fazione neutrale e, come ogni altro gruppo presente in città, può essere coinvolto nelle azioni roleplay.',
            'Tuttavia è vietato rapire, ferire o uccidere membri del personale medico senza una valida motivazione IC e senza un adeguato sviluppo della storia. Ogni azione nei loro confronti deve essere giustificata.',
          ],
        },
        {
          title: 'Scene con sparatorie',
          body: ['Nelle scene roleplay che possono includere sparatorie, come una rapina, il personale medico può intervenire in prima linea, ma può anche essere colpito o preso in ostaggio dai rapinatori.'],
        },
        {
          title: 'Controlli e interventi',
          body: ['Se il medico ritiene necessari ulteriori controlli in ospedale o un intervento d\'urgenza, il paziente non può rifiutarsi.'],
        },
        {
          title: 'Cure sotto banco',
          body: [
            'Il personale medico può effettuare cure o fornire medicinali sotto banco, a condizione che il comportamento sia interpretato in modo adeguato in RP.',
            'Se l\'attività viene scoperta, le forze dell\'ordine possono avviare le indagini e procedere con le conseguenze legali, inclusi processi o arresti, se ci sono prove e presupposti sufficienti.',
          ],
        },
      ],
    },
    {
      id: 'assalti',
      title: 'Assalti',
      intro: ['Regole per gli assalti alle centrali, agli uffici amministrativi e alle case fazione.'],
      articles: [
        {
          group: 'Regole generali',
          title: 'Notifica e approvazione',
          body: [
            'Per effettuare un assalto **non** è necessaria l\'approvazione di un ticket, così da permettere azioni furtive e a sorpresa.',
            'È però obbligatorio aprire un ticket di notifica nella sezione management almeno **3 ore** prima dell\'inizio dell\'azione, indicando chiaramente le motivazioni dell\'assalto. Il canale è visibile solo al management e serve a informarlo dell\'evento, per garantire la presenza di almeno uno staffer neutrale.',
          ],
        },
        {
          title: 'Valutazione della direzione',
          body: ['Se, dopo aver letto le motivazioni indicate nel ticket, la direzione le ritiene insufficienti, può annullare l\'azione, ma solo se non è ancora iniziata. In caso contrario, l\'azione è considerata valida.'],
        },
        {
          title: 'Equipaggiamento',
          body: ['Durante gli assalti non ci sono limitazioni su armi e abbigliamento.'],
        },
        {
          title: 'Numero di partecipanti',
          body: ['In qualsiasi tipo di assalto gli assalitori possono essere **al massimo 20**. I difensori non hanno limiti.'],
        },
        {
          title: 'Registrazione video',
          body: [
            'In ogni assalto almeno un assalitore deve registrare un video completo dell\'intera azione. La registrazione deve iniziare quando l\'assalitore e il suo gruppo cominciano a organizzarsi e arrivare fino alla conclusione definitiva dell\'assalto, senza interruzioni né modifiche.',
            'La registrazione deve essere conservata per **48 ore** e messa a disposizione del management per eventuali controlli o verifiche.',
          ],
        },
        {
          title: 'Pianificazione solo in IC',
          body: ['L\'intera fase organizzativa deve svolgersi esclusivamente in IC. È vietato usare canali esterni al gioco (Discord o altre piattaforme) per pianificare, coordinare o preparare l\'azione.'],
        },
        {
          group: 'Assalti alle centrali e agli uffici amministrativi',
          groupNote: 'Per uffici amministrativi si intendono il municipio e tutte le strutture governative.',
          title: 'Unità speciali',
          body: [
            'Chi intende assaltare una centrale deve tenere conto della presenza al suo interno di unità speciali, come la SWAT.',
            'Lo stesso vale per chi intende attaccare gli uffici amministrativi: bisogna tenere conto dell\'intervento di unità speciali.',
            { note: 'Un assalto non organizzato, o svolto in modo superficiale, è considerato no-fear estremo.', kind: 'warning' },
          ],
        },
        {
          title: 'Loot',
          body: ['Negli assalti alle centrali si applicano le [regole sul loot](#art-1-22) del regolamento server. È inoltre consentito sottrarre agli agenti le chiavi delle manette, se necessario ai fini dell\'azione.'],
        },
        {
          title: 'Agenti minimi',
          body: ['Per assaltare una centrale o gli uffici amministrativi è necessaria la presenza di almeno **7** agenti.'],
        },
        {
          group: 'Assalti alle case fazione',
          title: 'Verifica preventiva',
          body: [
            'Prima di assaltare una casa fazione, gli assalitori devono verificare il numero di difensori presenti. L\'assalto è possibile solo se i difensori sono più di **4**.',
            'La verifica serve anche a non effettuare un **offline raid**, cioè un assalto a una casa fazione quasi priva di difensori online.',
            'I metodi di verifica vengono decisi in fase di pianificazione (ad esempio un sorvolo in elicottero o un travestimento da fattorino).',
          ],
        },
        {
          title: 'Esito negativo per i difensori',
          body: [
            'Se l\'assalto ha esito negativo per i difensori, questi possono ritirarsi e cambiare casa fazione. È necessario aprire un ticket **a conclusione dell\'assalto**; la nuova casa fazione sarà operativa dopo **2-4 giorni**.',
          ],
        },
        {
          group: 'In sintesi',
          title: 'Requisiti a confronto',
          body: [
            {
              table: {
                head: ['', 'Centrale / Uffici amministrativi', 'Casa fazione'],
                rows: [
                  ['**Condizione per assaltare**', 'Almeno 7 agenti', 'Più di 4 difensori'],
                  ['**Assalitori**', 'Massimo 20', 'Massimo 20'],
                  ['**Notifica al management**', 'Ticket almeno 3 ore prima', 'Ticket almeno 3 ore prima'],
                  ['**Loot**', 'Regole generali e chiavi delle manette', 'Regole generali'],
                  ['**Registrazione**', 'Obbligatoria, da conservare per 48 ore', 'Obbligatoria, da conservare per 48 ore'],
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'safezone',
      title: 'Safezone',
      articles: [
        {
          title: 'Nessuna zona safe',
          body: ['Nel server non sono presenti zone safe o semi-safe: ogni azione deve tenere conto del luogo in cui viene svolta.'],
        },
        {
          title: 'Luoghi sensibili',
          body: [
            'Le azioni svolte nei seguenti luoghi devono essere ben organizzate:',
            { list: ['Centrale di polizia;', 'Municipio.'] },
            { note: 'In caso contrario sono considerate no-fear estremo.', kind: 'warning' },
          ],
        },
      ],
    },
    {
      id: 'freeroam',
      title: 'Freeroam',
      articles: [
        {
          title: 'Numero di giocatori',
          body: [
            'Per le azioni freeroam non è previsto un numero massimo fisso di giocatori, ma il numero di criminali non può superare quello totale delle forze dell\'ordine in servizio.',
            { note: 'Si considerano tutti i poliziotti presenti, visibili dalla scoreboard, e non solo quelli che intervengono.', kind: 'info' },
          ],
        },
        {
          title: 'Mezzi speciali',
          body: ['I mezzi speciali, come i blindati, possono essere usati solo in situazioni che lo giustificano, ad esempio inseguimenti con veicoli pesanti o conflitti armati con armi di grosso calibro.'],
        },
        {
          title: 'Elicottero',
          body: ['Dopo **10 minuti** consecutivi di inseguimento, le forze dell\'ordine possono usare l\'elicottero.'],
        },
        {
          title: 'Manovre PIT/BOX',
          body: ['La polizia è autorizzata a eseguire manovre PIT/BOX durante gli inseguimenti. Ogni operatore deve valutare le conseguenze delle proprie azioni: eventuali danni a veicoli o persone possono portare a un processo o ad altre conseguenze IC.'],
        },
        {
          title: 'Fine dell\'inseguimento',
          body: ['Un inseguimento è considerato perso quando la polizia perde il sospettato. La polizia può comunque proseguire le indagini.'],
        },
        {
          title: 'Nascondigli e speed unit',
          body: [
            'Durante un inseguimento ci si può nascondere in qualsiasi luogo, tranne quelli che sfruttano qualsiasi tipo di bug.',
            'Qualora un inseguimento dovesse avvenire con l\'utilizzo di una supercar, la polizia può rispondere utilizzando la speed unit.',
          ],
        },
      ],
    },
    {
      id: 'lspd',
      title: 'LSPD',
      articles: [
        {
          title: 'Equipaggiamento',
          body: [
            'Le forze dell\'ordine devono adeguare equipaggiamento e uso delle armi alla situazione, in base al livello di minaccia rappresentato dai criminali.',
            'I criminali non hanno limitazioni specifiche sull\'armamento, fermo restando il rispetto del regolamento roleplay e del buon senso.',
          ],
        },
        {
          title: 'Errori operativi',
          body: ['Le forze dell\'ordine decidono come agire in base alla situazione. In caso di errori operativi che non derivano da violazioni del regolamento, ne subiscono le conseguenze in gioco, senza l\'intervento di uno staffer.'],
        },
        {
          title: 'Corruzione',
          body: [
            'Per essere corrotti non è necessario aprire un ticket. Gli atti di corruzione possono andare da piccole azioni a vere e proprie infiltrazioni.',
            'Se un agente corrotto viene scoperto, si procede con un processo in RP.',
            { note: 'Lo staff si riserva il diritto di intervenire in OOC qualora la corruzione dovesse compromettere l\'equilibrio della fazione.', kind: 'info' },
          ],
        },
      ],
    },
    {
      id: 'locali',
      title: 'Locali',
      articles: [
        {
          title: 'Conto dell\'attività',
          body: ['All\'interno del locale non è possibile prelevare né depositare denaro sul conto dell\'attività.'],
        },
        {
          title: 'Pagamenti e incassi',
          body: [
            {
              table: {
                head: ['Tipo di pagamento', 'Cosa serve', 'Procedura'],
                rows: [
                  ['**Carta**', 'Il POS, da ritirare nell\'apposita sezione della banca', 'L\'importo viene accreditato direttamente sul conto'],
                  ['**Contanti**', 'Il registratore di cassa', 'Il denaro va inserito nel registratore di cassa e portato in banca, quando il proprietario preferisce'],
                ],
              },
            },
          ],
        },
        {
          title: 'Trasporto sicuro',
          body: ['È possibile stipulare un contratto tra attività e agenzia di sicurezza per trasportare il denaro in banca con maggiore sicurezza.'],
        },
        {
          title: 'Autorizzazioni',
          body: ['Ogni attività deve recarsi al comune per ottenere le autorizzazioni e i permessi necessari **entro 2 giorni** dall\'apertura del locale.'],
        },
      ],
    },
    {
      id: 'rapine',
      title: 'Rapine',
      articles: [
        {
          group: 'Regole generali',
          title: 'Tetto massimo di giocatori',
          body: [
            'Nelle rapine vale lo stesso tetto del [freeroam](#freeroam): il numero di criminali non può superare quello totale delle forze dell\'ordine in servizio (visibile dalla scoreboard). I poliziotti possono superare il numero dei criminali di **al massimo 2 unità**.',
            {
              table: {
                head: ['Categoria', 'Limite'],
                rows: [
                  ['**Criminali**', 'Non più delle forze dell\'ordine in servizio'],
                  ['**Poliziotti**', 'Al massimo il numero dei criminali + 2'],
                ],
              },
            },
            { note: 'Si considerano i criminali visti dagli agenti, non quelli effettivamente presenti alla rapina.', kind: 'info' },
          ],
        },
        {
          title: 'Rinforzi',
          body: ['Sia i criminali sia le forze di polizia possono richiedere supporto in qualsiasi momento durante il furto. Se i criminali chiamano rinforzi, il numero massimo di poliziotti viene aggiornato di conseguenza, mantenendo sempre il limite di 2 unità in più rispetto al totale dei criminali coinvolti, rinforzi compresi.'],
        },
        {
          title: 'Agenti minimi',
          body: [
            'Per effettuare un furto è necessario un numero minimo di agenti in servizio:',
            {
              table: {
                head: ['Tipo di furto', 'Agenti minimi'],
                rows: [
                  ['Negozietto', '2'],
                  ['Post locker', '2'],
                  ['NPC', '2'],
                  ['Borse nei veicoli', '2'],
                ],
              },
            },
          ],
        },
        {
          title: 'Veicoli',
          body: ['Non ci sono limitazioni sui veicoli: le forze dell\'ordine si adeguano a quelli dei criminali. Con le supercar è possibile usare la speed unit.'],
        },
        {
          title: 'Negoziazione',
          body: [
            'I criminali devono negoziare per **almeno 2 minuti**: non è possibile iniziare una sparatoria non appena arrivano i poliziotti.',
            'Gli agenti devono fare il possibile per evitare le sparatorie.',
          ],
        },
        {
          title: 'Equipaggiamento',
          body: [
            'L\'equipaggiamento della polizia deve essere proporzionato a quello dei criminali. I criminali non hanno limiti su armi e abbigliamento.',
            'Se i criminali usano armi automatiche, la LSPD può richiedere l\'intervento della SWAT o di altre forze speciali.',
          ],
        },
        {
          title: 'Ostaggi NPC',
          body: ['Se i criminali tengono degli NPC come ostaggi, la polizia deve considerarli veri civili e fare il possibile per salvarli.'],
        },
        {
          title: 'Intervallo tra le rapine',
          body: [
            'Tra una rapina (come negozietti, locali, Fleeca e simili) e la successiva devono passare **30 minuti**. È invece possibile effettuare piccoli furti di seguito.',
            { note: 'Le rapine maggiori (Fleeca, gioielleria, banca centrale e simili) non saranno presenti all\'apertura del server e verranno introdotte a breve con un aggiornamento.', kind: 'info' },
          ],
        },
        {
          group: 'Rapine ai locali',
          title: 'Furti nei locali',
          body: ['È possibile effettuare furti e rapine all\'interno di locali e attività gestite da giocatori. I gestori possono rivolgersi a un\'agenzia di sicurezza privata per ridurre il rischio di essere rapinati.'],
        },
        {
          title: 'Cosa si può rubare',
          body: ['Nelle rapine ai locali è possibile rubare solo il registratore di cassa. Non è possibile far prelevare il denaro dal conto dell\'azienda.'],
        },
      ],
    },
    {
      id: 'rapimenti',
      title: 'Rapimenti e ostaggi',
      articles: [
        {
          title: 'Motivazione del rapimento',
          body: [
            'Il rapimento di un giocatore è un atto estremo e richiede una valida motivazione RP, coerente con la storia dei personaggi. È vietato rapire per divertimento o senza una storia che lo giustifichi.',
            'Se l\'unico motivo è il riscatto, deve esserci una reale difficoltà economica del personaggio, raccontata e mostrata in RP. Per le segnalazioni sono sufficienti gli screenshot.',
          ],
        },
        {
          title: 'Ostaggio come scudo',
          body: ['Usare un ostaggio come scudo per fuggire è consentito, ma non è una motivazione valida per rapinare chi svolge un lavoro non whitelist.'],
        },
        {
          title: 'Trattativa con le forze dell\'ordine',
          body: ['Se i rapitori chiedono un riscatto allo Stato, la contrattazione con le forze dell\'ordine è **obbligatoria**. Quando la questione riguarda gang o privati, le forze dell\'ordine possono essere escluse.'],
        },
        {
          title: 'Durata massima',
          body: [
            {
              table: {
                head: ['Situazione', 'Durata massima'],
                rows: [
                  ['Con contrattazione in corso', '45 minuti'],
                  ['Senza contrattazione', '30 minuti'],
                ],
              },
            },
            'Superati questi limiti, l\'ostaggio deve essere rilasciato oppure la scena deve concludersi con un\'altra soluzione RP.',
          ],
        },
        {
          title: 'Tetti massimi del riscatto',
          body: [
            {
              table: {
                head: ['Categoria', 'Riscatto massimo'],
                rows: [
                  ['Civile', '50.000$'],
                  ['Agente o medico base', '70.000$'],
                  ['Agente o medico graduato', '100.000$'],
                  ['Capo della polizia', '300.000$'],
                  ['Sindaco', '400.000$'],
                ],
              },
            },
            'Per le categorie non elencate (imprenditori, membri di fazioni) vale il tetto previsto per i civili.',
          ],
        },
        {
          title: 'Provenienza del denaro',
          body: [
            'Il denaro del riscatto non può essere generato con il comando give né richiesto allo staff.',
            {
              table: {
                head: ['Chi paga', 'Provenienza del denaro'],
                rows: [
                  ['Stato', 'Conto dello Stato'],
                  ['Privato', 'Denaro del privato'],
                  ['Fazione (gang o mafia)', 'Risparmi della fazione'],
                ],
              },
            },
          ],
        },
        {
          title: 'Trattamento del rapito',
          body: [
            'Al rapito si possono applicare pressioni, minacce credibili e una tortura leggera, purché non disturbante.',
            { note: 'Sono vietate la violenza prolungata, la tortura grave e qualsiasi forma di violenza sessuale.', kind: 'warning' },
          ],
        },
        {
          title: 'Oggetti del rapito',
          body: ['Gli oggetti presi a una persona rapita vanno restituiti al momento del rilascio, salvo valida motivazione RP per tenerli.'],
        },
        {
          title: 'Finti ostaggi',
          body: ['Sono consentiti ostaggi concordati tra giocatori. Se la polizia sospetta che un ostaggio sia finto, decide in quel momento come comportarsi. Se l\'ipotesi si rivela sbagliata, gli agenti coinvolti subiscono un processo in RP.'],
        },
        {
          title: 'Cosa ricorda il rapito',
          body: [
            'Un personaggio ricorda ciò che vive.',
            {
              table: {
                head: ['Situazione', 'Cosa ricorda'],
                rows: [
                  ['Rapito non ucciso', 'Tutto ciò che è accaduto'],
                  ['Non incappucciato (o simile) durante il trasporto', 'Anche il luogo di prigionia'],
                  ['Incappucciato (o simile) durante il trasporto', 'Non ricorda il luogo di prigionia'],
                  ['Morto', 'Si applica l\'[amnesia post-morte](#art-1-20)'],
                ],
              },
            },
          ],
        },
        {
          title: 'Intervento della SWAT',
          body: ['Se la trattativa fallisce o l\'incolumità degli ostaggi è in pericolo, le forze dell\'ordine possono richiedere l\'intervento della SWAT.'],
        },
      ],
    },
    {
      id: 'lavori',
      title: 'Lavori',
      articles: [
        {
          title: 'Più lavori',
          body: ['Un giocatore può lavorare in più attività, whitelist e non, se rispetta i requisiti dei rispettivi bandi e mantiene un comportamento coerente con il ruolo ricoperto.'],
        },
        {
          title: 'Lavori non whitelist',
          body: [
            'Come per i [medici](#medici), non è possibile rapinare chi svolge un lavoro non whitelist senza una valida motivazione.',
            { note: 'Rapire una persona solo per usarla come ostaggio non è una motivazione valida.', kind: 'warning' },
          ],
        },
      ],
    },
    {
      id: 'droghe',
      title: 'Droghe',
      articles: [
        {
          title: 'Coltivazione',
          body: ['Il sistema droghe di Encode Roleplay non prevede un punto di raccolta fisso, ma una coltivazione dinamica.'],
        },
        {
          title: 'Vendita autorizzata',
          body: ['In game sono disponibili diversi locali autorizzati alla vendita. Se vengono scoperti a commettere illeciti, il sindaco può revocare l\'autorizzazione all\'attività.'],
        },
      ],
    },
    {
      id: 'permadeath',
      title: 'Permadeath',
      articles: [
        {
          title: 'Procedura',
          body: [
            {
              steps: [
                'Aprire un ticket nella categoria corretta sul nostro Discord, fornendo tutte le motivazioni.',
                'Attendere l\'accettazione: solo dopo si può procedere con il permadeath.',
                'Durante l\'azione sarà presente uno staffer in modalità spectator, che confermerà se tutto è stato eseguito correttamente.',
              ],
            },
          ],
        },
        {
          title: 'Dopo il permadeath',
          body: ['Dopo un permadeath non è più possibile accedere con quel personaggio, che viene eliminato subito dopo.'],
        },
      ],
    },
    {
      id: 'mafie-gang',
      title: 'Mafie e gang',
      articles: [
        {
          title: 'Limite di membri',
          body: [
            {
              table: {
                head: ['Fazione', 'Membri massimi'],
                rows: [
                  ['Mafia', '25'],
                  ['Gang', '15'],
                ],
              },
            },
          ],
        },
        {
          title: 'Reputazione',
          body: ['Non esistono fazioni criminali intoccabili: la reputazione si costruisce in game, gradualmente.'],
        },
        {
          title: 'Discrezione delle mafie',
          body: ['Le mafie devono fare il possibile per restare nascoste e non farsi conoscere dalle forze dell\'ordine.'],
        },
        {
          title: 'Conflitti tra fazioni',
          body: ['Se una fazione criminale vuole attaccarne un\'altra, valgono le regole del capitolo [Assalti](#assalti), in particolare quelle sugli [assalti alle case fazione](#art-5-10).'],
        },
        {
          title: 'Storia della fazione',
          body: ['Ogni fazione deve avere una storia, che deve essere sempre rispettata. I vertici devono prendere decisioni e compiere azioni coerenti con lo stile roleplay della storia scelta (ad esempio, una fazione basata su una famiglia messicana agisce secondo quello stile).'],
        },
        {
          title: 'Territorio',
          body: [
            'Se qualcuno entra nel territorio di una fazione criminale, la fazione può sparare liberamente solo se si tratta di altre fazioni o della polizia.',
            'Per i civili valgono le regole ordinarie (vedi [Avvio delle azioni ostili](#art-1-26)). In ogni caso restano validi il buon senso e le conseguenze in RP delle proprie azioni.',
          ],
        },
      ],
    },
    {
      id: 'warn',
      title: 'Warn e sanzioni',
      articles: [
        {
          group: 'Escalation delle sanzioni',
          title: 'Warn e last chance',
          body: [
            'I warn 1, 2 e 3 possono essere rimossi dallo staff, a sua discrezione, a partire da **7 giorni** dopo l\'assegnazione.',
            'Al raggiungimento di 3 warn, lo staff decide a sua discrezione se assegnare il last chance o il ban di 24 ore. Il last chance è un ultimo avvertimento: il giocatore resta a 3 warn e alla prossima infrazione riceve il ban di 24 ore.',
          ],
        },
        {
          title: 'Ban progressivi',
          body: [
            'Dopo i 3 warn, ogni nuova infrazione commessa entro il tempo indicato comporta un ban più lungo del precedente:',
            {
              table: {
                head: ['Sanzione attuale', 'Se commetti un\'altra infrazione', 'Ricevi'],
                rows: [
                  ['3 warn (o last chance)', 'Entro la rimozione del richiamo da parte dello staff', 'Ban di 24 ore'],
                  ['Ban di 24 ore', 'Entro 1 mese dalla fine del ban', 'Ban di 7 giorni'],
                  ['Ban di 7 giorni', 'Entro 2 mesi dalla fine del ban', '**Ban permanente**'],
                ],
              },
            },
            'Se passa più tempo di quello indicato senza nuove infrazioni, il ban si azzera (vedi sotto).',
          ],
        },
        {
          title: 'Azzeramento dei ban',
          body: [
            'Se dopo un ban non commetti nuove infrazioni per un certo periodo, il ban viene cancellato dal tuo storico e non conta più per i ban progressivi. Il periodo parte dal momento in cui il ban scade, non da quando è stato assegnato:',
            {
              table: {
                head: ['Ban scontato', 'Periodo senza infrazioni', 'Cosa succede'],
                rows: [
                  ['24 ore', '1 mese dalla fine del ban', 'Il ban si azzera'],
                  ['7 giorni', '2 mesi dalla fine del ban', 'Il ban si azzera'],
                ],
              },
            },
            'Una volta azzerato il ban, il giocatore riparte dal conteggio dei warn, da warn 1. Se invece commette una nuova infrazione prima che il periodo sia trascorso, scatta la sanzione successiva indicata nella tabella dei [ban progressivi](#art-16-2).',
          ],
        },
        {
          title: 'Infrazioni gravi',
          body: [
            'Le azioni gravi, come trolling pesante, cheating e molestie, comportano direttamente il **ban permanente**, senza passare dai warn.',
          ],
        },
        {
          group: 'Contestare un warn',
          title: 'Rivalutazione',
          body: [
            'È possibile chiedere la rivalutazione di un warn **entro 7 giorni** dall\'assegnazione, aprendo un ticket. La richiesta viene valutata da uno staffer diverso da quello che ha assegnato il warn.',
            { note: 'La rivalutazione non è disponibile per tutti i warn: solo se si ritiene che lo staffer abbia sbagliato, oppure se emergono nuove prove a propria difesa.', kind: 'info' },
          ],
        },
        {
          title: 'Rimozione dopo un mese',
          body: ['Dopo un mese dal ricevimento di un warn è possibile aprire un ticket per chiederne la rimozione, perché lo staffer che lo ha assegnato potrebbe non essere più presente. La richiesta viene valutata dallo staffer che ha assegnato il warn oppure da un moderatore o un admin.'],
        },
        {
          title: 'Tempi a confronto',
          body: [
            {
              table: {
                head: ['Richiesta', 'Quando', 'Chi valuta'],
                rows: [
                  ['Rimozione dei warn 1, 2 e 3', 'Da 7 giorni dall\'assegnazione', 'Lo staff, a sua discrezione'],
                  ['Rivalutazione', 'Entro 7 giorni', 'Uno staffer diverso da quello che ha assegnato il warn'],
                  ['Rimozione tramite ticket', 'Dopo 1 mese', 'Chi ha assegnato il warn, oppure un moderatore o un admin'],
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}
