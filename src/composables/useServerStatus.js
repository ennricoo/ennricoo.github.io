import { ref, onMounted } from 'vue'
import { site } from '../config'

// Legge i giocatori online dall'API pubblica Cfx.
// Se cfxCode non è impostato o la richiesta fallisce, status resta "unknown".
export function useServerStatus() {
  const status = ref('unknown') // unknown | online | offline
  const players = ref(0)
  const maxPlayers = ref(0)

  onMounted(async () => {
    if (!site.cfxCode) return
    try {
      const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${site.cfxCode}`)
      if (!res.ok) throw new Error(res.status)
      const { Data } = await res.json()
      players.value = Data.clients ?? 0
      maxPlayers.value = Data.sv_maxclients ?? Data.svMaxclients ?? 0
      status.value = 'online'
    } catch {
      status.value = 'offline'
    }
  })

  return { status, players, maxPlayers }
}
