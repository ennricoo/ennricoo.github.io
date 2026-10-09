<script setup>
import { ChevronRight } from 'lucide-vue-next'
import DiscordIcon from './DiscordIcon.vue'
import AnalogCountdown from './AnalogCountdown.vue'
import { site, img } from '../config'
import { useCountdown } from '../composables/useCountdown'

const shot = img('soccorso')
const { done } = useCountdown(site.opening)

// Ruoli e luoghi che scorrono sotto l'hero
const ticker = ['LSPD', 'Soccorso EMS', 'Autodromo', 'Vita notturna', 'Officine', 'Accademia', 'Lungofiume', 'Centrale']
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true">
      <img
        class="bg-img" :src="shot.src" :srcset="shot.srcset" sizes="100vw"
        alt="" width="1920" height="1050" fetchpriority="high"
      />
      <div class="bg-shade" />
    </div>

    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="hero-when"><span>Sabato,</span> <span>ore 15:00</span></p>

        <p class="hero-sub">
          <template v-if="!done">Una città costruita da zero sta per aprire le porte. Entra su Discord e preparati al primo giorno.</template>
          <template v-else>La città è aperta. Entra su Discord e raggiungici in gioco.</template>
        </p>

        <div class="hero-ctas">
          <a :href="site.discordUrl" target="_blank" rel="noopener" class="btn btn-blue">
            <DiscordIcon /> Entra su Discord
          </a>
          <a href="/eventi/" class="link">Guarda gli eventi <ChevronRight aria-hidden="true" /></a>
        </div>
      </div>

      <div class="hero-clock">
        <AnalogCountdown :target="site.opening" />
      </div>
    </div>

    <div class="giant-wrap">
      <h1 id="hero-title" class="giant">
        <span class="sr-only">Encode Roleplay apre il </span>17 ottobre
      </h1>
    </div>

    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <template v-for="n in 2" :key="n">
          <span v-for="t in ticker" :key="`${n}-${t}`" class="ticker-item">{{ t }}<i>◆</i></span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding-top: calc(var(--nav-h) + var(--safe-top) + clamp(32px, 6vh, 72px));
  text-align: center;
}
.hero-grid {
  flex: 1;
  display: grid;
  gap: clamp(40px, 6vw, 56px);
  align-items: center;
  padding-bottom: clamp(24px, 4vh, 48px);
}
.hero-clock { animation: rise 1.2s var(--ease-out) 0.15s both; }

/* ---------- Sfondo: screenshot sotto un velo uniforme ---------- */
.hero-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.bg-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: 60% 50%;
  opacity: 0.55;
  filter: saturate(0.7) contrast(1.05);
  animation: kenburns 30s ease-in-out infinite alternate;
}
@keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.14) translate(-1.5%, -1%); } }
.bg-shade {
  position: absolute; inset: 0;
  /* stessa intensità a sinistra e a destra, sfuma nel nero in basso */
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.55) 70%, #000 100%),
    rgba(4, 10, 28, 0.62);
}

/* ---------- Testi ---------- */
.hero-copy > * { animation: rise 1s var(--ease-out) both; }
.hero-copy > :nth-child(2) { animation-delay: 0.08s; }
.hero-copy > :nth-child(3) { animation-delay: 0.18s; }
.hero-copy > :nth-child(4) { animation-delay: 0.28s; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }

/* Orario: stesso stile della data gigante, in scala ridotta */
.hero-when {
  font-size: clamp(2.4rem, 1.2rem + 3.4vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
}
/* una riga per parte, ognuna con la sua sfumatura */
.hero-when span {
  display: block;
  padding-bottom: 0.06em;
  background: linear-gradient(180deg, #ffffff 0%, #d9dce3 50%, #7d818c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-sub {
  margin: clamp(16px, 2vw, 24px) auto 0;
  font-size: var(--fs-lead);
  color: var(--text-2);
  max-width: 24em;
}
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px 28px;
  margin-top: 32px;
}

/* "17 ottobre": enorme, bold, dal grigio al nero, tagliato dal bordo inferiore */
.giant-wrap {
  overflow: hidden;
  margin-top: clamp(-80px, -4vw, -24px);
  pointer-events: none;
}
.giant {
  font-size: 15.5vw;
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 0.82;
  text-align: center;
  white-space: nowrap;
  margin-bottom: -0.13em;
  background: linear-gradient(180deg, rgba(235, 238, 245, 0.62) 0%, rgba(150, 155, 168, 0.3) 45%, rgba(10, 10, 12, 0) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: giant-in 1.6s var(--ease-out) 0.25s both;
}
@keyframes giant-in { from { opacity: 0; transform: translateY(20%); } to { opacity: 1; transform: none; } }

/* ---------- Striscia che scorre ---------- */
.ticker {
  position: relative;
  padding-block: 22px;
  border-block: 1px solid var(--line);
  background: #000;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.ticker:hover .ticker-track { animation-play-state: paused; }
.ticker-item {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-brand);
  font-size: clamp(0.8rem, 0.7rem + 0.4vw, 1.05rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-3);
  white-space: nowrap;
}
.ticker-item i {
  font-style: normal;
  font-size: 0.55em;
  margin-inline: 2.2em;
  color: var(--blue-bright);
}
@keyframes marquee { to { transform: translateX(-50%); } }

@media (min-width: 960px) {
  .hero { text-align: left; }
  .hero-grid { grid-template-columns: 1.1fr 1fr; }
  .hero-ctas { justify-content: flex-start; }
  .hero-sub { margin-left: 0; }
}
@media (max-width: 599px) {
  .hero-ctas .btn { width: 100%; max-width: 360px; }
  .giant-wrap { margin-top: 8px; }
  .giant { font-size: 18vw; }
}
@media (prefers-reduced-motion: reduce) {
  .bg-img, .ticker-track { animation: none !important; }
}
</style>
