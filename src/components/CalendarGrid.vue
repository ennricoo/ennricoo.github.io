<script setup>
import { computed } from 'vue'
import { TriangleAlert } from 'lucide-vue-next'
import { calendar as cal } from '../data/events'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const WEEKDAYS_LONG = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
const colOf = (date) => (date.getDay() + 6) % 7 // 0 = lunedì

const today = new Date()
today.setHours(0, 0, 0, 0)

const lastDay = new Date(cal.year, cal.month, 0).getDate()
const startCol = colOf(new Date(cal.year, cal.month - 1, cal.startDay))
const messaCols = new Set(cal.messa.days.map((d) => (d + 6) % 7))

const inPeriod = (d) => cal.period && d >= cal.period.from && d <= cal.period.to

function messaFor(d, dow, ev) {
  if (ev?.messa === false) return null
  if (typeof ev?.messa === 'string') return { custom: ev.messa }
  if (ev?.messa === true || (d >= cal.messa.from && cal.messa.days.includes(dow))) {
    return { label: cal.messa.label, time: cal.messa.time }
  }
  return null
}

const days = computed(() => {
  const out = []
  for (let d = cal.startDay; d <= lastDay; d++) {
    const date = new Date(cal.year, cal.month - 1, d)
    const ev = cal.events[d]
    const col = colOf(date)
    out.push({
      d,
      col,
      weekday: WEEKDAYS_LONG[col],
      ev,
      variant: ev?.variant ?? (inPeriod(d) ? 'hw-free' : 'free'),
      messa: messaFor(d, date.getDay(), ev),
      isToday: +date === +today,
      isPast: date < today,
    })
  }
  return out
})

// Colonna vuota dopo l'ultimo giorno (decorazione luna)
const trailingCol = computed(() => {
  const last = days.value[days.value.length - 1]
  return last.col < 6 ? last.col + 2 : 0
})

const monthShort = cal.title.slice(0, 3).toLowerCase()
</script>

<template>
  <div class="calendar">
      <!-- Intestazione giorni (solo desktop) -->
      <div class="cal-weekdays" aria-hidden="true">
        <span v-for="(w, i) in WEEKDAYS" :key="w" :class="{ 'has-messa': messaCols.has(i) }">
          <i v-if="messaCols.has(i)">✝</i>{{ w }}
        </span>
      </div>

      <ol class="cal-grid">
        <!-- Messa ricorrente -->
        <li class="messa-card" :style="{ '--span': startCol || 7 }">
          <span class="mc-label"><i aria-hidden="true">✝</i> {{ cal.messa.label }}</span>
          <p class="mc-days">{{ cal.messa.daysLabel }}</p>
          <p class="mc-time">{{ cal.messa.timeRange }} · dal {{ cal.messa.from }} {{ cal.title.toLowerCase() }}</p>
          <span class="mc-cross" aria-hidden="true"></span>
        </li>

        <li
          v-for="day in days"
          :key="day.d"
          class="day"
          :class="[`day--${day.variant}`, { 'is-today': day.isToday, 'is-past': day.isPast }]"
          :style="{ '--col': day.col + 1 }"
        >
          <div class="day-date">
            <span class="day-num">{{ day.d }}</span>
            <span class="day-wd">{{ day.weekday }}</span>
            <span v-if="day.ev?.badge" class="day-badge">{{ day.ev.badge }}</span>
            <span v-if="day.isToday" class="day-badge day-badge--today">Oggi</span>
          </div>

          <div class="day-body">
            <template v-if="day.ev">
              <h3 class="day-title">{{ day.ev.title }}</h3>
              <p class="day-sub">{{ day.ev.sub }}</p>
            </template>
            <p v-else class="day-sub day-free">Libero</p>

            <div class="day-foot">
              <span v-if="day.ev?.time" class="chip chip--time">{{ day.ev.time }}</span>
              <p v-if="day.ev?.note" class="day-note">{{ day.ev.note }}</p>
              <span v-if="day.messa?.custom" class="messa-custom"><i aria-hidden="true">✝</i> {{ day.messa.custom }}</span>
              <span v-else-if="day.messa" class="chip chip--messa">
                <i aria-hidden="true">✝</i>
                <span>{{ day.messa.label }}<br />{{ day.messa.time }}</span>
              </span>
            </div>
          </div>
        </li>

        <li v-if="trailingCol" class="moon-cell" :style="{ '--col': trailingCol }" aria-hidden="true">
          <span class="moon"></span>
        </li>
      </ol>

      <p v-if="cal.period" class="period">
        <span class="period-pill">
          <span class="period-label">{{ cal.period.label }}</span>
          <span class="period-dates">{{ cal.period.from }} – {{ cal.period.to }} {{ monthShort }}</span>
        </span>
      </p>

      <aside v-if="cal.warning" class="warning" aria-labelledby="warn-title">
        <div class="warn-head">
          <TriangleAlert :size="36" :stroke-width="1.75" class="warn-icon" aria-hidden="true" />
          <div>
            <h3 id="warn-title" class="warn-title">{{ cal.warning.title }}</h3>
            <p class="warn-sub">{{ cal.warning.subtitle }}</p>
          </div>
        </div>
        <div class="warn-body">
          <p>
            Durante le giornate del <strong>29, 30 e 31</strong> potranno essere presenti <u>jumpscare</u>,
            effetti improvvisi e contenuti potenzialmente impressionanti.
          </p>
          <p>La partecipazione è sconsigliata alle persone affette da patologie cardiache o particolarmente sensibili a stimoli improvvisi.</p>
          <p>
            Ai fini della tutela e della corretta informazione degli utenti, si invita a prendere visione del presente avviso
            prima di partecipare. In caso di dubbi o qualora non si desideri essere esposti a tali contenuti, è possibile
            aprire un ticket e richiederne l'esclusione.
          </p>
        </div>
        <p class="warn-legal">
          <strong>Riferimento normativo</strong> · Le presenti avvertenze sono fornite in conformità ai principi di informazione
          e tutela previsti dalla normativa italiana applicabile, tra cui il D.Lgs. 206/2005 (Codice del Consumo), ove applicabile.
        </p>
      </aside>

      <p class="footnote">* {{ cal.footnote }}</p>
  </div>
