<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Map, CarFront, Code2, Flag } from 'lucide-vue-next'
import { img } from '../config'

// Il "5+" conta da 0 quando entra in vista
const years = ref(5)
const yearsEl = ref(null)
let io
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  years.value = 0
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect()
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1400)
      years.value = Math.round(5 * (1 - Math.pow(1 - k, 3)))
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, { threshold: 0.6 })
  io.observe(yearsEl.value)
})
onBeforeUnmount(() => io?.disconnect())

const photo = img('garage')

// Roadmap: si parte dall'apertura, poi aggiornamenti continui
const road = [
  { icon: Flag, label: 'Apertura', when: '17 ottobre', done: true },
  { icon: Map, label: 'Nuove mappe', when: 'Dopo l\'apertura' },
  { icon: CarFront, label: 'Nuovi veicoli', when: 'Dopo l\'apertura' },
  { icon: Code2, label: 'Nuovi script', when: 'Dopo l\'apertura' },
]
</script>

<template>
  <section id="chi-siamo" class="section about" aria-labelledby="about-title">
    <div class="container">
      <p class="sec-eyebrow" v-reveal><b>01</b>Chi siamo</p>
      <h2 id="about-title" class="h2" v-reveal>Cinque anni di sviluppo.</h2>
      <p class="lead sec-lead" v-reveal>Un solo progetto, costruito attorno alle nostre idee e non a soluzioni già viste.</p>

      <div class="bento">
        <!-- 5+ anni: foto in sottofondo e numero gigante -->
        <article class="tile tile--years" v-reveal>
          <img class="tile-photo" :src="photo.src" :srcset="photo.srcset" sizes="(min-width: 900px) 66vw, 100vw" alt="" loading="lazy" decoding="async" />
          <p ref="yearsEl" class="big big--xl">{{ years }}+</p>
          <div class="tile-copy">
            <h3>anni di lavoro insieme</h3>
            <p>Un team di developer che conosce FiveM dal codice alla gestione di una community.</p>
          </div>
        </article>

        <!-- 1 direzione: bussola disegnata -->
        <article class="tile tile--dir" v-reveal="90">
          <svg class="compass" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="72" />
            <circle cx="100" cy="100" r="48" />
            <line x1="100" y1="0" x2="100" y2="200" />
            <line x1="0" y1="100" x2="200" y2="100" />
            <g class="needle">
              <line class="needle-line" x1="100" y1="100" x2="100" y2="14" />
              <circle class="needle-tip" cx="100" cy="14" r="4" />
            </g>
            <circle class="hub" cx="100" cy="100" r="4" />
          </svg>
          <p class="big">1</p>
          <div class="tile-copy">
            <h3>direzione precisa</h3>
            <p>Ogni elemento ha una funzione. Le scelte prese in fase di progettazione si sentono davvero in gioco.</p>
          </div>
        </article>

        <!-- Aggiornamenti: roadmap con una luce che percorre il binario -->
        <article class="tile tile--updates" v-reveal>
          <div class="upd-head">
            <div>
              <p class="status"><span class="status-dot" aria-hidden="true" />In sviluppo continuo</p>
              <h3>Il server non resta fermo.</h3>
            </div>
            <p class="upd-text">Dopo l'apertura continueremo ad aggiungere mappe, veicoli e script nuovi. Ogni aggiornamento viene annunciato su Discord.</p>
          </div>

          <ol class="road" aria-label="Roadmap degli aggiornamenti">
            <li v-for="(r, i) in road" :key="r.label" class="stop" :class="{ 'is-done': r.done }" :style="{ '--i': i }">
              <span class="stop-node"><component :is="r.icon" :size="24" :stroke-width="1.6" aria-hidden="true" /></span>
              <span class="stop-when">{{ r.when }}</span>
              <span class="stop-label">{{ r.label }}</span>
            </li>
          </ol>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  isolation: isolate;
  /* stacco leggero: fondo appena più chiaro del nero, che sfuma ai bordi */
  background:
    radial-gradient(ellipse 50% 40% at 10% 20%, rgba(45, 99, 224, 0.14), transparent 70%),
    linear-gradient(180deg, #000 0%, #07090d 14%, #07090d 86%, #000 100%);
}
/* griglia tenue, solo al centro della sezione */
.about::before {
  content: '';
  position: absolute; inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%);
  pointer-events: none;
}
/* linea di luce che segna l'inizio della sezione */
.about::after {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  width: min(900px, 80%);
  height: 1px;
  translate: -50% 0;
  background: linear-gradient(90deg, transparent, rgba(91, 140, 255, 0.7), transparent);
  box-shadow: 0 0 24px rgba(91, 140, 255, 0.5);
  pointer-events: none;
}

.bento {
  display: grid;
  gap: 16px;
  margin-top: clamp(48px, 7vw, 80px);
}
.tile {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding: clamp(28px, 3.5vw, 44px);
  border-radius: var(--radius-lg);
  background: #0a0b0e;
  box-shadow: inset 0 0 0 1px var(--line);
  transition: box-shadow 0.5s var(--ease-out);
}
@media (hover: hover) {
  .tile:hover { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2); }
}
.tile h3 { font-size: var(--fs-h3); line-height: 1.15; letter-spacing: -0.03em; }
.tile-copy p { color: var(--text-2); margin-top: 10px; max-width: 42ch; }

