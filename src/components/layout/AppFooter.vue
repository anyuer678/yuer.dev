<script setup>
import { inject } from 'vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const site = inject('site')
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__mark" aria-hidden="true" />
        <div class="footer__texts">
          <p class="footer__name">{{ site.brand || site.name }}</p>
          <p class="footer__tag">用代码记录想法，用软件创造价值。</p>
        </div>
      </div>

      <nav class="footer__nav" aria-label="页脚导航">
        <RouterLink to="/projects">项目</RouterLink>
        <RouterLink to="/notes">笔记</RouterLink>
        <RouterLink to="/timeline">时间线</RouterLink>
        <RouterLink to="/lab">实验室</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
        <RouterLink to="/contact">联系</RouterLink>
        <RouterLink to="/garden">花庭</RouterLink>
        <RouterLink to="/room">工作室</RouterLink>
        <RouterLink to="/bench">工作台</RouterLink>
        <RouterLink to="/w/works">作品斋</RouterLink>
      </nav>

      <div class="footer__side">
        <ExternalLink :href="site.links?.github">GitHub</ExternalLink>
        <p class="footer__copy">© {{ year }} {{ site.name }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--space-16);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-muted);
}
.footer__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-6);
  padding-block: var(--space-8);
}
.footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.footer__mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
  flex-shrink: 0;
}
.footer__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-text);
}
.footer__tag {
  margin: 2px 0 0;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2) var(--space-4);
  font-size: var(--text-caption);
}
.footer__nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 4px 0;
  transition: color var(--dur-fast) var(--ease-standard);
}
.footer__nav a:hover,
.footer__nav a.router-link-active {
  color: var(--color-accent);
}
.footer__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.footer__side :deep(.external-link) {
  font-size: var(--text-caption);
}
.footer__copy {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
}

@media (max-width: 800px) {
  .footer__inner {
    grid-template-columns: 1fr;
    justify-items: start;
    gap: var(--space-4);
    padding-block: var(--space-6);
  }
  .footer__nav {
    justify-content: flex-start;
  }
  .footer__side {
    align-items: flex-start;
  }
  .footer__tag {
    white-space: normal;
  }
}
</style>
