<script setup>
defineProps({
  size: { type: String, default: 'sm' }, // sm | lg
})
</script>

<template>
  <span class="wordmark" :class="`wordmark--${size}`" aria-label="Encode Roleplay">
    <span class="wm-top" aria-hidden="true">ENCODE</span>
    <span class="wm-bottom" aria-hidden="true">ROLEPLAY</span>
  </span>
</template>

<style scoped>
.wordmark {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-brand);
  line-height: 1;
  user-select: none;
}
.wm-top {
  color: var(--pearl);
  letter-spacing: 0.42em;
  margin-right: -0.42em; /* compensa il tracking per centrare */
}
.wm-bottom {
  color: var(--blue-500);
  letter-spacing: 0.3em;
  margin-right: -0.3em;
}

.wordmark--sm .wm-top { font-size: 13px; }
.wordmark--sm .wm-bottom { font-size: 8.5px; margin-top: 4px; }

.wordmark--lg .wm-top { font-size: clamp(28px, 6vw, 64px); }
.wordmark--lg .wm-bottom { font-size: clamp(18px, 4vw, 42px); margin-top: 0.35em; }
</style>
