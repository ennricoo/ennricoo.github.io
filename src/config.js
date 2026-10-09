// Impostazioni del sito: modifica qui link e dati del server.
export const site = {
  name: 'Encode Roleplay',

  // Link mostrato su tutti i bottoni Discord
  discordUrl: 'https://discord.encoderp.it/',

  // Codice di un invito Discord SENZA scadenza (la parte dopo discord.gg/).
  // Serve alla card Discord per leggere nome, icona, membri e online.
  discordInvite: 'BVpXH7WbMP',

  // ID del server Discord (facoltativo, si ricava dall'invito).
  // Per avatar e canali vocali attiva: Impostazioni server > Widget > "Abilita widget".
  discordGuildId: '',

  // Apertura (ora italiana)
  opening: '2026-10-17T15:00:00+02:00',

  // Codice server Cfx (cfx.re/join/<codice>): mostra i giocatori in città.
  cfxCode: '',
}

// Immagini in public/img (generate con `npm run images`)
export const img = (name) => ({
  src: `/img/${name}-1920.webp`,
  srcset: `/img/${name}-960.webp 960w, /img/${name}-1920.webp 1920w`,
})
