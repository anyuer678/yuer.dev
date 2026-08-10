<script setup>
// SkipLink —— 无障碍跳转：键盘首 Tab 聚焦时显示（05 §1）
</script>

<template>
  <a href="#main" class="skip-link">跳到主要内容</a>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -48px;
  left: 16px;
  z-index: 100;
  padding: 8px 16px;
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-sm);
  transition: top var(--dur-fast) var(--ease-standard);
}
.skip-link:focus-visible {
  top: 8px;
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
