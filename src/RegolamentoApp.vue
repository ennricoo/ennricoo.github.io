<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Search, X, Link2, ListTree, Info, TriangleAlert } from 'lucide-vue-next'
import NavBar from './components/NavBar.vue'
import RichText from './components/RichText.vue'
import RuleBlocks from './components/RuleBlocks.vue'
import { rules } from './data/regolamento'
import { site, img } from './config'

const bg = img('centrale')
const pad = (n) => String(n).padStart(2, '0')

/* ---------- Dati ---------- */
const updated = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  .format(new Date(`${rules.updated}T12:00:00`))

const sections = rules.sections.map((s, i) => ({
  ...s,
  n: i + 1,
  articles: s.articles.map((a, j) => ({ ...a, n: `${i + 1}.${j + 1}`, id: `art-${i + 1}-${j + 1}` })),
}))
const totalArticles = sections.reduce((t, s) => t + s.articles.length, 0)
const readyChapters = sections.filter((s) => !s.pending).length
const sectionOf = (id) => {
  const m = id.match(/^art-(\d+)-\d+$/)
  return m ? sections[m[1] - 1] : sections.find((s) => s.id === id)
}

// Tutto il testo di un articolo, per la ricerca
const blockText = (b) =>
  typeof b === 'string' ? b
    : b.list || b.steps ? (b.list || b.steps).join(' ')
    : b.note ? b.note
    : b.table ? [...b.table.head, ...b.table.rows.flat()].join(' ')
    : b.map ? b.map.places.map((p) => p.name).join(' ')
    : ''
const plain = (s) => s.replace(/\*\*/g, '').toLowerCase()
const articleText = (a) => plain([a.title, ...a.body.map(blockText)].join(' '))

/* ---------- Capitolo aperto: uno alla volta, come una documentazione ---------- */
const current = ref(sections[0].id)
const chapter = computed(() => sections.find((s) => s.id === current.value))
const prev = computed(() => sections[chapter.value.n - 2])
const next = computed(() => sections[chapter.value.n])

const docTop = () => document.getElementById('documento')
// Su desktop il regolamento è un pannello fisso: scorre solo il suo interno
const scrollEl = ref(null)
const panel = () => matchMedia('(min-width: 1000px)').matches
const navH = () => document.querySelector('.nav')?.offsetHeight ?? 52
const docY = () => Math.round(docTop().getBoundingClientRect().top + scrollY - navH())
const goDoc = () => {
  scrollTo({ top: docY(), behavior: 'instant' })
  if (panel()) scrollEl.value?.focus({ preventScroll: true })
}

/* Scorrimento animato (pagina o pannello), con curva morbida.
   Lo scroll "smooth" nativo non è affidabile ovunque, quindi è fatto a mano. */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = (k) => 1 - Math.pow(1 - k, 3)
const glides = { win: 0, box: 0 }
/* Rotellina morbida nel pannello: ogni scatto sposta un "obiettivo"
   e il testo lo raggiunge con un'inerzia leggera. Il trackpad resta nativo. */
let wheelTarget = null
let wheelFrame = 0
const stopWheel = () => {
  cancelAnimationFrame(wheelFrame)
  wheelFrame = 0
  wheelTarget = null
}
const wheelTick = () => {
  const box = scrollEl.value
  if (!box || wheelTarget === null) return stopWheel()
  const cur = box.scrollTop
  const d = wheelTarget - cur
  if (Math.abs(d) < 0.6) {
    box.scrollTop = wheelTarget
    return stopWheel()
  }
  box.scrollTop = cur + d * 0.18
  // nessun avanzamento (arrotondamenti o bordo): chiude subito
  if (box.scrollTop === cur) {
    box.scrollTop = wheelTarget
    return stopWheel()
  }
  wheelFrame = requestAnimationFrame(wheelTick)
}
const isMouseWheel = (e) =>
  e.deltaMode === 1 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY))
const smoothWheel = (e) => {
  const box = scrollEl.value
  if (!box || !panel() || reduced() || !isMouseWheel(e)) return false
  if (!box.contains(e.target) && !e.target.closest?.('.rg-side')) return false
  e.preventDefault()
  const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
  const max = box.scrollHeight - box.clientHeight
  wheelTarget = Math.max(0, Math.min(max, (wheelTarget ?? box.scrollTop) + delta))
  if (!wheelFrame) wheelFrame = requestAnimationFrame(wheelTick)
  return true
}

const glide = (box, to) => new Promise((resolve) => {
  if (box) stopWheel()
  const key = box ? 'box' : 'win'
  const get = () => (box ? box.scrollTop : scrollY)
  const set = (v) => (box ? (box.scrollTop = v) : scrollTo(0, v))
  const from = get()
  const dist = to - from
  const id = ++glides[key]
  if (reduced() || Math.abs(dist) < 2) { set(to); return resolve() }
  const dur = Math.min(720, 340 + Math.abs(dist) * 0.18)
  const t0 = performance.now()
  let done = false
  const finish = () => {
    if (done) return
    done = true
    if (id === glides[key]) set(to)
    resolve()
  }
  const step = (t) => {
    if (done) return
    if (id !== glides[key]) return finish()
    const k = Math.min(1, (t - t0) / dur)
    set(from + dist * ease(k))
    if (k < 1) requestAnimationFrame(step)
    else finish()
  }
  requestAnimationFrame(step)
  // Se i frame sono sospesi (scheda in background) arriva comunque a destinazione
  setTimeout(finish, dur + 120)
})

// Torna all'inizio del testo (dopo una ricerca o un cambio di capitolo)
const toDocTop = (animate = false) => {
  if (panel()) {
    const box = scrollEl.value
    if (!box) return
    if (animate) glide(box, 0)
    else box.scrollTop = 0
    return
  }
  const el = docTop()
  if (el && el.getBoundingClientRect().top < 0) {
    const y = docY()
    if (animate) glide(null, y)
    else scrollTo(0, y)
  }
}
// Porta un articolo in cima all'area di lettura
const reveal = (el, animate = false) => {
  if (!el) return
  if (panel()) {
    goDoc()
    const box = scrollEl.value
    const to = box.scrollTop + el.getBoundingClientRect().top - box.getBoundingClientRect().top - 40
    if (animate) glide(box, to)
    else box.scrollTop = to
  } else {
    const to = scrollY + el.getBoundingClientRect().top - navH() - 24
    if (animate) glide(null, to)
    else scrollTo(0, to)
  }
}

