<script setup>
import { Info, TriangleAlert } from 'lucide-vue-next'
import RichText from './RichText.vue'
import RuleMap from './RuleMap.vue'

// Blocchi di testo del regolamento (paragrafi, elenchi, riquadri, tabelle, mappe)
defineProps({
  blocks: { type: Array, required: true },
  query: { type: String, default: '' },
})
</script>

<template>
  <template v-for="(b, i) in blocks" :key="i">
    <p v-if="typeof b === 'string'"><RichText :text="b" :query="query" /></p>
    <ul v-else-if="b.list">
      <li v-for="(t, k) in b.list" :key="k"><RichText :text="t" :query="query" /></li>
    </ul>
    <ol v-else-if="b.steps" class="steps">
      <li v-for="(t, k) in b.steps" :key="k"><span>{{ k + 1 }}</span><RichText :text="t" :query="query" /></li>
    </ol>
    <div v-else-if="b.note" class="callout" :class="`callout--${b.kind || 'info'}`">
      <TriangleAlert v-if="b.kind === 'warning'" :size="20" aria-hidden="true" />
      <Info v-else :size="20" aria-hidden="true" />
      <p><RichText :text="b.note" :query="query" /></p>
    </div>
    <div v-else-if="b.table" class="table-wrap">
      <table>
        <thead><tr><th v-for="h in b.table.head" :key="h" scope="col">{{ h }}</th></tr></thead>
        <tbody>
          <tr v-for="(r, k) in b.table.rows" :key="k">
            <td v-for="(c, m) in r" :key="m"><RichText :text="c" :query="query" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <RuleMap v-else-if="b.map" :map="b.map" />
  </template>
</template>
