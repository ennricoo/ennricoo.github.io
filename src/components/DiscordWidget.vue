<script setup>
import { ref, computed, watch } from 'vue'
import { Volume2, ArrowRight } from 'lucide-vue-next'
import DiscordIcon from './DiscordIcon.vue'
import { site } from '../config'
import { useDiscord } from '../composables/useDiscord'

const dc = useDiscord()
const fmt = (n) => new Intl.NumberFormat('it-IT').format(n)
const isLive = computed(() => dc.online > 0)

// Numeri che salgono da 0 quando arrivano i dati
const shownOnline = ref(0)
const shownMembers = ref(0)
const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
function countTo(target, out) {
  if (target == null) return
  if (reduce) { out.value = target; return }
  const t0 = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1300)
    out.value = Math.round(target * (1 - Math.pow(1 - k, 3)))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
watch(() => dc.online, (v) => countTo(v, shownOnline), { immediate: true })
watch(() => dc.members, (v) => countTo(v, shownMembers), { immediate: true })

// Online oltre agli avatar mostrati
const others = computed(() => (dc.online ? Math.max(0, dc.online - dc.avatars.length) : 0))
</script>

<template>
  <article class="dc" aria-label="Server Discord di Encode Roleplay">
    <header class="dc-top">
      <span class="dc-logo" aria-hidden="true"><DiscordIcon /></span>
      <div class="dc-id">
        <p class="dc-name">Discord</p>
        <p class="dc-kind">{{ dc.name }}</p>
      </div>
      <span v-if="isLive" class="dc-live"><span class="dot dot--pulse" aria-hidden="true"></span>Live</span>
    </header>

    <dl v-if="dc.online !== null || dc.members !== null" class="dc-stats">
      <div v-if="dc.online !== null">
        <dt><span class="dot" aria-hidden="true"></span>Giocatori online</dt>
        <dd>{{ fmt(shownOnline) }}</dd>
      </div>
      <div v-if="dc.members !== null">
        <dt><span class="dot dot--grey" aria-hidden="true"></span>Giocatori totali</dt>
        <dd>{{ fmt(shownMembers) }}</dd>
      </div>
    </dl>

    <div v-if="dc.avatars.length" class="dc-people">
      <ul class="dc-avatars">
        <li v-for="a in dc.avatars" :key="a.id">
          <img :src="a.src" :alt="a.name" width="34" height="34" loading="lazy" />
          <span class="st" :class="`st--${a.status}`" aria-hidden="true"></span>
        </li>
        <li v-if="others" class="dc-more">+{{ fmt(others) }}</li>
      </ul>
      <span class="dc-caption">Ora nel server</span>
    </div>

    <ul v-if="dc.voice.length" class="dc-voice" aria-label="Canali vocali">
      <li v-for="v in dc.voice" :key="v"><Volume2 :size="14" aria-hidden="true" />{{ v }}</li>
    </ul>

    <a :href="site.discordUrl" target="_blank" rel="noopener" class="btn btn-blue dc-join">
      <DiscordIcon /> Unisciti al server <ArrowRight :size="16" aria-hidden="true" />
    </a>
  </article>
</template>

<style scoped>
/* Stesso linguaggio dei riquadri del sito: fondo neutro, bordo sottile */
.dc {
  width: 100%;
  max-width: 440px;
  padding: clamp(22px, 2.6vw, 30px);
  border-radius: var(--radius-lg);
  background: #0a0b0e;
  box-shadow: inset 0 0 0 1px var(--line), 0 40px 80px -40px rgba(0, 0, 0, 0.9);
}

.dc-top { display: flex; align-items: center; gap: 14px; }
/* Logo ufficiale Discord su fondo blurple */
.dc-logo {
  flex: none;
  width: 52px; height: 52px;
  display: grid; place-items: center;
  border-radius: 16px;
  background: #5865f2;
  color: #fff;
  box-shadow: 0 10px 30px -10px rgba(88, 101, 242, 0.7);
}
.dc-logo svg { width: 28px; height: 28px; }
.dc-id { min-width: 0; }
.dc-name { font-weight: 800; font-size: 1.35rem; letter-spacing: -0.03em; line-height: 1.1; }
.dc-kind {
  margin-top: 4px;
  font-size: 0.85rem;
  color: var(--text-3);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dc-live, .dc-stats dt, .dc-caption {
  font-family: var(--font-brand);
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-3);
}
.dc-live {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  color: #b8f5c8;
  box-shadow: inset 0 0 0 1px rgba(52, 199, 89, 0.4);
}

.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); display: inline-block; flex: none; }
.dot--grey { background: #6e6e73; }
.dot--pulse { animation: ping 2s var(--ease-out) infinite; }
@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.7); }
  70%, 100% { box-shadow: 0 0 0 8px rgba(52, 199, 89, 0); }
}

/* Numeri grandi, come il resto del sito */
.dc-stats {
  display: grid;
  margin-top: 26px;
  border-top: 1px solid var(--line);
}
.dc-stats > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.dc-stats dt { display: flex; align-items: center; gap: 10px; }
.dc-stats dd {
  font-size: clamp(2.6rem, 2rem + 1.6vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(180deg, #ffffff 0%, #d9dce3 50%, #7d818c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Persone */
.dc-people { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
.dc-avatars { list-style: none; padding: 0; display: flex; }
.dc-avatars li { position: relative; margin-left: -9px; transition: transform 0.3s var(--ease-out); }
.dc-avatars li:first-child { margin-left: 0; }
@media (hover: hover) { .dc-avatars li:hover { transform: translateY(-3px); z-index: 1; } }
.dc-avatars img { width: 34px; height: 34px; border-radius: 50%; border: 2px solid #0a0b0e; background: #222; }
.dc-more {
  display: grid; place-items: center;
  height: 34px; min-width: 34px;
  padding: 0 8px;
  border-radius: 999px;
  border: 2px solid #0a0b0e;
  background: #17191e;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-2);
}
.st { position: absolute; right: -1px; bottom: -1px; width: 11px; height: 11px; border-radius: 50%; border: 2px solid #0a0b0e; background: var(--green); }
.st--idle { background: #f0b232; }
.st--dnd { background: #f23f43; }
.dc-caption { margin-left: auto; text-align: right; }

.dc-voice { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.dc-voice li {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  font-size: 0.8125rem;
  color: var(--text-2);
}

.dc-join { width: 100%; min-height: 52px; margin-top: 24px; }
.dc-join svg:first-child { width: 18px; height: 18px; }
.dc-join svg:last-child { transition: transform 0.4s var(--ease-out); }
.dc-join:hover svg:last-child { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .dot--pulse { animation: none; }
}
</style>
