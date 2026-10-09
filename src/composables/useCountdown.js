import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Conto alla rovescia verso una data ISO. Si aggiorna una volta al secondo.
export function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const now = ref(Date.now())
  let timer

  onMounted(() => {
    timer = setInterval(() => { now.value = Date.now() }, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  const left = computed(() => Math.max(0, target - now.value))
  const done = computed(() => left.value === 0)
  const parts = computed(() => {
    const s = Math.floor(left.value / 1000)
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    }
  })

  return { parts, done }
}
