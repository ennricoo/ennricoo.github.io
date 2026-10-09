<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Orologio a lancette che conta all'indietro verso `target`.
// Lancetta ore su scala 24h (un giro = un giorno), minuti e secondi classici.
// Le lancette girano in senso antiorario mentre il tempo scende;
// i giorni rimasti compaiono nella finestrella in basso.
const props = defineProps({
  target: { type: String, required: true },
})

const end = new Date(props.target).getTime()
const C = 200 // centro del quadrante (viewBox 400x400)

const hourHand = ref(null)
const minHand = ref(null)
const secHand = ref(null)
const now = ref(Date.now())

const left = computed(() => Math.max(0, end - now.value))
const days = computed(() => Math.floor(left.value / 86400000))
const parts = computed(() => {
  const s = Math.floor(left.value / 1000)
  return { h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
})
const pad = (n) => String(n).padStart(2, '0')
const a11y = computed(() =>
  `Mancano ${days.value} giorni, ${parts.value.h} ore e ${parts.value.m} minuti all'apertura`,
)

// Tacche: 60 minuti, ogni 5 più lunghe; numeri della scala 24h ogni 2 ore
const ticks = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0
  const a = (i * 6 - 90) * (Math.PI / 180)
  const r1 = major ? 158 : 166
  return {
    major,
    x1: C + Math.cos(a) * r1, y1: C + Math.sin(a) * r1,
    x2: C + Math.cos(a) * 174, y2: C + Math.sin(a) * 174,
  }
})
const numerals = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 - 90) * (Math.PI / 180)
  return { label: i === 0 ? '24' : String(i * 2), x: C + Math.cos(a) * 138, y: C + Math.sin(a) * 138 }
})

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
let raf = 0
let t0 = 0
const easeOut = (k) => 1 - Math.pow(1 - k, 3)

function frame(t) {
  if (!t0) t0 = t
  now.value = Date.now()
  let ms = left.value
  if (reduce) ms = Math.ceil(ms / 1000) * 1000 // scatto secco, niente rotazione continua

  const sec = (ms / 1000) % 60
  const min = (ms / 60000) % 60
  const hr = (ms / 3600000) % 24
  // All'avvio le lancette "si caricano" da mezzanotte alla posizione reale
  const k = reduce ? 1 : easeOut(Math.min(1, (t - t0) / 1800))

  hourHand.value?.setAttribute('transform', `rotate(${hr * 15 * k} ${C} ${C})`)
  minHand.value?.setAttribute('transform', `rotate(${min * 6 * k} ${C} ${C})`)
  secHand.value?.setAttribute('transform', `rotate(${sec * 6 * k} ${C} ${C})`)

  if (ms > 0) raf = requestAnimationFrame(frame)
}

