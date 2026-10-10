<script setup>
import { ref, computed } from 'vue'
import { Car, MapPin, Shirt } from 'lucide-vue-next'

/* Mappa con i luoghi evidenziati. Le posizioni sono coordinate di gioco (x, y),
   convertite in percentuale tramite `bounds`: l'area del mondo coperta dall'immagine. */
const props = defineProps({
  map: { type: Object, required: true },
})

const icons = { car: Car, pin: MapPin, shirt: Shirt }
const kinds = computed(() => props.map.kinds)
const legend = computed(() =>
  Object.entries(kinds.value).map(([id, k]) => ({ id, ...k, count: props.map.places.filter((p) => p.kind === id).length })))

// Inquadrature: stesso rapporto del riquadro (5:4), in coordinate di gioco
const views = computed(() => props.map.views)
const view = ref(props.map.views[0].id)
const v = computed(() => views.value.find((x) => x.id === view.value))

const B = computed(() => props.map.bounds)
const layer = computed(() => {
  const [bx0, bx1] = B.value.x
  const [by0, by1] = B.value.y
  const [vx0, vx1] = v.value.x
  const [vy0, vy1] = v.value.y
  const vw = vx1 - vx0
  const vh = vy1 - vy0
  return {
    width: `${((bx1 - bx0) / vw) * 100}%`,
    height: `${((by1 - by0) / vh) * 100}%`,
    left: `${((bx0 - vx0) / vw) * 100}%`,
    top: `${((vy1 - by1) / vh) * 100}%`,
  }
})
// Posizione nel livello della mappa intera (la y di gioco cresce verso nord)
const at = (p) => {
  const [bx0, bx1] = B.value.x
  const [by0, by1] = B.value.y
  return {
    left: `${((p.x - bx0) / (bx1 - bx0)) * 100}%`,
    top: `${((by1 - p.y) / (by1 - by0)) * 100}%`,
  }
}

const hover = ref(null)
const missing = ref(false)
</script>

<template>
  <figure class="rmap">
    <div class="rmap-head">
      <figcaption>{{ map.title }}</figcaption>
      <div class="rmap-views" role="group" aria-label="Inquadratura della mappa">
        <button
          v-for="x in views"
          :key="x.id"
          :aria-pressed="view === x.id"
          @click="view = x.id"
        >{{ x.label }}</button>
      </div>
    </div>

    <div class="rmap-frame" :class="{ 'is-empty': missing }" @mouseleave="hover = null">
      <div class="rmap-layer" :style="layer">
        <img v-if="!missing" :src="map.image" alt="" decoding="async" draggable="false" @error="missing = true" />
        <button
          v-for="(p, i) in map.places"
          :key="i"
          class="rmap-pin"
          :class="[`is-${kinds[p.kind].color}`, { 'is-on': hover === i }]"
          :style="at(p)"
          :aria-label="`${kinds[p.kind].label}: ${p.name}`"
          @mouseenter="hover = i"
          @focus="hover = i"
          @blur="hover = null"
        >
          <component :is="icons[kinds[p.kind].icon]" :size="13" aria-hidden="true" />
          <span class="rmap-tip" aria-hidden="true">{{ p.name }}</span>
        </button>
      </div>
    </div>

    <ul class="rmap-legend">
      <li v-for="k in legend" :key="k.id" :class="`is-${k.color}`">
        <span class="rmap-dot"><component :is="icons[k.icon]" :size="12" aria-hidden="true" /></span>
        {{ k.label }}<small v-if="k.count > 1">{{ k.count }}</small>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.rmap { margin: 1.4em 0 0; font-size: 0.85em; }
.rmap-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 0.8em;
}
.rmap-head figcaption { color: var(--ink-2, var(--text-2)); font-weight: 500; }
.rmap-views {
  display: inline-flex; padding: 3px; gap: 2px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  box-shadow: inset 0 0 0 1px var(--rule, var(--line));
}
.rmap-views button {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.9em;
  color: var(--ink-3, var(--text-3));
  transition: color 0.2s, background-color 0.2s;
}
.rmap-views button:hover { color: var(--ink, var(--text)); }
.rmap-views button[aria-pressed='true'] { color: #fff; background: rgba(255,255,255,0.1); }

.rmap-frame {
  position: relative;
  aspect-ratio: 5 / 4;
  overflow: hidden;
  border-radius: 14px;
  /* colore del mare: riempie i bordi oltre l'immagine */
  background: #006683;
  box-shadow: inset 0 0 0 1px var(--rule, var(--line));
  isolation: isolate;
}
/* Senza immagine: una griglia leggera al posto della mappa */
.rmap-frame.is-empty .rmap-layer {
  background:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 5% 3.5%,
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 5% 3.5%;
}
.rmap-layer {
  position: absolute;
  transition: left 0.6s var(--ease-out, ease), top 0.6s var(--ease-out, ease),
    width 0.6s var(--ease-out, ease), height 0.6s var(--ease-out, ease);
}
.rmap-layer img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: fill;
  user-select: none;
}
@media (prefers-reduced-motion: reduce) {
  .rmap-layer { transition: none; }
}

/* Colori dei luoghi */
.is-blue { --c: #5b8cff; }
.is-green { --c: #34c759; }
.is-violet { --c: #a48bff; }

.rmap-pin {
  position: absolute;
  z-index: 1;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  margin: -12px 0 0 -12px;
  border-radius: 50%;
  color: #fff;
  background: var(--c);
  box-shadow: 0 0 0 2px rgba(6, 10, 18, 0.85), 0 0 0 7px color-mix(in srgb, var(--c) 28%, transparent), 0 4px 12px rgba(0,0,0,0.5);
  transition: transform 0.2s;
}
.rmap-pin:hover, .rmap-pin.is-on { z-index: 2; transform: scale(1.15); }
.rmap-pin:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.rmap-tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  translate: -50% 4px;
  padding: 5px 10px;
  border-radius: 8px;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: rgba(6, 10, 18, 0.94);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 6px 18px rgba(0,0,0,0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, translate 0.15s;
}
.rmap-pin.is-on .rmap-tip { opacity: 1; translate: -50% 0; }

.rmap .rmap-legend {
  display: flex; flex-wrap: wrap; gap: 8px 20px;
  margin-top: 0.9em;
  padding: 0;
  list-style: none;
  color: var(--ink-2, var(--text-2));
}
.rmap .rmap-legend li { display: flex; align-items: center; gap: 8px; margin: 0; padding: 0; }
.rmap-legend small { color: var(--ink-3, var(--text-3)); font-variant-numeric: tabular-nums; }
.rmap-dot {
  display: grid; place-items: center;
  width: 20px; height: 20px;
  border-radius: 50%;
  color: #fff;
  background: var(--c);
}
</style>
