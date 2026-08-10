<script setup>
// SectionTitle —— 区块标题（05 §2）：序号 + 标题 + 可选"查看全部"链接
defineProps({
  title: { type: String, required: true },
  index: { type: String, default: '' },
  to: { type: String, default: '' },
})
</script>

<template>
  <header class="section-title">
    <span v-if="index" class="section-title__index">{{ index }}</span>
    <h2 class="section-title__text">{{ title }}</h2>
    <RouterLink v-if="to" :to="to" class="section-title__more">查看全部 <span class="section-title__more-arrow" aria-hidden="true">→</span></RouterLink>
  </header>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.section-title__index {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.section-title__text {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
}
.section-title__more {
  margin-left: auto;
  font-size: var(--text-small);
  white-space: nowrap;
  color: var(--color-text-secondary);
  transition: color var(--dur-fast) var(--ease-standard);
}
.section-title__more:hover {
  color: var(--color-accent);
  text-decoration: none;
}
.section-title__more-arrow {
  display: inline-block;
  transition: transform var(--dur-fast) var(--ease-standard);
}
.section-title__more:hover .section-title__more-arrow {
  transform: translateX(3px);
}
</style>
