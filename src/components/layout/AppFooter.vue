<script setup>
import { inject } from 'vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const site = inject('site')
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <p class="app-footer__copy">
        © {{ year }} {{ site.name }} · {{ site.brand }}
      </p>
      <div class="app-footer__links">
        <ExternalLink :href="site.links.github">{{ site.name }} on GitHub</ExternalLink>
        <ExternalLink :href="`mailto:${site.links.email}`">Email</ExternalLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-16);
}
.app-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-block: var(--space-6);
}
.app-footer__copy {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.app-footer__links {
  display: flex;
  gap: var(--space-6);
  font-size: var(--text-small);
}
</style>
