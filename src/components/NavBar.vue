<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import BrandWordmark from './BrandWordmark.vue'
import DiscordIcon from './DiscordIcon.vue'
import { site } from '../config'

const props = defineProps({
  current: { type: String, default: 'home' }, // home | eventi | regolamento
})

// Link alle sezioni della home, validi da ogni pagina
const home = site.mainUrl
const links = [
  { href: `${home}#chi-siamo`, label: 'Chi siamo' },
  { href: `${home}#anteprime`, label: 'Anteprime' },
  { href: `${home}eventi/`, label: 'Eventi', page: 'eventi' },
  { href: `${home}#community`, label: 'Community' },
  { href: props.current === 'regolamento' ? '#top' : site.rulesUrl, label: 'Regolamento', page: 'regolamento' },
]

const open = ref(false)
const scrolled = ref(false)
const progress = ref(0)
const onScroll = () => {
  scrolled.value = window.scrollY > 8
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
}
const onKey = (e) => { if (e.key === 'Escape') open.value = false }

watch(open, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled || open, 'is-open': open }">
    <nav class="nav-inner container" aria-label="Principale">
      <a :href="props.current === 'home' ? '#top' : home" class="nav-brand" @click="open = false">
        <BrandWordmark />
      </a>

      <ul class="nav-links">
        <li v-for="l in links" :key="l.href">
          <a :href="l.href" :aria-current="l.page === props.current ? 'page' : undefined">{{ l.label }}</a>
        </li>
      </ul>

      <div class="nav-actions">
        <a :href="site.discordUrl" target="_blank" rel="noopener" class="btn btn-blue btn-sm nav-cta">
          <DiscordIcon /> Entra su Discord
        </a>
        <button
          class="nav-toggle"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Chiudi menu' : 'Apri menu'"
          @click="open = !open"
        >
          <X v-if="open" :size="22" />
          <Menu v-else :size="22" />
        </button>
      </div>
    </nav>
    <span class="nav-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />

    <Transition name="sheet">
      <div v-if="open" id="mobile-menu" class="sheet">
        <ul class="container">
          <li v-for="l in links" :key="l.href">
            <a :href="l.href" :aria-current="l.page === props.current ? 'page' : undefined" @click="open = false">{{ l.label }}</a>
          </li>
        </ul>
        <div class="container sheet-cta">
          <a :href="site.discordUrl" target="_blank" rel="noopener" class="btn btn-white">
            <DiscordIcon /> Entra su Discord
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  padding-top: var(--safe-top);
  transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease);
  border-bottom: 1px solid transparent;
}
.nav.is-scrolled {
  background: rgba(0, 0, 0, 0.72);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom-color: var(--hairline);
}
.nav-inner {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}
.nav-brand { display: flex; align-items: center; min-height: 44px; }

.nav-links {
  display: none;
  list-style: none;
  padding: 0;
  gap: var(--space-6);
}
.nav-links a {
  font-size: 0.8125rem;
  color: var(--text-2);
  transition: color var(--dur) var(--ease);
  padding-block: 12px;
}
.nav-links a { position: relative; }
.nav-links a::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: 6px;
  height: 1px;
  background: var(--blue-bright);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-out);
}
.nav-links a:hover { color: var(--text); }
.nav-links a:hover::after,
.nav-links a[aria-current='page']::after { transform: scaleX(1); transform-origin: left; }
.nav-links a[aria-current='page'],
.sheet a[aria-current='page'] { color: var(--blue-bright); }

.nav-progress {
  position: absolute; left: 0; right: 0; bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, #2d63e0, #5b8cff, #7fd0ff);
  box-shadow: 0 0 12px rgba(91, 140, 255, 0.7);
  transform-origin: left;
  transform: scaleX(0);
}

.nav-actions { display: flex; align-items: center; gap: var(--space-2); }
.nav-cta { display: none; }
.nav-toggle {
  width: 44px; height: 44px;
  display: grid; place-items: center;
  border-radius: 12px;
  color: var(--text);
}
.nav-toggle:hover { background: rgba(255,255,255,0.06); }

.sheet {
  position: fixed;
  top: calc(var(--nav-h) + var(--safe-top));
  inset-inline: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.96);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  padding-top: var(--space-5);
  padding-bottom: calc(var(--space-6) + var(--safe-bottom));
  overflow-y: auto;
}
.sheet ul { list-style: none; }
.sheet li + li { border-top: 1px solid var(--hairline); }
.sheet a:not(.btn) {
  display: block;
  padding: 18px 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.sheet-cta { margin-top: var(--space-6); }
.sheet-cta .btn { width: 100%; }

.sheet-enter-active, .sheet-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; transform: translateY(-8px); }

@media (min-width: 600px) {
  .nav-cta { display: inline-flex; }
}
@media (min-width: 960px) {
  .nav-links { display: flex; }
  .nav-toggle { display: none; }
}
</style>
