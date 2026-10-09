<script setup>
import { highlights } from '../data/events'
import { img } from '../config'

defineProps({
  href: { type: String, default: '/eventi/' }, // dove portano le card
})

// Le tre tappe di ottobre: numero gigante e foto di sfondo per ciascuna
const extra = [
  { big: '17', photo: 'centrale', tag: 'Si parte' },
  { big: '18–21', photo: 'ospedale' },
  { big: '26–31', photo: 'notte' },
]
const steps = highlights.map((h, i) => ({ ...h, ...extra[i], bg: img(extra[i].photo) }))
</script>

<template>
  <ol class="steps">
    <li
      v-for="(s, i) in steps" :key="s.title"
      class="step" :class="s.kind && `step--${s.kind}`"
      v-reveal="i * 90"
    >
      <!-- Binario della timeline -->
      <span class="rail" aria-hidden="true"><i /></span>

      <a :href="href" class="card">
        <img class="card-bg" :src="s.bg.src" :srcset="s.bg.srcset" sizes="(min-width: 900px) 40vw, 100vw" alt="" loading="lazy" decoding="async" />
        <span class="card-top">
          <span class="card-big" aria-hidden="true">{{ s.big }}</span>
          <span v-if="s.tag" class="card-tag">{{ s.tag }}</span>
        </span>
        <span class="card-body">
          <span class="card-date">{{ s.date }}</span>
          <span class="card-title">{{ s.title }}</span>
          <span class="card-text">{{ s.text }}</span>
        </span>
      </a>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 16px;
}

/* Timeline: pallino + linea sopra ogni card */
.rail {
  position: relative;
  display: block;
  height: 12px;
  margin-bottom: 18px;
}
.rail::before {
  content: '';
  position: absolute;
  left: 6px; right: -16px; top: 50%;
  height: 1px;
  background: linear-gradient(90deg, rgba(91, 140, 255, 0.6), rgba(255, 255, 255, 0.1));
}
.step:last-child .rail::before { right: 0; background: linear-gradient(90deg, rgba(255,255,255,0.18), transparent); }
.rail i {
  position: absolute;
  left: 0; top: 0;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #000;
  border: 2px solid #7d818c;
}
.step--main .rail i {
  border-color: var(--blue-bright);
  background: var(--blue-bright);
  box-shadow: 0 0 0 0 rgba(91, 140, 255, 0.6);
  animation: ping 2.2s var(--ease-out) infinite;
}
@keyframes ping { 70%, 100% { box-shadow: 0 0 0 10px rgba(91, 140, 255, 0); } }
.step--hw .rail i { border-color: var(--orange); }

/* Card fotografica */
.card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: clamp(340px, 30vw, 420px);
  padding: clamp(24px, 2.6vw, 32px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #08090b;
  box-shadow: inset 0 0 0 1px var(--line);
  transition: box-shadow 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}
.card-bg {
  position: absolute; inset: 0;
  z-index: -2;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.45;
  filter: saturate(0.6);
  transition: transform 1.2s var(--ease-out), opacity 0.6s var(--ease-out);
}
.card::after {
  content: '';
  position: absolute; inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.9) 100%);
}

.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
/* Stesso trattamento della data in hero */
.card-big {
  font-size: clamp(4rem, 2.4rem + 3.6vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.85;
  white-space: nowrap;
  background: linear-gradient(180deg, rgba(240, 242, 247, 0.95) 0%, rgba(150, 155, 168, 0.45) 60%, rgba(150, 155, 168, 0.05) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.card-tag {
  flex: none;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--logo-blue);
  font-family: var(--font-brand);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  box-shadow: 0 6px 24px -6px var(--blue-glow);
}

.card-body { display: grid; gap: 6px; }
.card-date {
  font-family: var(--font-brand);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-2);
}
.step--main .card-date { color: var(--blue-bright); }
.step--hw .card-date { color: var(--orange); }
.card-title { font-size: clamp(1.5rem, 1.2rem + 0.8vw, 2rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
.card-text { color: var(--text-2); max-width: 30ch; }

@media (hover: hover) {
  .card:hover { box-shadow: inset 0 0 0 1px rgba(91, 140, 255, 0.5), 0 30px 70px -30px rgba(45, 99, 224, 0.6); transform: translateY(-4px); }
  .card:hover .card-bg { transform: scale(1.06); opacity: 0.6; }
  .step--hw .card:hover { box-shadow: inset 0 0 0 1px rgba(255, 159, 67, 0.5), 0 30px 70px -30px rgba(255, 122, 0, 0.45); }
}

@media (min-width: 860px) {
  .steps { grid-template-columns: 1.3fr 1fr 1fr; }
}
@media (max-width: 859px) {
  .rail::before { display: none; }
  .card { min-height: 280px; }
}
@media (prefers-reduced-motion: reduce) {
  .step--main .rail i { animation: none; }
}
</style>
