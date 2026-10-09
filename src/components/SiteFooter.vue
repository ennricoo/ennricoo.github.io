<script setup>
import BrandWordmark from './BrandWordmark.vue'
import { site } from '../config'

const year = new Date().getFullYear()
const social = [
  { label: 'Discord', href: site.discordUrl },
  { label: 'TikTok', href: site.tiktokUrl },
  { label: 'Instagram', href: site.instagramUrl },
].filter((s) => s.href)
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <BrandWordmark />
        <nav aria-label="Social">
          <ul>
            <li v-for="s in social" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>© {{ year }} {{ site.name }}. Tutti i diritti riservati.</p>
        <p>
          Encode Roleplay non è affiliato né approvato da Rockstar Games, Take-Two Interactive o Cfx.re.
          Grand Theft Auto e i relativi marchi appartengono ai rispettivi proprietari.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--hairline);
  padding-top: var(--space-7);
  padding-bottom: calc(var(--space-7) + var(--safe-bottom));
  font-size: 0.8125rem;
  color: var(--text-3);
}
.footer-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--hairline);
}
.footer-top ul { list-style: none; padding: 0; display: flex; gap: var(--space-5); }
.footer-top a {
  display: inline-block;
  padding-block: 12px;
  color: var(--text-2);
  transition: color var(--dur) var(--ease);
}
.footer-top a:hover { color: var(--text); }
.footer-bottom {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-5);
}
@media (min-width: 900px) {
  .footer-bottom { grid-template-columns: auto 1fr; gap: var(--space-7); }
  .footer-bottom p:last-child { text-align: right; }
}
</style>
