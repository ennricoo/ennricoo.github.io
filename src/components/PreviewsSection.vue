<script setup>
import { ref } from 'vue'
import { Expand } from 'lucide-vue-next'
import ImageLightbox from './ImageLightbox.vue'
import { img } from '../config'

// `area` decide la posizione nel mosaico (vedi grid-template-areas)
const shots = [
  { key: 'centrale', area: 'a', label: 'Centrale LSPD.', text: 'Le migliori mappe per un RP immersivo.', alt: 'Atrio della centrale di polizia di Los Santos' },
  { key: 'pitlane', area: 'b', label: 'Grand Senora Raceway.', text: 'Pit lane, box e giri liberi.', alt: 'Due supercar nella pit lane del circuito di notte' },
  { key: 'ospedale', area: 'c', label: 'Vespucci Medical Center.', text: 'I mezzi dei San Andreas Medical Services.', alt: 'Ambulanza davanti al Vespucci Medical Center' },
  { key: 'notte', area: 'd', label: 'Lungofiume.', text: 'Locali, motoscafi e skyline.', alt: 'Motoscafi davanti a un locale illuminato, skyline sullo sfondo' },
  { key: 'polizia', area: 'e', label: 'Accademia.', text: 'La LSPD si prepara a entrare in azione! Gli agenti devono sempre essere pronti per qualsiasi evenienza, per questo devono sottoporsi a importanti addestramenti.', alt: 'Cerimonia di addestramento degli agenti LSPD davanti alle volanti' },
  { key: 'garage', area: 'f', label: 'Box corse.', text: 'Auto da preparare prima della gara.', alt: 'Supercar nera ai box del circuito' },
  { key: 'soccorso', area: 'g', label: 'Preparazione operatori.', text: "Le prime luci dell'alba hanno appena iniziato a schiarire Los Santos. Sono le 05:44 del mattino e la città è ancora immersa in un'insolita quiete, interrotta soltanto dal rumore della pioggia che cade sull'asfalto e dal personale di emergenza che si prepara ad un'intensa giornata.", alt: 'Paramedici al lavoro accanto a un\'ambulanza' },
].map((s) => ({ ...s, ...img(s.key) }))

const open = ref(-1)
</script>

<template>
  <section id="anteprime" class="section previews" aria-labelledby="previews-title">
    <div class="container">
      <p class="sec-eyebrow" v-reveal><b>02</b>Anteprime</p>
      <h2 id="previews-title" class="h2" v-reveal>Benvenuto in città.</h2>
      <p class="lead sec-lead" v-reveal>Screenshot originali dal server, senza ritocchi.</p>

      <ul class="mosaic" aria-label="Screenshot del server">
        <li
          v-for="(s, i) in shots" :key="s.key"
          class="tile" :style="{ gridArea: s.area }"
          v-reveal="(i % 4) * 70"
        >
          <button type="button" class="tile-btn" :aria-label="`Apri a schermo intero: ${s.label}`" @click="open = i">
            <img
              :src="s.src" :srcset="s.srcset"
              sizes="(min-width: 900px) 50vw, 100vw"
              :alt="s.alt" width="1920" height="1050" loading="lazy" decoding="async"
            />
            <span class="tile-cap">
              <strong>{{ s.label }}</strong>
              <span>{{ s.text }}</span>
            </span>
            <span class="tile-zoom" aria-hidden="true"><Expand :size="16" /></span>
          </button>
        </li>
      </ul>
    </div>

    <ImageLightbox v-model="open" :images="shots" />
  </section>
</template>

<style scoped>

/* Mosaico a incastro */
.mosaic {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
  margin-top: clamp(36px, 5vw, 56px);
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: clamp(140px, 38vw, 200px);
  grid-template-areas:
    "a a"
    "a a"
    "b c"
    "d e"
    "f f"
    "g g";
}
@media (min-width: 800px) {
  .mosaic {
    gap: 16px;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: clamp(160px, 17vw, 230px);
    grid-template-areas:
      "a a b b"
      "a a c d"
      "e f f d"
      "e f f g";
  }
}

.tile { min-width: 0; }
.tile-btn {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  background: var(--navy-800);
  box-shadow: 0 0 0 1px var(--line);
  transition: box-shadow 0.5s var(--ease-out);
  text-align: left;
}
.tile-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease-out), filter 0.6s var(--ease-out);
}
/* Velo scuro + didascalia */
.tile-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.82));
  pointer-events: none;
}
.tile-cap {
  position: absolute; left: 0; right: 0; bottom: 0;
  z-index: 1;
  display: grid;
  gap: 2px;
  padding: clamp(14px, 2vw, 22px);
  font-size: 0.875rem;
  color: var(--text-2);
  transition: transform 0.5s var(--ease-out);
}
.tile-cap strong { color: var(--text); font-size: 1rem; font-weight: 600; }
.tile-cap span {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  max-width: 52ch;
}
.tile-zoom {
  position: absolute; top: 12px; right: 12px;
  z-index: 1;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: rgba(45, 99, 224, 0.85);
  box-shadow: 0 0 20px rgba(91, 140, 255, 0.6);
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}

@media (hover: hover) {
  .tile-cap { transform: translateY(8px); }
  .tile-cap span { opacity: 0; transition: opacity 0.4s var(--ease-out); }
  .tile-btn:hover { box-shadow: 0 0 0 1px rgba(91, 140, 255, 0.55), 0 24px 60px -24px rgba(45, 99, 224, 0.7); }
  .tile-btn:hover img { transform: scale(1.06); }
  .tile-btn:hover .tile-cap { transform: none; }
  .tile-btn:hover .tile-cap span { opacity: 1; }
  .tile-btn:hover .tile-zoom { opacity: 1; transform: none; }
  /* Le altre foto si attenuano leggermente */
  .mosaic:has(.tile-btn:hover) .tile-btn:not(:hover) img { filter: brightness(0.6) saturate(0.8); }
}

/* Sui telefoni piccoli mostra solo il titolo */
@media (max-width: 519px) {
  .tile-cap span { display: none; }
  .tile-cap strong { font-size: 0.875rem; }
}
</style>
