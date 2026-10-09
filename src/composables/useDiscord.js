import { reactive, onMounted } from 'vue'
import { site } from '../config'

// Legge i dati pubblici del server Discord:
// - invito (con conteggi): nome, icona, membri totali, online
// - widget.json (se il widget è attivo): avatar online e canali vocali
// Se qualcosa non risponde la card mostra comunque nome e bottone.
export function useDiscord() {
  const state = reactive({
    loaded: false,
    name: site.name,
    icon: '/icon-512.png',
    members: null,
    online: null,
    avatars: [],
    voice: [],
  })

  onMounted(async () => {
    let guildId = site.discordGuildId

    if (site.discordInvite) {
      try {
        const res = await fetch(`https://discord.com/api/v10/invites/${site.discordInvite}?with_counts=true`)
        if (res.ok) {
          const d = await res.json()
          state.name = d.guild?.name ?? state.name
          if (d.guild?.icon) state.icon = `https://cdn.discordapp.com/icons/${d.guild.id}/${d.guild.icon}.png?size=128`
          state.members = d.approximate_member_count ?? null
          state.online = d.approximate_presence_count ?? null
          guildId ||= d.guild?.id
        }
      } catch { /* invito non valido o rete assente */ }
    }

    if (guildId) {
      try {
        const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`)
        if (res.ok) {
          const w = await res.json()
          state.online ??= w.presence_count
          state.avatars = (w.members ?? []).slice(0, 7).map((m) => ({
            id: m.id, name: m.username, src: m.avatar_url, status: m.status,
          }))
          state.voice = (w.channels ?? []).sort((a, b) => a.position - b.position).slice(0, 3).map((c) => c.name)
        }
      } catch { /* widget disattivato */ }
    }

    state.loaded = true
  })

  return state
}