</template>

<style scoped>
/* ---------- Griglia ---------- */
.cal-weekdays { display: none; }
.cal-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 10px;
}

/* Card messa ricorrente */
.messa-card {
  position: relative;
  grid-column: 1 / -1;
  overflow: hidden;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 18px;
  border: 1px solid rgba(91, 140, 255, 0.25);
  background:
    radial-gradient(ellipse 60% 120% at 0% 0%, rgba(45, 99, 224, 0.22), transparent 70%),
    #0a0b0e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 160px;
}
.mc-label { font-family: var(--font-brand); text-transform: uppercase; letter-spacing: 0.24em; color: var(--blue-bright); font-size: 0.75rem; }
.mc-label i { font-style: normal; }
.mc-days {
  font-size: clamp(1.8rem, 1.2rem + 1.8vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.05;
  margin-top: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #d9dce3 50%, #7d818c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.mc-time { color: var(--text-2); font-size: clamp(1rem, 0.95rem + 0.3vw, 1.2rem); margin-top: 8px; }
.mc-cross {
  position: absolute;
  right: clamp(24px, 8%, 80px);
  top: 50%;
  width: 70px; height: 120px;
  transform: translateY(-50%);
  opacity: 0.08;
  background:
    linear-gradient(#e6e8ee, #e6e8ee) center / 20px 100% no-repeat,
    linear-gradient(#e6e8ee, #e6e8ee) center 30% / 100% 20px no-repeat;
}

/* Card giorno (layout agenda, mobile/tablet) */
.day {
  position: relative;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: #0a0b0e;
  transition: border-color var(--dur) var(--ease), transform 0.4s var(--ease-out);
}
@media (hover: hover) { .day:hover { border-color: rgba(255, 255, 255, 0.22); transform: translateY(-2px); } }
.day-date { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.day-num {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #9a9ea8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.day-wd { font-size: 0.75rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; }
.day-badge {
  font-family: var(--font-brand);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.55);
  color: var(--orange-text);
}
.day-badge--today { background: #fff; color: #000; }
.day-body { display: flex; flex-direction: column; min-width: 0; }
.day-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
.day-sub { font-size: 0.9rem; color: var(--text-2); margin-top: 4px; line-height: 1.35; }
.day-free { color: var(--text-3); margin-top: 6px; }
.day-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; }
.day-foot:empty { display: none; }
.day-note { flex-basis: 100%; font-size: 0.82rem; font-weight: 600; line-height: 1.3; color: var(--orange-text); }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-family: var(--font-brand);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.25;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-2);
}
.chip i { font-style: normal; font-size: 0.8rem; }
.chip--time { background: #fff; color: #000; }
.messa-custom { font-size: 0.9rem; font-weight: 600; color: var(--text); }
.messa-custom i { font-style: normal; color: var(--orange); }

/* Varianti */
.day--free .day-num { opacity: 0.45; }
.day--free .day-free { color: var(--text-4); }
.day--inaug { border-color: rgba(91, 140, 255, 0.35); background: linear-gradient(180deg, rgba(45, 99, 224, 0.12), #0a0b0e 70%); }
.day--launch {
  border-color: rgba(120, 165, 255, 0.6);
  background: linear-gradient(180deg, #2d63e0 0%, #16316e 100%);
  box-shadow: 0 18px 50px -18px rgba(45, 99, 224, 0.7);
}
.day--launch .day-num { background: none; -webkit-text-fill-color: #fff; }
.day--launch .day-sub, .day--launch .day-wd { color: rgba(255, 255, 255, 0.85); }
.day--launch .chip--messa { background: rgba(0, 0, 0, 0.25); color: #fff; }

/* Halloweek: arancione solo come accento, su fondo scuro */
.day--hw {
  border-color: rgba(255, 159, 67, 0.7);
  background: linear-gradient(180deg, rgba(255, 140, 40, 0.28) 0%, rgba(255, 122, 0, 0.06) 70%), #0c0906;
  box-shadow: 0 18px 50px -20px rgba(255, 106, 0, 0.55);
}
.day--hw .day-num,
.day--hw-dark .day-num { background: linear-gradient(180deg, #ffd2a6 0%, #ff9f43 100%); -webkit-background-clip: text; background-clip: text; }
.day--hw .day-note { color: var(--orange-text); }
.day--hw .chip--messa { background: rgba(255, 159, 67, 0.16); color: #ffd2a6; }
.day--hw-dark { border-color: rgba(255, 159, 67, 0.4); background: linear-gradient(180deg, rgba(255, 140, 40, 0.1), #0a0b0e 70%); }
.day--hw-free { border-color: rgba(255, 159, 67, 0.12); background: #0a0b0e; }
.day--hw-free .day-num { opacity: 0.45; }

.day.is-past { opacity: 0.5; }
.day.is-today { outline: 2px solid var(--blue-bright); outline-offset: 2px; }

.moon-cell { display: none; }

/* ---------- Desktop: vera griglia mensile ---------- */
@media (min-width: 1100px) {
  .cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
    text-align: center;
    font-family: var(--font-brand);
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .cal-weekdays .has-messa { color: var(--text); }
  .cal-weekdays i { font-style: normal; color: var(--blue-bright); margin-right: 6px; }

  .cal-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); }
  .messa-card { grid-column: 1 / span var(--span); }
  .day:first-of-type { grid-column-start: var(--col); }
  .day {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 300px;
    padding: 14px;
  }
  .day-date { flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .day-num { font-size: 2.4rem; }
  .day-wd { display: none; }
  .day-body { flex: 1; }
  .day-title { font-size: 1.05rem; }
  .day-sub { font-size: 0.85rem; }
  .day-foot { margin-top: auto; padding-top: 12px; }
  .day-note { font-size: 0.78rem; }
  .chip--messa, .chip--time { width: 100%; }
  .chip--time { justify-content: flex-start; }

  .moon-cell { display: grid; place-items: center; grid-column: var(--col); }
  .moon {
    width: 84px; height: 84px;
    border-radius: 50%;
    box-shadow: -18px 10px 0 0 #ffd79a;
    transform: translateX(14px);
    filter: drop-shadow(0 0 24px rgba(255, 190, 110, 0.35));
  }
}

/* ---------- Halloweek ---------- */
.period { display: flex; justify-content: center; margin-top: 28px; }
.period-pill {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding: 14px 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 159, 67, 0.6);
  background: rgba(255, 140, 40, 0.08);
  font-family: var(--font-brand);
  text-transform: uppercase;
  letter-spacing: 0.22em;
}
.period-label { color: var(--orange-text); font-size: clamp(0.8rem, 0.7rem + 0.5vw, 1.1rem); }
.period-dates { font-size: clamp(0.8rem, 0.7rem + 0.5vw, 1.1rem); }

/* ---------- Avviso ---------- */
.warning {
  position: relative;
  margin-top: clamp(32px, 5vw, 56px);
  padding: clamp(24px, 4vw, 40px) clamp(20px, 4vw, 44px) clamp(24px, 4vw, 40px) clamp(32px, 5vw, 56px);
  border-radius: 20px;
  border: 1px solid rgba(255, 159, 67, 0.35);
  background: linear-gradient(180deg, rgba(255, 140, 40, 0.08), #0a0b0e 60%);
  overflow: hidden;
}
.warning::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 10px;
  background: repeating-linear-gradient(-45deg, var(--orange) 0 10px, #120a04 10px 20px);
}
.warn-head { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.warn-icon { color: var(--orange); flex: none; }
.warn-title { font-family: var(--font-brand); font-weight: 400; text-transform: uppercase; letter-spacing: 0.2em; color: var(--orange-text); font-size: clamp(1rem, 0.8rem + 0.9vw, 1.5rem); }
.warn-sub { font-family: var(--font-brand); text-transform: uppercase; letter-spacing: 0.24em; font-size: 0.7rem; color: var(--text-2); margin-top: 6px; }
.warn-body { display: grid; gap: 12px; font-size: clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem); line-height: 1.55; color: var(--text-2); }
.warn-body p:first-child { color: var(--text); }
.warn-body strong { color: var(--orange-text); }
.warn-legal { margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255, 138, 31, 0.3); font-size: 0.85rem; color: var(--text-2); }
.warn-legal strong { font-family: var(--font-brand); font-weight: 400; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--orange-text); }

.footnote { margin-top: 28px; text-align: center; font-size: 0.9rem; color: var(--text-3); }
</style>