const open = async (id, { push = true } = {}) => {
  const s = sectionOf(id)
  if (!s) return
  // Dentro lo stesso capitolo si scorre morbido; cambiando capitolo si riparte dall'inizio
  const same = s.id === current.value && !query.value
  query.value = ''
  current.value = s.id
  sheetOpen.value = false
  if (push && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
  await nextTick()
  if (id === s.id) toDocTop(same)
  else {
    active.value = id
    forcedUntil = performance.now() + 900
    reveal(document.getElementById(id), same)
    highlight(id)
  }
  collect()
}
// Evidenzia per qualche secondo l'articolo appena aperto
const flash = ref('')
let flashTimer
const highlight = async (id) => {
  flash.value = ''
  await nextTick()
  flash.value = id
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => { flash.value = '' }, 2600)
}
const fromHash = () => {
  const id = decodeURIComponent(location.hash.slice(1))
  if (sectionOf(id)) open(id, { push: false })
}

/* ---------- Ricerca in tutto il regolamento ---------- */
const query = ref('')
const q = computed(() => query.value.trim().toLowerCase())
const results = computed(() => {
  if (!q.value) return []
  return sections
    .map((s) => ({
      ...s,
      articles: plain(s.title).includes(q.value) ? s.articles : s.articles.filter((a) => articleText(a).includes(q.value)),
    }))
    .filter((s) => s.articles.length)
})
const resultCount = computed(() => results.value.reduce((t, s) => t + s.articles.length, 0))
watch(q, async () => {
  await nextTick()
  toDocTop()
  collect()
})
const submitSearch = () => goDoc()
const clearSearch = () => { query.value = '' }

/* ---------- Dimensione del testo (ricordata nel browser) ---------- */
const sizes = [
  { id: 's', label: 'Testo piccolo', px: 16 },
  { id: 'm', label: 'Testo normale', px: 18 },
  { id: 'l', label: 'Testo grande', px: 20 },
]
const size = ref('m')
const readPx = computed(() => `${sizes.find((s) => s.id === size.value).px}px`)
watch(size, (v) => {
  try { localStorage.setItem('rg-size', v) } catch { /* storage non disponibile */ }
})

/* ---------- Articolo attivo e barra mobile ---------- */
const active = ref('')
let forcedUntil = 0
const showBar = ref(false)
const progress = ref(0)
let headings = []
let frame = 0
const track = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const box = scrollEl.value
    // Articolo appena aperto dall'indice: resta selezionato anche se
    // (in un capitolo corto) non riesce a salire fino in cima
    if (performance.now() >= forcedUntil) {
      // Gli ultimi articoli di un capitolo non salgono mai fino in cima:
      // avvicinandosi alla fine, la linea di lettura scende gradualmente
      // verso il fondo dello schermo, così si attivano mentre li leggi.
      const base = Math.min(260, innerHeight * 0.3)
      const bottom = innerHeight - 120
      const left = panel()
        ? (box ? box.scrollHeight - box.clientHeight - box.scrollTop : 0)
        : document.documentElement.scrollHeight - innerHeight - scrollY
      const scrolled = panel() ? (box?.scrollTop ?? 0) > 0 : scrollY > docY() + 1
      const k = scrolled ? 1 - Math.min(1, Math.max(0, left) / 360) : 0
      const line = base + (bottom - base) * k
      let id = ''
      for (const el of headings) {
        if (el.getBoundingClientRect().top > line) break
        id = el.id
      }
      active.value = id
    }

    const doc = docTop()
    if (panel() && box) {
      progress.value = box.scrollTop / Math.max(1, box.scrollHeight - box.clientHeight)
    } else if (doc) {
      const r = doc.getBoundingClientRect()
      showBar.value = r.top < 80
      progress.value = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)))
    }
  })
}
async function collect() {
  await nextTick()
  headings = [...document.querySelectorAll('.art h3[id]')]
  track()
}

/* ---------- Aggancio tra introduzione e regolamento ----------
   Dall'introduzione un solo gesto verso il basso porta al regolamento,
   allineato sotto la navbar; dall'inizio del regolamento un gesto verso
   l'alto riporta all'introduzione. Dentro il regolamento si scorre liberi. */
let snapping = false
const snapTo = (y) => {
  snapping = true
  glide(null, y).then(() => {
    snapping = false
    if (y > 0 && panel()) scrollEl.value?.focus({ preventScroll: true })
  })
}
// true se lo spostamento richiesto attraversa la zona dell'introduzione
const snapFor = (dir) => {
  const y = scrollY
  const d = docY()
  if (dir > 0 && y < d - 1) return d
  // verso l'alto si torna all'introduzione solo dall'inizio del testo
  const atTextTop = !panel() || (scrollEl.value?.scrollTop ?? 0) <= 0
  if (dir < 0 && y > 0 && y <= d + 1 && atTextTop) return 0
  return null
}
/* ---------- Fine capitolo: continuando a scorrere si passa al successivo ----------
   Serve una "spinta" in più oltre il bordo (barra che si riempie), così il
   cambio non scatta per sbaglio con l'inerzia dello scorrimento. */
