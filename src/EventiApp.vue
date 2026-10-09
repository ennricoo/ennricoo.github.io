<script setup>
import NavBar from './components/NavBar.vue'
import EventsPage from './components/EventsPage.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a class="skip-link" href="#main">Vai al contenuto</a>
  <NavBar current="eventi" />
  <main id="main">
    <EventsPage />
  </main>
  <SiteFooter />
</template>
