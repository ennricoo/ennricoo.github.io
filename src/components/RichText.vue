<script setup>
import { computed } from 'vue'

// Testo semplice con **grassetto** ed evidenziazione dei risultati di ricerca
const props = defineProps({
  text: { type: String, required: true },
  query: { type: String, default: '' },
})

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parts = computed(() => {
  const q = props.query.trim()
  const re = q ? new RegExp(`(${escape(q)})`, 'gi') : null
  return props.text.split(/\*\*(.+?)\*\*/g).map((chunk, i) => ({
    bold: i % 2 === 1,
    pieces: (re ? chunk.split(re) : [chunk]).map((t, j) => ({ t, hit: j % 2 === 1 })),
  }))
})
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <component :is="p.bold ? 'strong' : 'span'">
      <template v-for="(s, j) in p.pieces" :key="j">
        <mark v-if="s.hit" class="hit">{{ s.t }}</mark>
        <template v-else>{{ s.t }}</template>
      </template>
    </component>
  </template>
</template>
