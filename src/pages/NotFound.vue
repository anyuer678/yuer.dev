<script setup>
// 404（02 §2；P1 完整实现）
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="container container--narrow not-found">
    <h1>页面不存在</h1>
    <p>你访问的页面不存在或已被移动。</p>
    <button class="not-found__btn" type="button" @click="router.push('/')">返回首页</button>
  </div>
</template>

<style scoped>
.not-found {
  padding-block: var(--space-16) var(--space-12);
  text-align: center;
}
.not-found__btn {
  margin-top: var(--space-6);
  padding: var(--space-2) var(--space-6);
  font-size: var(--text-small);
  color: var(--color-surface);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}
.not-found__btn:hover {
  background: var(--color-accent-hover);
}
</style>