const PULL = 190
const pull = ref(0)       // 0..1, riempimento della barra
const pullDir = ref(0)    // 1 = successivo, -1 = precedente
let pullAcc = 0
let pullReset
let pullCooldown = 0
const resetPull = () => { pullAcc = 0; pull.value = 0; pullDir.value = 0 }
const atTextEnd = () => {
  if (panel()) {
    const b = scrollEl.value
    return !!b && b.scrollTop + b.clientHeight >= b.scrollHeight - 2
  }
  return scrollY + innerHeight >= document.documentElement.scrollHeight - 2
}
const atTextStart = () => (panel() ? (scrollEl.value?.scrollTop ?? 0) <= 0 : true)
const turnPage = async (dir) => {
  resetPull()
  stopWheel()
  pullCooldown = performance.now() + 450
  const target = dir > 0 ? next.value : prev.value
  // dal primo capitolo, verso l'alto si torna all'introduzione
  if (!target) {
    if (dir < 0) snapTo(0)
    return
  }
  await open(target.id)
  // tornando indietro si riparte dalla fine del capitolo precedente
  if (dir < 0 && panel() && scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}
const pushPull = (dir, amount) => {
  if (pullDir.value !== dir) { pullAcc = 0; pullDir.value = dir }
  pullAcc += Math.min(Math.abs(amount), 80)
  pull.value = Math.min(1, pullAcc / PULL)
  clearTimeout(pullReset)
  pullReset = setTimeout(resetPull, 420)
  if (pullAcc >= PULL) turnPage(dir)
}
// Gestisce la spinta oltre il bordo; true se l'evento è stato usato
const pageWheel = (e) => {
  if (q.value || scrollY < docY() - 1) return false
  if (performance.now() < pullCooldown) { e.preventDefault(); return true }
  if (e.deltaY > 0 && next.value && atTextEnd()) { e.preventDefault(); pushPull(1, e.deltaY); return true }
  if (e.deltaY < 0 && panel() && atTextStart()) { e.preventDefault(); pushPull(-1, e.deltaY); return true }
  return false
}

const onWheel = (e) => {
  if (sheetOpen.value || e.ctrlKey || !e.deltaY) return
  // l'indice laterale ha il suo scorrimento
  const side = e.target.closest?.('.rg-side nav')
  if (side) {
    const canScroll = e.deltaY < 0 ? side.scrollTop > 0 : side.scrollTop + side.clientHeight < side.scrollHeight - 1
    if (canScroll) return
  }
  // L'indice è fermo fuori dal pannello: sopra di esso la rotellina scorre il testo, mai la pagina
  if (!snapping && panel() && scrollY >= docY() - 1 && e.target.closest?.('.rg-side')) {
    if (pageWheel(e)) return
    e.preventDefault()
    if (!smoothWheel(e)) scrollEl.value.scrollTop += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
    return
  }
  if (!snapping && pageWheel(e)) return
  if (!snapping && scrollY >= docY() - 1 && smoothWheel(e)) return
  if (snapping) {
    if (scrollY < docY() + 1) e.preventDefault()
    return
  }
  const target = snapFor(Math.sign(e.deltaY))
  if (target === null) return
  e.preventDefault()
  snapTo(target)
}
const keysDown = ['PageDown', 'ArrowDown', ' ']
const keysUp = ['PageUp', 'ArrowUp']
// ← → cambiano capitolo quando si sta leggendo
const onChapterKey = (e) => {
  if (sheetOpen.value || q.value || e.altKey || e.ctrlKey || e.metaKey) return
  if (e.target.closest?.('input, textarea, select')) return
  if (scrollY < docY() - 1) return
  if (e.key === 'ArrowRight' && next.value) { e.preventDefault(); open(next.value.id) }
  if (e.key === 'ArrowLeft' && prev.value) { e.preventDefault(); open(prev.value.id) }
}
const onSnapKey = (e) => {
  if (sheetOpen.value || e.target.closest?.('input, textarea, select')) return
  const dir = keysDown.includes(e.key) ? 1 : keysUp.includes(e.key) ? -1 : 0
  if (!dir) return
  const target = snapFor(dir)
  if (target === null) return
  e.preventDefault()
  snapTo(target)
}
// Touch: a fine gesto, se ci si è fermati a metà, completa nella direzione presa
let touchY = 0
let settleTimer
let touchStartY = 0
let touchPull = false
const onTouchStart = (e) => {
  touchY = scrollY
  touchStartY = e.touches[0].clientY
  touchPull = !q.value && !panel() && !!next.value && atTextEnd()
}
const onTouchMove = (e) => {
  if (!touchPull) return
  const dy = touchStartY - e.touches[0].clientY
  pullDir.value = 1
  pull.value = Math.max(0, Math.min(1, dy / 160))
}
const onTouchEnd = () => {
  if (!touchPull) return
  touchPull = false
  if (pull.value >= 1) turnPage(1)
  else resetPull()
}
const settle = () => {
  if (snapping || sheetOpen.value) return
  const y = scrollY
  const d = docY()
  if (y <= 0 || y >= d - 1) return
  snapTo(y > touchY ? d : 0)
}
const onScrollSettle = () => {
  clearTimeout(settleTimer)
  settleTimer = setTimeout(settle, 140)
}
const hasScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window

/* ---------- Indice su mobile ---------- */
const sheetOpen = ref(false)
// L'indice laterale segue la lettura senza muovere la pagina
watch(active, async () => {
  await nextTick()
  const nav = document.querySelector('.rg-side nav')
  const item = nav?.querySelector('.toc-art[aria-current]')
  if (!nav || !item) return
  const top = item.offsetTop - nav.offsetTop
  if (top < nav.scrollTop + 24 || top > nav.scrollTop + nav.clientHeight - 48) {
    nav.scrollTo({ top: top - nav.clientHeight / 3, behavior: reduced() ? 'auto' : 'smooth' })
  }
})
watch(sheetOpen, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })
const onKey = (e) => { if (e.key === 'Escape') sheetOpen.value = false }

