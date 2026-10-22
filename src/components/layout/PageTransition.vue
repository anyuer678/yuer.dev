<script setup>
// PageTransition —— 包 router-view，挂载时淡入上移（05 §1）
// 不用 Vue <Transition> 的 out-in 状态机：快速 SPA 导航或在 enter 期间跳转时，
// 旧组件会卡在 page-enter-from + page-leave-active，URL 变了视图却不换。
// 改为按 route.path 重挂载 + CSS 挂载动画；退出即时完成，视觉仍保留 150ms 淡入上移。
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const immersive = computed(() => route.meta?.immersive === true)
</script>

<template>
  <RouterView v-slot="{ Component, route: currentRoute }">
    <component
      :is="Component"
      :key="currentRoute.path"
      :class="{ 'page-view': !immersive }"
    />
  </RouterView>
</template>
