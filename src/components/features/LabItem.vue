<script setup>
// LabItem —— Lab 卡片（05 §3；F07）
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

defineProps({
  item: { type: Object, required: true },
})
</script>

<template>
  <article class="lab-item">
    <header class="lab-item__head">
      <h3 class="lab-item__title">{{ item.title }}</h3>
      <StatusBadge :status="item.status" />
    </header>
    <p class="lab-item__desc">{{ item.description }}</p>
    <footer class="lab-item__foot">
      <time :datetime="item.date" class="lab-item__date">{{ item.date }}</time>
      <ExternalLink v-if="item.link" :href="item.link">链接</ExternalLink>
    </footer>
  </article>
</template>

<style scoped>
.lab-item {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
}
.lab-item__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.lab-item__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
}
.lab-item__desc {
  margin-top: var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  flex: 1;
}
.lab-item__foot {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
</style>