/* ---------- Link agli articoli ---------- */
const toast = ref('')
let toastTimer
const notify = (msg) => {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2200)
}
const copy = async (id) => {
  try {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${id}`)
    history.replaceState(null, '', `#${id}`)
    notify('Link copiato')
  } catch {
    notify('Impossibile copiare il link')
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('rg-size')
    if (sizes.some((s) => s.id === saved)) size.value = saved
  } catch { /* storage non disponibile */ }
  // Link condiviso a un capitolo: si apre direttamente sul regolamento
  const startId = decodeURIComponent(location.hash.slice(1))
  if (sectionOf(startId)) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    open(startId, { push: false }).then(() => {
      if (startId === sectionOf(startId).id) scrollTo(0, docY())
    })
  }
  collect()
  window.addEventListener('popstate', fromHash)
  window.addEventListener('scroll', track, { passive: true })
  window.addEventListener('resize', track, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('keydown', onSnapKey)
  window.addEventListener('keydown', onChapterKey)
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener(hasScrollEnd ? 'scrollend' : 'scroll', hasScrollEnd ? settle : onScrollSettle, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onSnapKey)
  window.removeEventListener('keydown', onChapterKey)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener(hasScrollEnd ? 'scrollend' : 'scroll', hasScrollEnd ? settle : onScrollSettle)
  window.removeEventListener('popstate', fromHash)
  window.removeEventListener('scroll', track)
  window.removeEventListener('resize', track)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <a class="skip-link" href="#documento">Vai al regolamento</a>
  <NavBar current="regolamento" />

  <main id="main">
    <!-- ========== Introduzione ========== -->
    <section id="top" class="rg-hero" aria-labelledby="rg-title">
      <div class="rg-bg" aria-hidden="true">
        <img :src="bg.src" :srcset="bg.srcset" sizes="100vw" alt="" width="1920" height="1050" fetchpriority="high" />
      </div>

      <div class="container rg-hero-copy">
        <a :href="site.mainUrl" class="link back"><ArrowLeft aria-hidden="true" /> Home</a>
        <h1 id="rg-title" class="rg-title">{{ rules.title }}</h1>
        <p class="lead rg-lead">{{ rules.intro[0] }}</p>
        <p class="rg-lead-2">{{ rules.intro[1] }}</p>

        <ul class="rg-meta" aria-label="Informazioni sul documento">
          <li>Versione {{ rules.version }}</li>
          <li>Aggiornato il {{ updated }}</li>
          <li v-if="rules.draft" class="is-draft">Bozza</li>
          <li>{{ readyChapters }} capitoli · {{ totalArticles }} articoli</li>
        </ul>

        <form class="rg-search" role="search" @submit.prevent="submitSearch">
          <Search :size="20" aria-hidden="true" />
          <label class="sr-only" for="cerca-hero">Cerca nel regolamento</label>
          <input id="cerca-hero" v-model="query" type="search" placeholder="Cerca nel regolamento, es. “metagaming”" autocomplete="off" />
          <button class="btn btn-blue btn-sm" type="submit">Cerca</button>
        </form>
      </div>

      <div class="giant-wrap" aria-hidden="true">
        <p class="giant">regolamento</p>
      </div>
    </section>

    <!-- ========== Documentazione ========== -->
    <div id="documento" class="reading">
      <!-- Spinta verso l'alto all'inizio di un capitolo -->
      <div class="pull-prev" :class="{ 'is-active': pullDir === -1 && pull > 0 }" aria-hidden="true">
        <span class="pull-text">
          <ArrowUp :size="15" />
          <template v-if="q">Ricerca</template>
          <template v-else-if="prev">Continua a scorrere per tornare a «{{ prev.title }}»</template>
          <template v-else>Continua a scorrere per tornare all'introduzione</template>
        </span>
        <span class="pull-track"><span class="pull-fill" :style="{ transform: `scaleX(${pullDir === -1 ? pull : 0})` }" /></span>
      </div>
      <!-- Indice fuori dall'area che scorre: resta fermo, scorre solo il testo -->
      <div class="rg-side-wrap"><div class="container">
        <aside class="rg-side" aria-label="Indice del regolamento">
          <div class="side-update">
            <span class="side-dot" aria-hidden="true" />
            <p>
              <small>Ultimo aggiornamento</small>
              <time :datetime="rules.updated">{{ updated }}</time>
            </p>
            <span class="side-ver">v{{ rules.version }}</span>
          </div>
          <div class="side-search">
            <Search :size="17" aria-hidden="true" />
            <label class="sr-only" for="cerca-side">Cerca nel regolamento</label>
            <input id="cerca-side" v-model="query" type="search" placeholder="Cerca nel regolamento" autocomplete="off" />
            <button v-if="query" class="side-clear" aria-label="Cancella ricerca" @click="clearSearch"><X :size="16" /></button>
          </div>

          <nav>
            <ol class="toc">
              <li v-for="s in sections" :key="s.id" :class="{ 'is-open': s.id === current && !q }">
                <a
                  :href="`#${s.id}`"
                  class="toc-sec"
                  :aria-current="s.id === current && !q ? 'page' : undefined"
                  @click.prevent="open(s.id)"
                ><span>{{ pad(s.n) }}</span>{{ s.title }}<em v-if="s.pending" class="toc-soon">presto</em></a>
                <ol>
                  <li v-for="a in s.articles" :key="a.id">
                    <a
                      :href="`#${a.id}`"
                      class="toc-art"
                      :aria-current="active === a.id ? 'location' : undefined"
                      @click.prevent="open(a.id)"
                    ><span>{{ a.n }}</span>{{ a.title }}</a>
                  </li>
                </ol>
              </li>
            </ol>
          </nav>

          <div class="side-foot">
            <div class="size" role="group" aria-label="Dimensione del testo">
              <button
                v-for="s in sizes"
                :key="s.id"
                :class="`size-${s.id}`"
                :aria-pressed="size === s.id"
                :aria-label="s.label"
                :title="s.label"
                @click="size = s.id"
              >A</button>
            </div>
            <a href="#top" class="side-top"><ArrowUp :size="16" aria-hidden="true" /> Inizio</a>
          </div>
        </aside>
      </div></div>
      <div ref="scrollEl" class="rg-scroll" tabindex="-1" @scroll.passive="track">
      <div class="container rg-layout">
        <div class="rg-content" :style="{ '--read': readPx }">
          <!-- Risultati di ricerca -->
          <template v-if="q">
            <div class="results" role="status">
              <p>
                <template v-if="resultCount">{{ resultCount }} {{ resultCount === 1 ? 'articolo trovato' : 'articoli trovati' }} per <b>“{{ query.trim() }}”</b></template>
                <template v-else>Nessun articolo trovato per <b>“{{ query.trim() }}”</b></template>
              </p>
              <button class="btn btn-dark btn-sm" @click="clearSearch"><X aria-hidden="true" /> Chiudi ricerca</button>
            </div>

            <section v-for="s in results" :key="s.id" class="found">
              <p class="sec-eyebrow"><b>{{ pad(s.n) }}</b>{{ s.title }}</p>
              <article v-for="a in s.articles" :key="a.id" class="art">
                <span class="art-n" aria-hidden="true">{{ a.n }}</span>
                <div class="art-main">
                <header class="art-head">
                  <h3><span class="sr-only">Articolo {{ a.n }}: </span><RichText :text="a.title" :query="q" /></h3>
                </header>
                <div class="art-body"><RuleBlocks :blocks="a.body" :query="q" /></div>
                <a :href="`#${a.id}`" class="found-open" @click.prevent="open(a.id)">
                  Apri nel capitolo <ArrowRight :size="16" aria-hidden="true" />
                </a>
                </div>
              </article>
            </section>
          </template>

          <!-- Capitolo aperto -->
          <section v-else :key="chapter.id" class="chapter" :aria-labelledby="`cap-${chapter.id}`">
            <header class="chapter-head">
              <p class="sec-eyebrow"><b>{{ pad(chapter.n) }}</b>Capitolo</p>
              <!-- id diverso dall'ancora: la posizione la gestisce open(), non lo scroll nativo -->
              <h2 :id="`cap-${chapter.id}`" class="rg-h2">{{ chapter.title }}</h2>
              <p class="chapter-meta">
                <template v-if="chapter.articles.length">{{ chapter.articles.length }} {{ chapter.articles.length === 1 ? 'articolo' : 'articoli' }}</template>
                <template v-else-if="chapter.pending">In preparazione</template>
              </p>
            </header>

            <div v-if="chapter.intro" class="art-body chapter-intro"><RuleBlocks :blocks="chapter.intro" /></div>
            <div v-if="chapter.pending && !chapter.articles.length" class="chapter-pending">
              <p>Questa sezione del regolamento è in preparazione e verrà pubblicata a breve.</p>
            </div>

            <article v-for="a in chapter.articles" :key="a.id" class="art" :class="{ 'is-flash': flash === a.id }" :aria-labelledby="a.id">
              <span class="art-n" aria-hidden="true">{{ a.n }}</span>
              <div class="art-main">
              <header class="art-head">
                <h3 :id="a.id"><span class="sr-only">Articolo {{ a.n }}: </span><RichText :text="a.title" /></h3>
                <button class="art-link" :aria-label="`Copia link all'articolo ${a.n}`" title="Copia link" @click="copy(a.id)">
                  <Link2 :size="17" />
                </button>
              </header>

              <div class="art-body"><RuleBlocks :blocks="a.body" /></div>
              </div>
            </article>

            <nav class="pager" aria-label="Capitoli">
              <a v-if="prev" :href="`#${prev.id}`" class="pager-link" @click.prevent="open(prev.id)">
                <small><ArrowLeft :size="15" aria-hidden="true" /> Capitolo {{ pad(prev.n) }}</small>
                {{ prev.title }}
              </a>
              <a v-if="next" :href="`#${next.id}`" class="pager-link is-next" @click.prevent="open(next.id)">
                <small>Capitolo {{ pad(next.n) }} <ArrowRight :size="15" aria-hidden="true" /></small>
                {{ next.title }}
              </a>
            </nav>

            <div v-if="next" class="pull-next" :class="{ 'is-active': pullDir === 1 && pull > 0 }" aria-hidden="true">
              <span class="pull-track"><span class="pull-fill" :style="{ transform: `scaleX(${pullDir === 1 ? pull : 0})` }" /></span>
              <span class="pull-text"><ArrowDown :size="15" /> Continua a scorrere per passare a «{{ next.title }}»</span>
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  </main>

  <!-- ========== Barra capitolo (mobile e tablet) ========== -->
  <Transition name="bar">
    <div v-if="showBar" class="chapter-bar">
      <button class="chapter-btn" aria-controls="indice-mobile" :aria-expanded="sheetOpen" @click="sheetOpen = true">
        <ListTree :size="18" aria-hidden="true" />
        <span class="chapter-now">
          <small>{{ q ? 'Ricerca' : `Capitolo ${pad(chapter.n)}` }}</small>
          {{ q ? `“${query.trim()}”` : chapter.title }}
        </span>
        <span class="chapter-cta">Indice</span>
      </button>
      <span class="chapter-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    </div>
  </Transition>

  <Transition name="sheet">
    <div v-if="sheetOpen" class="sheet-wrap" @click.self="sheetOpen = false">
      <div id="indice-mobile" class="sheet" role="dialog" aria-modal="true" aria-label="Indice del regolamento">
        <div class="sheet-head">
          <p class="sec-eyebrow"><b>00</b>Indice</p>
          <button class="sheet-close" aria-label="Chiudi indice" @click="sheetOpen = false"><X :size="20" /></button>
        </div>
        <div class="side-update">
          <span class="side-dot" aria-hidden="true" />
          <p>
            <small>Ultimo aggiornamento</small>
            <time :datetime="rules.updated">{{ updated }}</time>
          </p>
          <span class="side-ver">v{{ rules.version }}</span>
        </div>
        <div class="side-search">
          <Search :size="17" aria-hidden="true" />
          <label class="sr-only" for="cerca-sheet">Cerca nel regolamento</label>
          <input id="cerca-sheet" v-model="query" type="search" placeholder="Cerca nel regolamento" autocomplete="off" @keydown.enter="sheetOpen = false" />
          <button v-if="query" class="side-clear" aria-label="Cancella ricerca" @click="clearSearch"><X :size="16" /></button>
        </div>
        <div class="size size--sheet" role="group" aria-label="Dimensione del testo">
          <span>Testo</span>
          <button
            v-for="s in sizes"
            :key="s.id"
            :class="`size-${s.id}`"
            :aria-pressed="size === s.id"
            :aria-label="s.label"
            @click="size = s.id"
          >A</button>
        </div>
        <ol class="toc toc--sheet">
          <li v-for="s in sections" :key="s.id" class="is-open">
            <a :href="`#${s.id}`" class="toc-sec" :aria-current="s.id === current && !q ? 'page' : undefined" @click.prevent="open(s.id)">
              <span>{{ pad(s.n) }}</span>{{ s.title }}<em v-if="s.pending" class="toc-soon">presto</em>
            </a>
            <ol>
              <li v-for="a in s.articles" :key="a.id">
                <a :href="`#${a.id}`" class="toc-art" :aria-current="active === a.id ? 'location' : undefined" @click.prevent="open(a.id)">
                  <span>{{ a.n }}</span>{{ a.title }}
                </a>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </Transition>

  <Transition name="toast">
    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </Transition>
</template>

<style scoped>
/* ==========================================================
   Introduzione nello stile della home, poi una documentazione:
   indice fisso a sinistra e un capitolo alla volta.
   L'area di lettura usa contrasto morbido (niente bianco puro
   su nero puro), righe di ~70 caratteri e interlinea ampia.
   ========================================================== */
:global(html) { scroll-behavior: auto; }
/* Navbar piena: il testo non deve intravedersi sotto */
:global(.nav.is-scrolled) {
  background: rgba(6, 8, 12, 0.97);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

/* ---------- Introduzione ---------- */
.rg-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding-top: calc(var(--nav-h) + var(--safe-top) + clamp(32px, 6vh, 64px));
}
.rg-bg { position: absolute; inset: 0; z-index: -1; }
.rg-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: saturate(0.7) contrast(1.05);
  animation: kenburns 30s ease-in-out infinite alternate;
}
@keyframes kenburns { from { transform: scale(1.04); } to { transform: scale(1.12) translate(1.5%, -1%); } }
.rg-bg::after {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.6) 70%, #000 100%),
    rgba(4, 10, 28, 0.62);
}

