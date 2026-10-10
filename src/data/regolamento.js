// Testo del regolamento. Per modificarlo basta aggiornare questo file.
//
// Ogni capitolo ha un `id` (usato nei link, es. regolamento.encoderp.it/#generale),
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
//   { map: { ... } }                     mappa con luoghi evidenziati (vedi capitolo Safezone)

export const rules = {
  title: 'Regolamento',
  subtitle: 'Regolamento generale del server Encode Roleplay',
  version: '1.0',
  updated: '2026-10-10',
  // Mostra l'etichetta "Bozza" finché il testo non è approvato dallo staff
  draft: true,

  // Mostrati nell'apertura della pagina
  intro: [
    'La nostra filosofia è semplice: meno costrizioni, più immersione.',
    'Le regole esistono per garantire rispetto, coerenza e qualità del roleplay, non per limitare l\'immaginazione.',
  ],

  sections: [
    {
      id: 'generale',
      title: 'Regolamento generale',
      articles: [
        {
          title: 'Powergame',
          body: ['Consiste nel compiere atti umanamente impossibili, nonostante la fisica di GTA li renda possibili.'],
        },
        {
          title: 'RDM (Random Deathmatch)',
          body: [
            'Uccidere o ferire un player senza un motivo roleplay.',
            'È vietato provocare un player al solo scopo di scatenare una sparatoria.',
          ],
        },
        {
          title: 'VDM (Vehicle Deathmatch)',
          body: ['Uccidere o ferire un player con un veicolo senza un motivo roleplay.'],
        },
        {
          title: 'Fail RP',
          body: ['Comportamenti che rompono l\'immersione o la coerenza RP (ad esempio ignorare ferite gravi o avere reazioni irrealistiche).'],
        },
        {
          title: 'Metagame',
          body: ['Usare informazioni esterne al gioco (chat OOC, stream) per influenzare decisioni IC.'],
        },
        {
          title: 'No-Fear',
          body: ['Rifiutarsi di mostrare paura o reazioni plausibili in situazioni RP minacciose.'],
        },
        {
          title: 'Revenge Kill',
          body: ['Uccidere per vendetta fuori da un contesto RP adeguato.'],
        },
        {
          title: 'Combat log / Slog',
          body: [
            'Uscire dal server durante un\'azione per sfuggire a una situazione di svantaggio, oppure entrare in gioco sapendo che è in corso un\'azione, per avvantaggiare la propria fazione.',
            { note: 'L\'utilizzo del comando **/logout** durante un\'azione verrà considerato combat log.', kind: 'warning' },
          ],
        },
        {
          title: 'Bug abusing',
          body: ['Sfruttare a proprio vantaggio un bug, un errore di gioco o un glitch.'],
        },
        {
          title: 'Bunny hop',
          body: ['Sfruttare salti o movimenti per ottenere vantaggi ingiusti in combattimento o per muoversi in modo non realistico.'],
        },
        {
          title: 'Cop baiting',
          body: ['Provocare intenzionalmente la polizia per ottenere una reazione senza un motivo RP valido.'],
        },
        {
          title: 'Mix chat',
          body: ['Mescolare chat IC e OOC o usare i canali sbagliati per scopi non appropriati.'],
        },
        {
          title: 'Linguaggio',
          body: ['Uso di linguaggio offensivo, discriminatorio o di molestie, sia OOC sia IC, che violino le regole del server.'],
        },
        {
          title: 'Cheating',
          body: ['È vietato l\'utilizzo di software o di qualunque programma di cheating.'],
        },
        {
          title: 'Trolling',
          body: ['Sono vietati **tutti** gli atteggiamenti troll.'],
        },
        {
          title: 'Tossicità',
          body: [
            'Nel server non sono ammessi atti di tossicità. Non saranno tollerati litigi, insulti o discussioni in OOC derivanti da eventi accaduti in RP e non.',
            'Qualora fosse necessario chiarire una situazione, il confronto dovrà avvenire in modo civile e rispettoso.',
          ],
        },
        {
          title: 'Ferite e incoscienza',
          body: [
            'Qualora un giocatore venga atterrato, è obbligato a interpretare in modo realistico il dolore e le conseguenze delle ferite riportate.',
            'Se il personaggio è incosciente, non potrà parlare né comunicare in alcun modo.',
            { note: 'In caso di morte a causa di un bug è concesso chiedere il ress tramite report.', kind: 'info' },
          ],
        },
        {
          title: 'Clip durante le assistenze',
          body: [
            'Affinché una clip possa essere considerata valida durante un\'assistenza, dovrà essere integra e priva di tagli o modifiche.',
            'Inoltre, dovrà includere l\'audio del gioco (desktop) e l\'audio del giocatore che effettua la registrazione.',
          ],
        },
        {
          title: 'Lavori whitelist',
          body: ['Un giocatore può svolgere più lavori whitelist, purché soddisfi i requisiti previsti dai rispettivi bandi e mantenga un comportamento coerente con il ruolo ricoperto.'],
        },
        {
          title: 'Loot',
          body: [
            'Le azioni a scopo di loot sono severamente vietate.',
            'Durante qualsiasi tipo di azione sarà consentito effettuare il loot, in caso di necessità, esclusivamente di:',
            { list: ['munizioni;', 'cibo e acqua;', 'bende.'] },
          ],
        },
        {
          title: 'Contenuti audio',
          body: ['È vietata la riproduzione di contenuti audio, incluse canzoni o tracce musicali, che possano risultare offensivi, discriminatori, estremisti, eccessivamente volgari o comunque contrari al regolamento delle varie piattaforme di streaming.'],
        },
        {
          title: 'Riferimenti fuori dal gioco',
          body: [
            'Durante qualsiasi azione IC è severamente vietato utilizzare termini o riferimenti che richiamino lo staff, Discord, ticket, assistenze o qualsiasi elemento fuori dal gioco.',
            'Eventuali problemi tecnici o situazioni che richiedano un intervento esterno dovranno essere gestiti tramite gli appositi canali di assistenza e il sistema di report.',
            'Solo in caso di necessità, e qualora ci si trovi in un luogo isolato lontano da altre scene RP, sarà consentito uscire temporaneamente dal personaggio per il tempo strettamente necessario a risolvere il problema.',
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
            'Qualora un player investa altri giocatori durante un\'azione roleplay (ad esempio per aprirsi una via di fuga o durante un inseguimento), l\'azione non sarà considerata VDM, purché sia coerente con il contesto RP e non abbia come unico scopo quello di arrecare danno.',
            'Sono invece vietati gli investimenti effettuati esclusivamente per divertimento, per trollare o senza un valido motivo RP: questi comportamenti saranno considerati VDM e sanzionati.',
          ],
        },
        {
          title: 'Pneumatici forati',
          body: [
            'I veicoli che subiscono la foratura di uno o più pneumatici non sono obbligati a fermarsi immediatamente: il danno subito costituisce già uno svantaggio significativo.',
            'Se il conducente, scegliendo di proseguire con un veicolo danneggiato, provoca incidenti o danni a persone o cose, queste azioni potranno comportare conseguenze roleplay più gravi, come un aggravamento delle imputazioni o un aumento della pena detentiva.',
          ],
        },
        {
          title: 'Scarica di adrenalina',
          body: [
            'Durante situazioni di forte stress, come inseguimenti o sparatorie, è consentito interpretare una temporanea scarica di adrenalina che permetta al personaggio di continuare l\'azione senza fermarsi subito per lievi ferite o dolori.',
            'Questo principio non giustifica l\'ignorare ferite gravi o potenzialmente invalidanti, né autorizza comportamenti irrealistici o contrari al roleplay. Al termine dell\'azione il giocatore dovrà interpretare in modo coerente le conseguenze delle lesioni riportate.',
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
            'Qualora un giocatore scelga di acquistare il doppio PG, dovrà considerare i due personaggi come entità completamente separate.',
            'È severamente vietato trasferire informazioni, conoscenze o collegamenti ottenuti con un personaggio all\'altro (metagaming tra personaggi).',
            { note: 'La violazione di questa regola comporterà provvedimenti da parte dello staff, fino alla possibile rimozione di uno dei personaggi.', kind: 'warning' },
          ],
        },
        {
          title: 'Fazioni',
          body: ['Con il doppio PG non è possibile far parte sia di una fazione criminale sia di un ente investigativo o giudiziario.'],
        },
        {
          title: 'Beni e denaro',
          body: [
            'Non è possibile trasferire beni, denaro, proprietà o qualsiasi altro tipo di vantaggio da un PG all\'altro.',
            { note: 'Qualsiasi tentativo di aggirare questa regola verrà considerato una violazione del regolamento e potrà comportare provvedimenti, fino al possibile wipe del personaggio coinvolto.', kind: 'warning' },
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
            'Il personale medico non è considerato una fazione neutrale e, come ogni altro gruppo presente in città, può essere coinvolto nelle azioni roleplay.',
            'Tuttavia, è vietato rapire, ferire o uccidere membri del personale medico senza una valida motivazione IC e senza un adeguato sviluppo della storia. Ogni azione nei loro confronti dovrà essere giustificata.',
          ],
        },
        {
          title: 'Scene con sparatorie',
          body: ['Durante scene roleplay che possono includere sparatorie, come per esempio una rapina, il corpo medico può intervenire in prima linea, ma allo stesso tempo potrà essere colpito o preso in ostaggio dai rapinatori.'],
        },
        {
          title: 'Controlli e interventi',
          body: ['Se il medico ritiene che siano necessari ulteriori controlli in ospedale e/o un intervento d\'urgenza, il paziente non potrà rifiutarsi.'],
        },
        {
          title: 'Cure sotto banco',
          body: [
            'È consentito al personale medico effettuare cure o fornire medicinali sotto banco, a condizione che questo comportamento venga adeguatamente interpretato in RP.',
            'Qualora l\'attività venga scoperta, le forze dell\'ordine potranno avviare le opportune indagini e procedere con eventuali conseguenze legali, inclusi processi o arresti, qualora sussistano le prove e i presupposti necessari.',
          ],
        },
      ],
    },
    {
      id: 'assalti',
      title: 'Assalti',
      intro: ['Assalti alle centrali delle forze dell\'ordine e alle case delle fazioni criminali.'],
      articles: [
        {
          title: 'Notifica dell\'assalto',
          body: [
            'Per effettuare un assalto **non** è necessario ottenere un ticket di approvazione, così da mantenere la possibilità di organizzare assalti furtivi e azioni a sorpresa.',
            'È però obbligatorio aprire un ticket di notifica nella sezione dedicata agli assalti almeno **10 minuti** prima dell\'inizio dell\'azione. Il canale è visibile solo al management e serve a informarlo dell\'evento e a consentire la presenza di almeno uno staffer neutrale.',
          ],
        },
        {
          title: 'Motivazione',
          body: [
            'Ogni assalto a una centrale o a una casa fazione dovrà essere supportato da una valida motivazione IC: non saranno tollerate azioni prive di motivazione.',
            'Qualora la motivazione non risulti chiara o sufficientemente evidente, lo staff potrà chiedere chiarimenti all\'organizzatore. La verifica avverrà esclusivamente al termine dell\'azione, senza interferire con il normale svolgimento della scena.',
          ],
        },
        {
          title: 'Armi e indumenti',
          body: ['Durante gli assalti non ci sono limitazioni di armi o indumenti.'],
        },
        {
          title: 'Registrazione obbligatoria',
          body: [
            'Durante ogni assalto è obbligatorio che almeno un assalitore registri un video completo dell\'intera azione: dal momento in cui l\'assalitore e il suo gruppo iniziano a organizzarsi fino alla conclusione definitiva dell\'assalto, senza interruzioni o modifiche.',
            'La registrazione dovrà essere conservata per **48 ore** e resa disponibile al management in caso di controllo o verifica dell\'accaduto.',
          ],
        },
        {
          title: 'Organizzazione in IC',
          body: ['L\'intera fase organizzativa dell\'assalto dovrà svolgersi esclusivamente in IC. È vietato utilizzare canali esterni al gioco, come Discord o altre piattaforme di comunicazione, per pianificare, coordinare o preparare l\'azione.'],
        },
        {
          title: 'Centrali: reparti speciali',
          body: [
            'Una fazione che decide di assaltare una centrale dovrà tenere in considerazione la presenza di reparti speciali (come la SWAT) all\'interno della centrale stessa.',
            { note: 'Qualsiasi assalto non organizzato o svolto in modo superficiale verrà considerato no-fear estremo.', kind: 'warning' },
          ],
        },
        {
          title: 'Centrali: loot',
          body: ['Durante gli assalti alle centrali si applica la regola generale sul loot dei giocatori. In aggiunta, sarà consentito sottrarre agli agenti delle forze dell\'ordine le chiavi delle manette, se necessario ai fini dell\'azione.'],
        },
        {
          title: 'Centrali: agenti minimi',
          body: ['Per assaltare una centrale devono essere presenti almeno **7** membri delle forze dell\'ordine.'],
        },
        {
          title: 'Case fazioni',
          body: [
            'Per poter assaltare una casa fazione, le forze dell\'ordine dovranno prima verificare il numero di criminali presenti: l\'assalto sarà possibile solo se sono presenti più di **5** membri.',
            'I metodi per contare i criminali vengono decisi durante la pianificazione dell\'assalto (per esempio si può usare un elicottero oppure fingersi un fattorino delle pizze).',
          ],
        },
      ],
    },
    {
      id: 'safezone',
      title: 'Safezone',
      articles: [
        {
          title: 'Nessuna zona semi-safe',
          body: ['Nel server non sono presenti zone semi-safe: ogni azione dovrà tenere in considerazione il luogo in cui ci si trova.'],
        },
        {
          title: 'Nelle zone safe',
          body: ['All\'interno di una zona safe è vietato avviare qualsiasi tipo di azione. Allo stesso tempo, non è consentito utilizzare le zone safe come riparo.'],
        },
        {
          title: 'Elenco delle zone safe',
          body: [
            'Le zone safe sono:',
            { list: ['Garage centrale', 'Punto di spawn'] },
            {
              map: {
                title: 'Mappa delle zone safe',
                image: '/img/mappa-gta.webp',
                // Area del mondo coperta dall'immagine (coordinate di gioco).
                // Mappa Atlas da github.com/meesvrh/GTAV-Map-Tiles, ritagliata
                bounds: { x: [-3972, 5198], y: [-3888, 8185] },
                // Inquadrature in rapporto 5:4
                views: [
                  { id: 'ls', label: 'Los Santos', x: [-1950, 1350], y: [-1800, 840] },
                  { id: 'all', label: 'Tutta la mappa', x: [-6933, 8159], y: [-3888, 8185] },
                ],
                kinds: {
                  garage: { label: 'Garage centrale', icon: 'car', color: 'blue' },
                  spawn: { label: 'Punto di spawn', icon: 'pin', color: 'green' },
                },
                // Posizioni in coordinate di gioco (x, y), come da /coords o vMenu
                places: [
                  { kind: 'garage', name: 'Garage centrale', x: 215, y: -810 },
                  { kind: 'spawn', name: 'Punto di spawn', x: -269, y: -955 },
                ],
              },
            },
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
          body: ['Non è previsto un numero massimo di giocatori per le azioni freeroam.'],
        },
        {
          title: 'Mezzi speciali',
          body: ['L\'utilizzo di mezzi speciali, come i blindati, è consentito esclusivamente in situazioni che ne giustifichino l\'impiego, come inseguimenti che riguardano veicoli pesanti o conflitti armati con armi di grosso calibro.'],
        },
        {
          title: 'Elicottero',
          body: ['Dopo **10 minuti** consecutivi di inseguimento sarà consentito l\'impiego dell\'elicottero da parte delle forze dell\'ordine.'],
        },
        {
          title: 'Manovre PIT/BOX',
          body: ['La polizia è autorizzata a effettuare manovre PIT/BOX durante gli inseguimenti. Ogni operatore dovrà tenere conto delle possibili conseguenze delle proprie azioni: eventuali danni causati a veicoli o persone potranno portare a un processo o ad altre conseguenze IC.'],
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
            'Le forze dell\'ordine dovranno adeguare il proprio equipaggiamento e l\'utilizzo delle armi alla situazione, tenendo conto del livello di minaccia rappresentato dai criminali.',
            'I criminali, invece, non avranno limitazioni specifiche sull\'armamento, fermo restando il rispetto del regolamento generale e del buon senso RP.',
          ],
        },
        {
          title: 'Errori operativi',
          body: ['Le forze dell\'ordine decidono come agire in base alla situazione che si trovano davanti. In caso di errori operativi non derivanti da violazioni del regolamento, se ne subiranno le conseguenze in gioco, senza l\'intervento di uno staffer.'],
        },
      ],
    },
    { id: 'rapine', title: 'Rapine', pending: true, articles: [] },
    { id: 'droghe', title: 'Droghe', pending: true, articles: [] },
    { id: 'permadeath', title: 'Permadeath', pending: true, articles: [] },
    { id: 'elicotteri', title: 'Elicotteri', pending: true, articles: [] },
  ],
}
