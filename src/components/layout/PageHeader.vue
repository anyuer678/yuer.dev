<script setup>
// PageHeader —— 列表页页头（05 §1）
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  count: { type: Number, default: undefined }, // 渲染 `共 N 项`
  grid: { type: Boolean, default: false }, // 网格纹理背景
})
</script>

<template>
  <header class="page-header" :class="{ 'page-header--grid': grid }">
    <h1 class="page-header__title">{{ title }}</h1>
    <p v-if="description" class="page-header__desc">{{ description }}</p>
    <p v-if="count !== undefined" class="page-header__count">共 {{ count }} 项</p>
  </header>
</template>

<style scoped>
.page-header {
  padding-block: var(--space-12) var(--space-8);
}
.page-header__title {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.page-header__desc {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
}
.page-header__count {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
</style>