.rg-hero-copy > * { animation: rise 1s var(--ease-out) both; }
.rg-hero-copy > :nth-child(2) { animation-delay: 0.08s; }
.rg-hero-copy > :nth-child(3) { animation-delay: 0.14s; }
.rg-hero-copy > :nth-child(4) { animation-delay: 0.2s; }
.rg-hero-copy > :nth-child(5) { animation-delay: 0.26s; }
.rg-hero-copy > :nth-child(6) { animation-delay: 0.32s; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }

.back { margin-bottom: clamp(16px, 3vh, 32px); }
.rg-title {
  font-size: clamp(2.8rem, 1.2rem + 5vw, 5.75rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 0.95;
  padding-bottom: 0.06em;
  background: linear-gradient(180deg, #ffffff 0%, #d9dce3 50%, #7d818c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.rg-lead { margin-top: 20px; max-width: 34em; }
.rg-lead-2 { margin-top: 10px; max-width: 46em; color: var(--text-3); font-size: 1rem; line-height: 1.55; }

.rg-meta {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-top: 24px;
  padding: 0;
  list-style: none;
}
.rg-meta li {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8125rem;
  color: var(--text-2);
  background: rgba(255,255,255,0.06);
  box-shadow: inset 0 0 0 1px var(--line);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.rg-meta li.is-draft { color: var(--orange-text); box-shadow: inset 0 0 0 1px rgba(255,159,67,0.35); background: rgba(255,159,67,0.1); }

.rg-search {
  display: flex; align-items: center; gap: 10px;
  width: min(100%, 560px);
  height: 60px;
  margin-top: 28px;
  padding: 0 8px 0 20px;
  border-radius: 999px;
  color: var(--text-3);
  background: rgba(10, 14, 24, 0.7);
  box-shadow: inset 0 0 0 1px var(--line-2), 0 20px 60px -20px rgba(0,0,0,0.8);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transition: box-shadow var(--dur) var(--ease);
}
.rg-search:focus-within { box-shadow: inset 0 0 0 1px rgba(91,140,255,0.7), 0 0 0 4px rgba(45,99,224,0.25), 0 20px 60px -20px rgba(0,0,0,0.8); }
.rg-search svg { flex: none; }
.rg-search input, .side-search input {
  flex: 1; min-width: 0; height: 100%;
  border: 0; outline: 0; background: none;
  color: var(--text);
  font: inherit;
}
.rg-search input { font-size: 1.0625rem; }
.rg-search input::placeholder, .side-search input::placeholder { color: var(--text-3); }
.rg-search .btn { min-height: 44px; padding: 0 20px; font-size: 0.9375rem; }
input[type='search']::-webkit-search-cancel-button { display: none; }

.giant-wrap { overflow: hidden; margin-top: auto; padding-top: clamp(36px, 6vh, 64px); pointer-events: none; }
.giant {
  font-size: 15vw;
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 0.8;
  text-align: center;
  white-space: nowrap;
  margin-bottom: -0.14em;
  background: linear-gradient(180deg, rgba(235, 238, 245, 0.5) 0%, rgba(150, 155, 168, 0.22) 45%, rgba(10, 10, 12, 0) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: giant-in 1.6s var(--ease-out) 0.25s both;
}
@keyframes giant-in { from { opacity: 0; transform: translateY(20%); } to { opacity: 1; transform: none; } }

/* ---------- Documentazione ---------- */
.reading {
  /* Grigio-blu molto scuro invece del nero: affatica meno con testo chiaro */
  --paper: #111419;
  --paper-2: #161a21;
  --ink: #ccd0d6;
  --ink-2: #a9adb6;
  --ink-3: #868b95;
  --rule: rgba(255, 255, 255, 0.07);
  --accent: #8aa9ff;
  min-height: calc(100dvh - var(--nav-h) - var(--safe-top));
  scroll-margin-top: calc(var(--nav-h) + var(--safe-top));
  background: var(--paper);
  box-shadow: inset 0 1px 0 var(--rule);
}
.rg-scroll { outline: 0; }
/* Desktop: pannello alto quanto lo schermo sotto la navbar.
   Il testo scorre solo qui dentro e sfuma in alto invece di finire sotto la navbar. */
@media (min-width: 1000px) {
  .reading { height: calc(100dvh - var(--nav-h) - var(--safe-top)); overflow: hidden; }
  /* Scorre solo il testo nel pannello: niente barra di scorrimento della pagina */
  :global(html) { scrollbar-width: none; }
  :global(html::-webkit-scrollbar) { display: none; }
  .rg-scroll {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.14) transparent;
  }
  /* Sfumatura sovrapposta in alto: più leggera di una mask sul contenitore che scorre */
  .reading { position: relative; }
  .reading::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 12px;
    height: 40px;
    z-index: 2;
    background: linear-gradient(180deg, var(--paper) 15%, rgba(17, 20, 25, 0));
    pointer-events: none;
  }
}
.rg-layout {
  display: grid;
  gap: 40px;
  padding-top: clamp(40px, 5vw, 72px);
  padding-bottom: clamp(64px, 8vw, 112px);
}
@media (min-width: 1000px) {
  .rg-layout { grid-template-columns: 260px minmax(0, 1fr); gap: clamp(48px, 6vw, 96px); }
}

/* Indice fisso (desktop): sta sopra il pannello, fuori dall'area che scorre */
.rg-side-wrap, .rg-side { display: none; }
@media (min-width: 1000px) {
  /* stessa colonna del layout; il gutter compensa la barra di scorrimento del testo */
  .rg-side-wrap {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 3;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    pointer-events: none;
  }
  .rg-side-wrap > .container { height: 100%; }
  .rg-side {
    display: flex; flex-direction: column;
    width: 260px;
    height: 100%;
    padding: clamp(40px, 5vw, 72px) 0 32px;
    pointer-events: auto;
  }
  .rg-content { grid-column: 2; }
  .rg-side nav { flex: 1; overflow-y: auto; margin-top: 16px; padding-right: 8px; overscroll-behavior: contain; scrollbar-width: thin; }
}
.side-update {
  display: flex; align-items: center; gap: 12px;
  flex: none;
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  box-shadow: inset 0 0 0 1px var(--rule, var(--line));
}
.side-update p { flex: 1; display: grid; line-height: 1.3; }
.side-update small { font-size: 0.72rem; color: var(--text-3); }
.side-update time { font-size: 0.875rem; font-weight: 600; color: var(--text); }
.side-dot {
  flex: none;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.18);
}
.side-ver {
  flex: none;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-2);
  background: rgba(255,255,255,0.06);
}

.side-search {
  display: flex; align-items: center; gap: 8px;
  flex: none;
  height: 44px;
  padding: 0 6px 0 14px;
  border-radius: 12px;
  color: var(--ink-3, var(--text-3));
  background: rgba(255,255,255,0.04);
  box-shadow: inset 0 0 0 1px var(--rule, var(--line));
  transition: box-shadow var(--dur) var(--ease);
}
.side-search:focus-within { box-shadow: inset 0 0 0 1px rgba(91,140,255,0.6); }
.side-search input { font-size: 0.9375rem; }
.side-clear { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; color: var(--text-2); }
.side-clear:hover { background: rgba(255,255,255,0.08); }

.toc, .toc ol { list-style: none; padding: 0; }
.toc > li + li { margin-top: 2px; }
.toc ol { display: none; margin: 2px 0 10px 19px; padding-left: 12px; border-left: 1px solid var(--line); }
.toc li.is-open ol { display: block; }
.toc a {
  display: flex; gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  line-height: 1.4;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.toc a:hover { background: rgba(255,255,255,0.04); color: var(--text); }
.toc-sec { font-size: 0.9375rem; font-weight: 600; color: var(--text-2); }
.toc-sec span { font-family: var(--font-brand); font-size: 0.7rem; padding-top: 0.25em; color: var(--text-4); }
.toc-sec[aria-current] { color: var(--text); background: rgba(255,255,255,0.05); }
.toc-sec[aria-current] span { color: var(--blue-bright); }
.toc-soon {
  margin-left: auto;
  align-self: center;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 500;
  color: var(--text-3);
  background: rgba(255,255,255,0.05);
}
.toc-art { font-size: 0.875rem; color: var(--text-3); }
.toc-art span { flex: none; min-width: 2em; font-variant-numeric: tabular-nums; color: var(--text-4); }
.toc-art[aria-current] { color: #c3d3ff; background: rgba(91,140,255,0.1); }
.toc-art[aria-current] span { color: #8aa9ff; }

.side-foot {
  display: flex; align-items: center; justify-content: space-between;
  flex: none;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
}
.side-top {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 10px;
  font-size: 0.8125rem;
  color: var(--text-3);
}
.side-top:hover { color: var(--text); }

/* Dimensione testo: tre "A" crescenti */
.size { display: flex; align-items: center; gap: 2px; padding: 3px; border-radius: 10px; background: rgba(255,255,255,0.04); }
.size button {
  display: grid; place-items: center;
  width: 34px; height: 30px;
  border-radius: 7px;
  font-weight: 600;
  color: var(--text-3);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.size button:hover { color: var(--text); }
.size button[aria-pressed='true'] { color: var(--text); background: rgba(255,255,255,0.1); }
.size-s { font-size: 0.75rem; }
.size-m { font-size: 0.9375rem; }
.size-l { font-size: 1.125rem; }
.size--sheet { margin-top: 12px; width: fit-content; padding-left: 12px; }
.size--sheet span { margin-right: 8px; font-size: 0.8125rem; color: var(--text-3); }
.size--sheet button { width: 44px; height: 40px; }

/* Testo: misura e ritmo per una lettura lunga */
.rg-content {
  --read: 18px;
  max-width: 44rem;
  font-size: var(--read);
}

.chapter { animation: page-in 0.42s var(--ease-out) both; }
@keyframes page-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.chapter-intro { margin-bottom: 2.4em; }
.chapter-intro :deep(p:first-child) { font-size: 1.06em; color: #dfe2e7; }
.chapter-pending {
  padding: 1.2em 1.4em;
  border-radius: 14px;
  font-size: 0.95em;
  color: var(--ink-2);
  background: rgba(255,255,255,0.03);
  box-shadow: inset 0 0 0 1px var(--rule);
}

.chapter-head { padding-bottom: 1.4em; margin-bottom: 2.2em; border-bottom: 1px solid var(--rule); }
.chapter-head .sec-eyebrow { margin-bottom: 14px; }
.rg-h2 {
  font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.6rem);
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: #eceef2;
}
.chapter-meta { margin-top: 0.6em; font-size: 0.85rem; color: var(--ink-3); }

/* Articoli: numero a margine (come nei documenti) e filo sottile tra un articolo e l'altro */
.art { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, 1fr); }
.art-main { min-width: 0; }
@media (min-width: 640px) {
  .art { grid-template-columns: 3.2em minmax(0, 1fr); column-gap: 0.9em; }
}
/* Articolo aperto dall'indice o da un link: si evidenzia solo il titolo */
.art-head { position: relative; isolation: isolate; }
.art.is-flash .art-head::before {
  content: '';
  position: absolute;
  inset: -0.35em -0.7em;
  z-index: -1;
  border-radius: 10px;
  background: rgba(91, 140, 255, 0.14);
  box-shadow: inset 3px 0 0 var(--accent);
  animation: flash 2.6s var(--ease) both;
}
@keyframes flash {
  0% { opacity: 0; }
  12%, 55% { opacity: 1; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .art.is-flash .art-head::before { animation: none; }
}
.art + .art { margin-top: 2.2em; padding-top: 2.2em; border-top: 1px solid var(--rule); }
.art-head { display: flex; align-items: baseline; gap: 12px; }
.art-n {
  display: block;
  margin-bottom: 0.35em;
  font-size: 0.8em;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: var(--accent);
}
@media (min-width: 640px) {
  /* allineato alla prima riga del titolo */
  .art-n {
    margin: 0;
    padding-top: 0.12em;
    line-height: calc(1.18 * 1.3 / 0.8);
    text-align: right;
    opacity: 0.85;
  }
}
.art-head h3 {
  flex: 1;
  min-width: 0;
  font-size: 1.18em;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: #e6e8ec;
  scroll-margin-top: calc(var(--nav-h) + var(--safe-top) + 40px);
}
.art-link {
  flex: none;
  align-self: center;
  display: grid; place-items: center;
  width: 36px; height: 36px;
  margin: -6px -6px -6px 0;
  border-radius: 10px;
  color: var(--ink-3);
  opacity: 0.5;
  transition: opacity var(--dur) var(--ease), background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.art:hover .art-link, .art-link:focus-visible { opacity: 1; }
.art-link:hover { background: rgba(255,255,255,0.06); color: var(--ink); }

.art-body {
  margin-top: 0.6em;
  color: var(--ink);
  line-height: 1.8;
  letter-spacing: 0.002em;
  -webkit-hyphens: auto;
  hyphens: auto;
}
.art-body > :deep(* + *) { margin-top: 1em; }
.art-body :deep(strong) { color: #f0f1f4; font-weight: 600; }
.art-body :deep(ul) { padding-left: 1.25em; }
.art-body :deep(ul li) { padding-left: 0.2em; }
.art-body :deep(ul li + li) { margin-top: 0.4em; }
.art-body :deep(ul li::marker) { color: var(--ink-3); }
.art-body :deep(.steps) { list-style: none; padding: 0; display: grid; gap: 0.5em; }
.art-body :deep(.steps li) { display: flex; align-items: baseline; gap: 0.75em; }
.art-body :deep(.steps li span) {
  flex: none;
  display: grid; place-items: center;
  width: 1.6em; height: 1.6em;
  border-radius: 50%;
  font-size: 0.8em; font-weight: 600;
  color: var(--ink);
  background: rgba(255,255,255,0.07);
}

.art-body :deep(.callout) {
  display: flex; gap: 0.75em;
  padding: 0.9em 1.1em;
  border-radius: 12px;
  font-size: 0.95em;
  line-height: 1.6;
}
.art-body :deep(.callout svg) { flex: none; margin-top: 0.2em; }
.art-body :deep(.callout--info) { color: #c5d3f5; background: rgba(91,140,255,0.08); box-shadow: inset 3px 0 0 rgba(138,169,255,0.6); }
.art-body :deep(.callout--warning) { color: #f3cfa8; background: rgba(255,159,67,0.08); box-shadow: inset 3px 0 0 rgba(255,159,67,0.6); }

.art-body :deep(.table-wrap) { overflow-x: auto; border-radius: 12px; box-shadow: inset 0 0 0 1px var(--rule); }
.art-body :deep(table) { width: 100%; border-collapse: collapse; font-size: 0.92em; line-height: 1.5; }
.art-body :deep(th), .art-body :deep(td) { padding: 0.75em 1em; text-align: left; border-bottom: 1px solid var(--rule); }
.art-body :deep(th) { font-weight: 600; font-size: 0.85em; color: var(--ink-3); background: var(--paper-2); }
.art-body :deep(td) { font-variant-numeric: tabular-nums; color: var(--ink-2); }
.art-body :deep(td:first-child) { color: var(--ink); }
.art-body :deep(tbody tr:last-child td) { border-bottom: 0; }

/* Ricerca */
.results {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
  margin-bottom: 2.5em;
  padding: 16px 16px 16px 20px;
  border-radius: var(--radius);
  font-size: 1rem;
  background: rgba(45,99,224,0.08);
  box-shadow: inset 0 0 0 1px var(--line-blue);
  color: var(--ink-2);
}
.results b { color: var(--ink); font-weight: 600; }
.found + .found { margin-top: 3em; padding-top: 2.5em; border-top: 1px solid var(--rule); }
.found .sec-eyebrow { margin-bottom: 1.4em; }
.found-open {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 0.8em;
  font-size: 0.85em;
  font-weight: 600;
  color: var(--accent);
}
.found-open:hover { text-decoration: underline; text-underline-offset: 3px; }
.art :deep(mark.hit) { background: rgba(255, 200, 60, 0.22); color: #fff3d6; border-radius: 3px; padding: 0 1px; }

/* Spinta oltre il bordo per cambiare capitolo */
.pull-next {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 2.5em;
  padding-bottom: 1em;
  font-size: 0.8125rem;
  color: var(--ink-3);
  transition: color var(--dur) var(--ease);
}
.pull-next.is-active { color: var(--ink); }
.pull-text { display: inline-flex; align-items: center; gap: 6px; text-align: center; }
.pull-track {
  position: relative;
  width: min(220px, 60%);
  height: 3px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255,255,255,0.08);
}
.pull-fill {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #2d63e0, #8aa9ff);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.12s linear;
}
.pull-prev {
  position: absolute;
  top: 12px; left: 0; right: 12px;
  z-index: 3;
  display: grid;
  justify-items: center;
  gap: 10px;
  font-size: 0.8125rem;
  color: var(--ink);
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition: opacity 0.2s var(--ease), transform 0.2s var(--ease);
}
.pull-prev.is-active { opacity: 1; transform: none; }
@media (max-width: 999px) { .pull-prev { display: none; } }

/* Precedente / successivo */
.pager { display: grid; gap: 12px; margin-top: 3.5em; font-size: 1rem; }
@media (min-width: 640px) { .pager { grid-template-columns: 1fr 1fr; } }
.pager-link {
  display: grid; gap: 4px;
  padding: 16px 20px;
  border-radius: var(--radius);
  font-weight: 600;
  color: var(--ink);
  background: rgba(255,255,255,0.025);
  box-shadow: inset 0 0 0 1px var(--rule);
  transition: box-shadow var(--dur) var(--ease), background-color var(--dur) var(--ease);
}
.pager-link small { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; font-weight: 400; color: var(--ink-3); }
.pager-link.is-next { text-align: right; grid-column: -2; }
.pager-link.is-next small { justify-content: flex-end; }
.pager-link:hover { background: rgba(255,255,255,0.045); box-shadow: inset 0 0 0 1px rgba(91,140,255,0.4); }

/* ---------- Barra capitolo (mobile e tablet) ---------- */
.chapter-bar {
  position: fixed;
  left: 12px; right: 12px;
  bottom: calc(12px + var(--safe-bottom));
  z-index: 45;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(20, 24, 32, 0.92);
  -webkit-backdrop-filter: saturate(160%) blur(20px);
  backdrop-filter: saturate(160%) blur(20px);
  box-shadow: inset 0 0 0 1px var(--line-2), 0 16px 40px -12px rgba(0,0,0,0.8);
}
@media (min-width: 1000px) { .chapter-bar { display: none; } }
@media (max-width: 999px) { .rg-layout { padding-bottom: 120px; } }
.chapter-btn {
  display: flex; align-items: center; gap: 12px;
  width: 100%;
  min-height: 60px;
  padding: 10px 10px 10px 16px;
  text-align: left;
}
.chapter-btn > svg { flex: none; color: var(--blue-bright); }
.chapter-now {
  flex: 1; min-width: 0;
  display: grid;
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.chapter-now small { font-size: 0.72rem; font-weight: 400; color: var(--text-3); }
.chapter-cta {
  flex: none;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8125rem; font-weight: 600;
  background: rgba(255,255,255,0.08);
}
.chapter-progress {
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #2d63e0, #5b8cff);
  transform-origin: left;
}
.bar-enter-active, .bar-leave-active { transition: opacity var(--dur) var(--ease); }
.bar-enter-from, .bar-leave-to { opacity: 0; }

.sheet-wrap {
  position: fixed; inset: 0;
  z-index: 60;
  display: flex; align-items: flex-end;
  background: rgba(0,0,0,0.6);
}
.sheet {
  --rule: rgba(255,255,255,0.07);
  width: 100%;
  max-height: 82dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px max(20px, var(--safe-left)) calc(24px + var(--safe-bottom)) max(20px, var(--safe-right));
  border-radius: 24px 24px 0 0;
  background: #12151b;
  box-shadow: inset 0 1px 0 var(--line-2);
}
.sheet-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.sheet-head .sec-eyebrow { margin: 0; }
.sheet-close { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 999px; background: rgba(255,255,255,0.06); }
.toc--sheet { margin-top: 16px; }
.toc--sheet a { padding-block: 11px; }
.sheet-enter-active, .sheet-leave-active { transition: opacity var(--dur) var(--ease); }
.sheet-enter-active .sheet, .sheet-leave-active .sheet { transition: transform 0.35s var(--ease-out); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateY(40px); }

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(88px + var(--safe-bottom));
  z-index: 70;
  transform: translateX(-50%);
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 0.875rem;
  background: #e8e9ec;
  color: #111;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.toast-enter-active, .toast-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 8px); }

/* ---------- Stampa ---------- */
@media print {
  .rg-bg, .giant-wrap, .rg-search, .rg-side, .pager, .chapter-bar, .art-link { display: none !important; }
  .reading { background: none; }
  .rg-layout { display: block; }
}
</style>
