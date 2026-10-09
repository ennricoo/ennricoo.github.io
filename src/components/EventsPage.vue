<script setup>
import { ArrowLeft, ArrowDown } from 'lucide-vue-next'
import CalendarGrid from './CalendarGrid.vue'
import EventSteps from './EventSteps.vue'
import DiscordIcon from './DiscordIcon.vue'
import { site, img } from '../config'

const bg = img('pitlane')
</script>

<template>
  <!-- Apertura: stessa struttura dell'hero in home -->
  <section class="ev-hero" aria-labelledby="ev-title">
    <div class="ev-bg" aria-hidden="true">
      <img :src="bg.src" :srcset="bg.srcset" sizes="100vw" alt="" width="1920" height="1050" fetchpriority="high" />
    </div>

    <div class="container ev-hero-copy">
      <a href="/" class="link back"><ArrowLeft aria-hidden="true" /> Home</a>
      <p class="ev-when">Calendario 2026</p>
      <p class="lead ev-lead">Apertura, inaugurazioni e Halloweek. Tutto quello che succede in città nelle prime due settimane.</p>
      <a href="#calendario" class="btn btn-blue ev-jump">Vai al calendario <ArrowDown aria-hidden="true" /></a>
    </div>

    <div class="giant-wrap">
      <h1 id="ev-title" class="giant"><span class="sr-only">Eventi di </span>ottobre</h1>
    </div>
  </section>

  <section class="section ev-steps-sec" aria-labelledby="steps-title">
    <div class="container">
      <p class="sec-eyebrow" v-reveal><b>01</b>In evidenza</p>
      <h2 id="steps-title" class="h2" v-reveal>Tre momenti<br />da segnare.</h2>
      <EventSteps class="ev-steps" href="#calendario" />
    </div>
  </section>

  <section id="calendario" class="section cal-section" aria-labelledby="cal-title">
    <div class="container">
      <p class="sec-eyebrow" v-reveal><b>02</b>Calendario</p>
      <h2 id="cal-title" class="h2" v-reveal>Giorno per giorno.</h2>
      <p class="lead sec-lead" v-reveal>Orari, inaugurazioni e la messa ricorrente, tutto il mese in un colpo d'occhio.</p>
      <CalendarGrid class="cal" />
    </div>
  </section>

  <section class="section ev-cta" aria-labelledby="ev-cta-title">
    <div class="container ev-cta-inner">
      <p class="sec-eyebrow" v-reveal><b>03</b>Discord</p>
      <h2 id="ev-cta-title" class="h2" v-reveal>Non perderti nulla.</h2>
      <p class="lead sec-lead" v-reveal>Orari, cambi di programma e nuovi eventi vengono annunciati su Discord.</p>
      <a :href="site.discordUrl" target="_blank" rel="noopener" class="btn btn-blue" v-reveal>
        <DiscordIcon /> Entra su Discord
      </a>
    </div>

    <div class="sign" aria-hidden="true"><span>encode</span></div>
  </section>
</template>

<style scoped>
/* ---------- Apertura ---------- */
.ev-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding-top: calc(var(--nav-h) + var(--safe-top) + clamp(32px, 6vh, 72px));
}
.ev-bg { position: absolute; inset: 0; z-index: -1; }
.ev-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: saturate(0.7) contrast(1.05);
  animation: kenburns 30s ease-in-out infinite alternate;
}
@keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.12) translate(1.5%, -1%); } }
/* velo uniforme, come in home */
.ev-bg::after {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 70%, #000 100%),
    rgba(4, 10, 28, 0.62);
}

.ev-hero-copy { flex: 1; }
.ev-hero-copy > * { animation: rise 1s var(--ease-out) both; }
.ev-hero-copy > :nth-child(2) { animation-delay: 0.08s; }
.ev-hero-copy > :nth-child(3) { animation-delay: 0.18s; }
.ev-hero-copy > :nth-child(4) { animation-delay: 0.28s; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }

.back { margin-bottom: clamp(24px, 4vh, 48px); }
.ev-when {
  font-size: clamp(2.4rem, 1.2rem + 3.4vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  padding-bottom: 0.06em;
  background: linear-gradient(180deg, #ffffff 0%, #d9dce3 50%, #7d818c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ev-lead { margin-top: 16px; max-width: 26em; }
.ev-jump { margin-top: 32px; }

/* "ottobre" gigante, come "17 ottobre" in home */
.giant-wrap { overflow: hidden; margin-top: clamp(32px, 6vh, 72px); pointer-events: none; }
.giant {
  font-size: 22vw;
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 0.8;
  text-align: center;
  white-space: nowrap;
  margin-bottom: -0.14em;
  background: linear-gradient(180deg, rgba(235, 238, 245, 0.62) 0%, rgba(150, 155, 168, 0.3) 45%, rgba(10, 10, 12, 0) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: giant-in 1.6s var(--ease-out) 0.25s both;
}
@keyframes giant-in { from { opacity: 0; transform: translateY(20%); } to { opacity: 1; transform: none; } }

/* ---------- Sezioni ---------- */
.ev-steps { margin-top: clamp(40px, 5vw, 64px); }
.cal-section { padding-top: 0; }
.cal { margin-top: clamp(40px, 5vw, 64px); }

.ev-cta { position: relative; overflow: hidden; padding-bottom: 0; }
.ev-cta-inner { display: grid; justify-items: start; }
.ev-cta-inner .btn { margin-top: 32px; }

.sign { overflow: hidden; margin-top: clamp(64px, 8vw, 120px); pointer-events: none; }
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

@media (max-width: 599px) {
  .ev-hero { min-height: 0; }
  .giant { font-size: 25vw; }
}
@media (prefers-reduced-motion: reduce) {
  .ev-bg img { animation: none; }
}
</style>
