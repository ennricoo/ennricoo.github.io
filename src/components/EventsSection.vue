<script setup>
import { ArrowRight } from 'lucide-vue-next'
import EventSteps from './EventSteps.vue'
</script>

<template>
  <section id="eventi" class="section events" aria-labelledby="events-title">
    <div class="container">
      <header class="ev-head">
        <div>
          <p class="sec-eyebrow" v-reveal><b>03</b>Eventi</p>
          <h2 id="events-title" class="h2" v-reveal>Due settimane<br />da vivere.</h2>
        </div>
        <a href="/eventi/" class="btn btn-white ev-all" v-reveal>
          Calendario completo <ArrowRight aria-hidden="true" />
        </a>
      </header>

      <EventSteps class="ev-steps" />
    </div>
  </section>
</template>

<style scoped>
.events { padding-top: clamp(56px, 4rem + 2vw, 112px); }

.ev-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.ev-all svg { transition: transform 0.4s var(--ease-out); }
.ev-all:hover svg { transform: translateX(4px); }

.ev-steps { margin-top: clamp(40px, 5vw, 64px); }
</style>
