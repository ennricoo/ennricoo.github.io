// Calendario eventi. Per un nuovo mese basta aggiornare questo file.
//
// variant:  'launch'  evento principale (card blu piena)
//           'inaug'   inaugurazione (bordo blu)
//           'hw'      Halloweek, evento (card arancione piena)
//           'hw-dark' Halloweek, evento serale (bordo arancione)
//           ometti per un giorno libero
// messa:    true | false | 'testo personalizzato'
//           se omesso si calcola da `messa.days`

export const calendar = {
  year: 2026,
  month: 10, // 1-12
  title: 'Ottobre',
  startDay: 17, // primo giorno mostrato

  messa: {
    label: 'Messa',
    days: [0, 1, 4, 6], // dom, lun, gio, sab
    daysLabel: 'Dom, lun, gio, sab',
    time: '21:30',
    timeRange: '21:30 – 22:00',
    from: 17,
  },

  events: {
    17: { title: 'Apertura libera', sub: 'Esplora il server', time: 'Ore 15:00', variant: 'launch' },
    18: { title: 'Centrale di Polizia', sub: 'Inaugurazione e discorso del sindaco', variant: 'inaug' },
    19: { title: 'Ospedale', sub: 'Inaugurazione', variant: 'inaug' },
    20: { title: 'Autodromo', sub: 'Inaugurazione e giri liberi', variant: 'inaug' },
    21: { title: 'Locali', sub: 'Inaugurazione', variant: 'inaug' },
    26: { title: 'Inizio Halloweek', sub: 'Decorazioni a tema', variant: 'hw' },
    29: { title: 'Festa in maschera', sub: 'Ti aspettiamo!', note: 'Dalle 19, aree a tema sparse per tutta la mappa', variant: 'hw', messa: false },
    30: { title: 'Dolcetto o scherzetto', sub: 'Guardati le spalle…', note: 'Dalle 19, aree a tema sparse per tutta la mappa', variant: 'hw-dark' },
    31: { title: 'Dolcetto o scherzetto', sub: 'Guardati le spalle…', note: 'Dalle 19, aree a tema sparse per tutta la mappa', variant: 'hw-dark', badge: 'Finale', messa: 'Messa di Halloween' },
  },

  period: { label: 'Halloweek', from: 26, to: 31 },

  warning: {
    title: 'Avviso importante',
    subtitle: 'Contenuti imprevedibili',
    days: [29, 30, 31],
  },

  footnote: 'Gli orari precisi verranno comunicati pochi giorni prima dell\'evento.',
}

// Le tre card in evidenza (home e pagina eventi)
export const highlights = [
  { date: 'Sab 17 · 15:00', title: 'Apertura libera', text: 'Esplora il server.', kind: 'main' },
  { date: '18 – 21 ott', title: 'Inaugurazioni', text: 'Centrale di Polizia, Ospedale, Autodromo, Locali.' },
  { date: '26 – 31 ott', title: 'Halloweek', text: 'Festa in maschera e dolcetto o scherzetto.', kind: 'hw' },
]