onMounted(() => { raf = requestAnimationFrame(frame) })
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <div class="clock" role="timer" :aria-label="a11y">
    <svg class="clock-svg" viewBox="-28 -28 456 456" aria-hidden="true">
      <defs>
        <radialGradient id="ck-face" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#17191e" />
          <stop offset="65%" stop-color="#08090b" />
          <stop offset="100%" stop-color="#030304" />
        </radialGradient>
        <linearGradient id="ck-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#eceef3" />
          <stop offset="45%" stop-color="#7d818c" />
          <stop offset="100%" stop-color="#16171b" />
        </linearGradient>
        <linearGradient id="ck-date" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#7d818c" />
        </linearGradient>
        <linearGradient id="ck-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#9a9ea8" />
        </linearGradient>
        <!-- arco sopra la cassa, percorso da sinistra a destra -->
        <path id="ck-arc" :d="`M ${C - 204} ${C} A 204 204 0 0 1 ${C + 204} ${C}`" fill="none" />
        <filter id="ck-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <!-- Cassa e lunetta -->
      <circle :cx="C" :cy="C" r="197" fill="#050506" />
      <circle :cx="C" :cy="C" r="194" fill="none" stroke="url(#ck-bezel)" stroke-width="4" />
      <g class="bezel-ring">
        <circle :cx="C" :cy="C" r="186" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1" stroke-dasharray="2 9.6" />
      </g>

      <!-- Quadrante -->
      <circle :cx="C" :cy="C" r="180" fill="url(#ck-face)" />
      <circle :cx="C" :cy="C" r="180" fill="none" stroke="rgba(255,255,255,0.06)" />

      <line
        v-for="(t, i) in ticks" :key="i"
        :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
        :stroke="t.major ? '#e6e8ee' : 'rgba(255,255,255,0.18)'"
        :stroke-width="t.major ? 3 : 1.2" stroke-linecap="round"
      />
      <text
        v-for="n in numerals" :key="n.label"
        :x="n.x" :y="n.y" class="num" :class="{ 'num-top': n.label === '24' }"
        text-anchor="middle" dominant-baseline="central"
      >{{ n.label }}</text>

      <!-- Marchio -->
      <text :x="C" y="112" class="brand-top" text-anchor="middle">ENCODE</text>
      <text :x="C" y="126" class="brand-bottom" text-anchor="middle">ROLEPLAY</text>

      <!-- Finestra giorni -->
      <g class="date">
        <rect x="160" y="252" width="80" height="44" rx="8" fill="#000" stroke="rgba(255,255,255,0.16)" />
        <text :x="C" y="276" class="date-num" text-anchor="middle" dominant-baseline="central">{{ pad(days) }}</text>
        <text :x="C" y="314" class="date-label" text-anchor="middle">{{ days === 1 ? 'GIORNO' : 'GIORNI' }}</text>
      </g>

      <!-- Lancette -->
      <g ref="hourHand">
        <path :d="`M ${C - 7} ${C + 14} L ${C - 4.5} ${C - 92} L ${C} ${C - 102} L ${C + 4.5} ${C - 92} L ${C + 7} ${C + 14} Z`" fill="url(#ck-hand)" />
        <rect :x="C - 1.5" :y="C - 86" width="3" height="56" rx="1.5" fill="#1a1c21" />
      </g>
      <g ref="minHand">
        <path :d="`M ${C - 5} ${C + 18} L ${C - 3} ${C - 140} L ${C} ${C - 152} L ${C + 3} ${C - 140} L ${C + 5} ${C + 18} Z`" fill="url(#ck-hand)" />
      </g>
      <g ref="secHand" filter="url(#ck-glow)">
        <line :x1="C" :y1="C + 34" :x2="C" :y2="C - 166" stroke="#4a7dff" stroke-width="1.8" stroke-linecap="round" />
        <circle :cx="C" :cy="C + 30" r="5" fill="#4a7dff" />
        <circle :cx="C" :cy="C - 150" r="3.5" fill="#9fc0ff" />
      </g>
      <circle :cx="C" :cy="C" r="8" fill="#101114" stroke="#d9dce3" stroke-width="2" />
      <circle :cx="C" :cy="C" r="2.5" fill="#fff" />

      <!-- Tempo rimasto, scritto lungo il bordo -->
      <text class="arc-text">
        <textPath href="#ck-arc" startOffset="50%" text-anchor="middle">
          <tspan class="arc-num" dx="0">{{ pad(days) }}</tspan> {{ days === 1 ? 'GIORNO' : 'GIORNI' }}
          <tspan class="arc-sep">&#160;&#160;&#160;◆&#160;&#160;&#160;</tspan>
          <tspan class="arc-num" dx="0">{{ pad(parts.h) }}</tspan> ORE
          <tspan class="arc-sep">&#160;&#160;&#160;◆&#160;&#160;&#160;</tspan>
          <tspan class="arc-num" dx="0">{{ pad(parts.m) }}</tspan> MIN
          <tspan class="arc-sep">&#160;&#160;&#160;◆&#160;&#160;&#160;</tspan>
          <tspan class="arc-num" dx="0">{{ pad(parts.s) }}</tspan> SEC
        </textPath>
      </text>

      <!-- Riflesso del vetro -->
      <path :d="`M ${C - 160} ${C - 40} A 170 170 0 0 1 ${C + 120} ${C - 130} A 190 190 0 0 0 ${C - 160} ${C - 40} Z`" fill="rgba(255,255,255,0.05)" />
    </svg>

  </div>
</template>

<style scoped>
.clock {
  position: relative;
  width: min(480px, 88vw);
  margin-inline: auto;
}
/* Alone tenue dietro la cassa */
.clock::before {
  content: '';
  position: absolute;
  inset: 6%;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(200, 210, 235, 0.12), transparent);
  filter: blur(40px);
  animation: breathe 5s ease-in-out infinite alternate;
}
@keyframes breathe { from { opacity: 0.5; transform: scale(0.96); } to { opacity: 0.8; transform: scale(1.04); } }

.clock-svg {
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6));
  animation: clock-in 1.2s var(--ease-out) both;
}
@keyframes clock-in { from { opacity: 0; transform: scale(0.9) rotate(-8deg); filter: blur(8px); } to { opacity: 1; transform: none; } }

.bezel-ring {
  transform-origin: 200px 200px;
  animation: spin 120s linear infinite;
}
@keyframes spin { to { transform: rotate(-360deg); } }

.num { font-family: var(--font-sans); font-weight: 700; font-size: 13px; fill: #7d818c; letter-spacing: -0.02em; }
.num-top { fill: #eceef3; font-size: 16px; font-weight: 800; }
.brand-top { font-family: var(--font-brand); font-size: 12px; letter-spacing: 0.42em; fill: #f5f7fa; }
.brand-bottom { font-family: var(--font-brand); font-size: 7.5px; letter-spacing: 0.32em; fill: #4a7dff; }
.date-num { font-family: var(--font-sans); font-weight: 800; font-size: 28px; fill: url(#ck-date); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.date-label { font-family: var(--font-brand); font-size: 8px; letter-spacing: 0.32em; fill: #7d818c; }

.arc-text {
  font-family: var(--font-brand);
  font-size: 9.5px;
  letter-spacing: 0.2em;
  fill: #7d818c;
}
.arc-num {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0;
  fill: #eceef3;
}
.arc-sep { fill: #4a7dff; font-size: 7px; letter-spacing: 0; }

@media (prefers-reduced-motion: reduce) {
  .clock::before, .bezel-ring { animation: none; }
}
</style>
