<script setup>
import { provide } from 'vue'
import site from '@/content/site.json'
import SkipLink from '@/components/layout/SkipLink.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PageTransition from '@/components/layout/PageTransition.vue'

provide('site', site)
</script>

<template>
  <SkipLink />
  <AppHeader />
  <main id="main" tabindex="-1">
    <PageTransition />
  </main>
  <AppFooter />
</template>
