<script setup>
import { Megaphone, ScrollText, LifeBuoy } from 'lucide-vue-next'
import DiscordWidget from './DiscordWidget.vue'
import { img } from '../config'

const bg = img('notte')
const channels = [
  { icon: Megaphone, title: 'Annunci', text: 'Novità, aggiornamenti ed eventi, prima di tutti.' },
  { icon: ScrollText, title: 'Regolamento', text: 'Da leggere prima di entrare in città.' },
  { icon: LifeBuoy, title: 'Supporto', text: 'Ticket diretti con lo staff, quando serve.' },
]
</script>

<template>
  <section id="community" class="section community" aria-labelledby="community-title">
    <div class="cm-bg" aria-hidden="true">
      <img :src="bg.src" :srcset="bg.srcset" sizes="100vw" alt="" loading="lazy" decoding="async" />
    </div>

    <div class="container community-grid">
      <div class="community-copy">
        <p class="sec-eyebrow" v-reveal><b>04</b>Community</p>
        <h2 id="community-title" class="h2" v-reveal>Ci vediamo<br />in città.</h2>
        <p class="lead sec-lead" v-reveal>Tutto passa da Discord. Entra prima dell'apertura e arriva pronto al primo giorno.</p>

        <ul class="channels">
          <li v-for="(c, i) in channels" :key="c.title" v-reveal="i * 80">
            <span class="ch-icon"><component :is="c.icon" :size="20" :stroke-width="1.6" aria-hidden="true" /></span>
            <span class="ch-copy">
              <strong>{{ c.title }}</strong>
              <span>{{ c.text }}</span>
            </span>
          </li>
        </ul>
      </div>

      <div class="community-card" v-reveal="120">
        <DiscordWidget />
      </div>
    </div>

    <!-- Firma finale, stesso trattamento della data in hero -->
    <div class="sign" aria-hidden="true">
      <span>encode</span>
    </div>
  </section>
</template>

<style scoped>
.community {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-bottom: 0;
}
.cm-bg {
  position: absolute; inset: 0;
  z-index: -1;
}
.cm-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.3;
  filter: saturate(0.6);
}
/* stesso velo uniforme dell'hero: sfuma nel nero sopra e sotto */
.cm-bg::after {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, #000 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.45) 70%, #000 100%),
    rgba(4, 10, 28, 0.55);
}

.community-grid { display: grid; gap: 56px; align-items: center; }

.channels {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 4px;
  margin-top: 36px;
  max-width: 460px;
}
.channels li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.channels li:last-child { border-bottom: 1px solid var(--line); }
.ch-icon {
  flex: none;
  width: 44px; height: 44px;
  display: grid; place-items: center;
  border-radius: 12px;
  color: var(--blue-bright);
  background: rgba(45, 99, 224, 0.12);
  box-shadow: inset 0 0 0 1px rgba(91, 140, 255, 0.25);
}
.ch-copy { display: grid; gap: 2px; }
.ch-copy strong { font-weight: 600; }
.ch-copy span { color: var(--text-2); font-size: 0.95rem; }

.community-card { position: relative; display: flex; justify-content: center; }
/* alone tenue dietro la card, come l'orologio */
.community-card::before {
  content: '';
  position: absolute;
  inset: 10% 5%;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(200, 210, 235, 0.08), transparent);
  filter: blur(50px);
}

/* Scritta gigante tagliata dal footer */
.sign {
  overflow: hidden;
  margin-top: clamp(64px, 8vw, 120px);
  pointer-events: none;
}
.sign span {
  display: block;
  font-size: 24vw;
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 0.8;
  text-align: center;
  white-space: nowrap;
  margin-bottom: -0.16em;
  background: linear-gradient(180deg, rgba(235, 238, 245, 0.32) 0%, rgba(150, 155, 168, 0.12) 50%, rgba(10, 10, 12, 0) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (min-width: 900px) {
  .community-grid { grid-template-columns: 1fr 440px; gap: 80px; }
}
</style>
