<script setup>
import { computed, watch, nextTick, ref, onBeforeUnmount } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({ images: { type: Array, required: true } })
const index = defineModel({ type: Number, default: -1 })

const isOpen = computed(() => index.value >= 0)
const current = computed(() => props.images[index.value])
const closeBtn = ref(null)
let lastFocus = null

const close = () => { index.value = -1 }
const step = (d) => { index.value = (index.value + d + props.images.length) % props.images.length }

function onKey(e) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

// Swipe orizzontale su touch
let startX = 0
const onTouchStart = (e) => { startX = e.touches[0].clientX }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - startX
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
}

watch(isOpen, async (open) => {
  if (open) {
    lastFocus = document.activeElement
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    await nextTick()
    closeBtn.value?.focus()
  } else {
    document.documentElement.style.overflow = ''
    window.removeEventListener('keydown', onKey)
    lastFocus?.focus()
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="isOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="current.label"
        @click.self="close"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <button ref="closeBtn" class="lb-btn lb-close" aria-label="Chiudi" @click="close"><X :size="22" /></button>

        <figure class="lb-figure" @click.self="close">
          <img :key="current.src" :src="current.src" :alt="current.alt" />
          <figcaption>
            <span class="lb-cap"><strong>{{ current.label }}</strong> {{ current.text }}</span>
            <span class="lb-count">{{ index + 1 }} / {{ images.length }}</span>
          </figcaption>
        </figure>

        <button class="lb-btn lb-prev" aria-label="Immagine precedente" @click="step(-1)"><ChevronLeft :size="24" /></button>
        <button class="lb-btn lb-next" aria-label="Immagine successiva" @click="step(1)"><ChevronRight :size="24" /></button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: calc(64px + var(--safe-top)) max(16px, var(--safe-right)) calc(32px + var(--safe-bottom)) max(16px, var(--safe-left));
  background: rgba(0, 0, 0, 0.94);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}
.lb-figure { max-width: min(1400px, 100%); width: 100%; }
.lb-figure img {
  width: 100%;
  max-height: calc(100dvh - 230px);
  object-fit: contain;
  border-radius: var(--radius);
  animation: lb-img var(--dur) var(--ease);
}
@keyframes lb-img { from { opacity: 0; } to { opacity: 1; } }
.lb-figure figcaption {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  font-size: var(--fs-small);
  color: var(--text-2);
}
.lb-figure figcaption { gap: 24px; align-items: flex-start; }
.lb-cap { max-width: 70ch; line-height: 1.5; }
.lb-cap strong { color: var(--text); font-weight: 600; }
.lb-count { flex: none; font-variant-numeric: tabular-nums; }

.lb-btn {
  position: absolute;
  width: 48px; height: 48px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--hairline);
  transition: background-color var(--dur) var(--ease);
}
.lb-btn:hover { background: rgba(255,255,255,0.16); }
.lb-close { top: calc(12px + var(--safe-top)); right: max(12px, var(--safe-right)); }
.lb-prev, .lb-next { top: 50%; transform: translateY(-50%); }
.lb-prev { left: max(12px, var(--safe-left)); }
.lb-next { right: max(12px, var(--safe-right)); }

@media (max-width: 767px) {
  /* Su telefono le frecce vanno in basso, sotto l'immagine */
  .lb-prev, .lb-next { top: auto; bottom: calc(16px + var(--safe-bottom)); transform: none; }
  .lb-prev { left: calc(50% - 60px); }
  .lb-next { right: calc(50% - 60px); }
  .lightbox { padding-bottom: calc(88px + var(--safe-bottom)); }
}

.lb-enter-active, .lb-leave-active { transition: opacity var(--dur) var(--ease); }
.lb-enter-from, .lb-leave-to { opacity: 0; }
</style>