/* Numeri giganti, stesso trattamento della data in hero */
.big {
  font-size: clamp(5rem, 3.5rem + 5vw, 9rem);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 0.85;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(180deg, rgba(240, 242, 247, 0.98) 0%, rgba(150, 155, 168, 0.5) 65%, rgba(150, 155, 168, 0.08) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.big--xl { font-size: clamp(7rem, 4rem + 10vw, 15rem); }

/* 5+ anni */
.tile--years { min-height: clamp(380px, 38vw, 500px); }
.tile-photo {
  position: absolute; inset: 0;
  z-index: -2;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.4;
  filter: saturate(0.6);
  transition: transform 1.4s var(--ease-out), opacity 0.6s var(--ease-out);
}
.tile--years::after {
  content: '';
  position: absolute; inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.92) 100%);
}
@media (hover: hover) {
  .tile--years:hover .tile-photo { transform: scale(1.05); opacity: 0.5; }
}

/* 1 direzione */
.tile--dir { min-height: clamp(380px, 38vw, 500px); }
.compass {
  position: absolute;
  z-index: -1;
  top: 50%; right: -38%;
  width: 115%;
  translate: 0 -58%;
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 0.6;
}
.needle { transform-origin: 100px 100px; transform: rotate(38deg); animation: sway 6s ease-in-out infinite alternate; }
@keyframes sway { to { transform: rotate(52deg); } }
.needle-line { stroke: var(--blue-bright); stroke-width: 1.2; stroke-linecap: round; filter: drop-shadow(0 0 4px rgba(91, 140, 255, 0.8)); }
.needle-tip { fill: var(--blue-bright); stroke: none; }
.hub { fill: #0a0b0e; stroke: rgba(255, 255, 255, 0.5); stroke-width: 1; }

/* Aggiornamenti: roadmap */
.tile--updates { gap: clamp(36px, 4vw, 52px); }
.upd-head { display: grid; gap: 16px 48px; align-items: end; }
.upd-text { color: var(--text-2); max-width: 46ch; }
.status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-family: var(--font-brand);
  font-size: 0.68rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--blue-bright);
}
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--blue-bright);
  animation: ping 2.2s var(--ease-out) infinite;
}
@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(91, 140, 255, 0.6); }
  70%, 100% { box-shadow: 0 0 0 9px rgba(91, 140, 255, 0); }
}

.road {
  --node: 60px;
  position: relative;
  list-style: none;
  padding: 0;
  display: grid;
  gap: 22px;
}
/* binario: linea tratteggiata + luce che lo percorre */
.road::before,
.road::after {
  content: '';
  position: absolute;
  pointer-events: none;
}
.road::before {
  left: calc(var(--node) / 2); top: 0; bottom: 0;
  width: 1px;
  background: repeating-linear-gradient(180deg, rgba(255,255,255,0.2) 0 4px, transparent 4px 9px);
}
.road::after {
  left: calc(var(--node) / 2 - 1px); top: 0;
  width: 3px; height: 70px;
  border-radius: 3px;
  background: linear-gradient(180deg, transparent, var(--blue-bright), transparent);
  box-shadow: 0 0 14px rgba(91, 140, 255, 0.8);
  animation: travel-y 4.5s ease-in-out infinite;
}
@keyframes travel-y { from { transform: translateY(-70px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { transform: translateY(260px); opacity: 0; } }

.stop {
  position: relative;
  display: grid;
  grid-template-columns: var(--node) 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
  align-items: center;
}
.stop-node {
  grid-row: 1 / span 2;
  width: var(--node); height: var(--node);
  display: grid; place-items: center;
  border-radius: 18px;
  color: var(--text-2);
  background: #0a0b0e;
  box-shadow: inset 0 0 0 1px var(--line-2);
  transition: transform 0.5s var(--ease-out), color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.stop-when {
  font-family: var(--font-brand);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-3);
}
.stop-label { font-size: clamp(1.2rem, 1rem + 0.6vw, 1.5rem); font-weight: 800; letter-spacing: -0.035em; }
.is-done .stop-node {
  color: #fff;
  background: linear-gradient(180deg, #4a7dff, #2d63e0);
  box-shadow: 0 0 0 1px rgba(140, 175, 255, 0.6), 0 10px 30px -8px var(--blue-glow);
}
.is-done .stop-when { color: var(--blue-bright); }
@media (hover: hover) {
  .stop:not(.is-done):hover .stop-node { transform: translateY(-3px); color: var(--blue-bright); box-shadow: inset 0 0 0 1px rgba(91, 140, 255, 0.5); }
}

@media (min-width: 900px) {
  .bento { grid-template-columns: 1.7fr 1fr; }
  .tile--updates { grid-column: 1 / -1; }
  .upd-head { grid-template-columns: 1fr 1fr; }
  .road { grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .road::before {
    left: calc(var(--node) / 2); right: 0; top: calc(var(--node) / 2); bottom: auto;
    width: auto; height: 1px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 4px, transparent 4px 9px);
  }
  .road::after {
    left: 0; top: calc(var(--node) / 2 - 1px);
    width: 90px; height: 3px;
    background: linear-gradient(90deg, transparent, var(--blue-bright), transparent);
    animation-name: travel-x;
  }
  @keyframes travel-x { from { transform: translateX(-90px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { transform: translateX(min(1000px, 85vw)); opacity: 0; } }
  .stop { grid-template-columns: 1fr; grid-template-rows: auto; row-gap: 6px; }
  .stop-node { grid-row: auto; margin-bottom: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .needle, .status-dot, .road::after { animation: none; }
}
</style>
