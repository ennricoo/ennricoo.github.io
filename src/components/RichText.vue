<script setup>
import { computed } from 'vue'

// Testo semplice con **grassetto**, collegamenti [testo](#id) ed evidenziazione dei risultati di ricerca.
// #id è l'id di un capitolo (es. #rapimenti) o di un articolo (es. #art-1-28).
const props = defineProps({
  text: { type: String, required: true },
  query: { type: String, default: '' },
})

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parts = computed(() => {
  const q = props.query.trim()
  const re = q ? new RegExp(`(${escape(q)})`, 'gi') : null
  const pieces = (chunk) => (re ? chunk.split(re) : [chunk]).map((t, j) => ({ t, hit: j % 2 === 1 }))
  // split con due gruppi di cattura: [testo, testo del link, id, testo, ...]
  const out = []
  const chunks = props.text.split(/\[([^\]]+)\]\(#([^)]+)\)/g)
  for (let i = 0; i < chunks.length; i += 3) {
    chunks[i].split(/\*\*(.+?)\*\*/g).forEach((chunk, k) => {
      if (chunk) out.push({ bold: k % 2 === 1, pieces: pieces(chunk) })
    })
    if (i + 2 < chunks.length) out.push({ link: chunks[i + 2], pieces: pieces(chunks[i + 1]) })
  }
  return out
})

// Il regolamento ascolta l'evento e apre il capitolo o l'articolo
const go = (id) => window.dispatchEvent(new CustomEvent('rg-open', { detail: id }))
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <a v-if="p.link" :href="`#${p.link}`" class="xref" @click.prevent="go(p.link)">
      <template v-for="(s, j) in p.pieces" :key="j">
        <mark v-if="s.hit" class="hit">{{ s.t }}</mark>
        <template v-else>{{ s.t }}</template>
      </template>
    </a>
    <component :is="p.bold ? 'strong' : 'span'" v-else>
      <template v-for="(s, j) in p.pieces" :key="j">
        <mark v-if="s.hit" class="hit">{{ s.t }}</mark>
        <template v-else>{{ s.t }}</template>
      </template>
    </component>
  </template>
</template>
