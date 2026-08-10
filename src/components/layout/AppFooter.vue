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
        用代码记录想法，用软件创造价值。
      </p>
      <div class="app-footer__links">
        <ExternalLink :href="site.links.github">{{ site.name }} on GitHub</ExternalLink>
      </div>
    </div>
    <p class="app-footer__legal">© {{ year }} {{ site.name }} · {{ site.brand }}</p>
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
.app-footer__legal {
  text-align: center;
  padding-block: var(--space-4);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  border-top: var(--border-default);
}
</style>
