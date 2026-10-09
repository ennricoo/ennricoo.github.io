<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import PreviewsSection from './components/PreviewsSection.vue'
import EventsSection from './components/EventsSection.vue'
import CommunitySection from './components/CommunitySection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a class="skip-link" href="#main">Vai al contenuto</a>
  <NavBar />
  <main id="main">
    <HeroSection />
    <AboutSection />
    <PreviewsSection />
    <EventsSection />
    <CommunitySection />
  </main>
  <SiteFooter />
</template>
