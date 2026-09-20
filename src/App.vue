<script setup>
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/utils/content.js'
import SkipLink from '@/components/layout/SkipLink.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PageTransition from '@/components/layout/PageTransition.vue'

provide('site', site)

// 沉浸式页面（如 /room）自绘 HUD 并需要铺满整个视口：
// 全局页头是 sticky 且占文档流，留着它会凭空多出 56px，
// 让 100dvh 的内容溢出视口、页脚再补一刀滚动。这里整块让出去。
const route = useRoute()
const immersive = computed(() => route.meta?.immersive === true)
</script>

<template>
  <SkipLink />
  <AppHeader v-if="!immersive" />
  <main id="main" tabindex="-1">
    <PageTransition />
  </main>
  <AppFooter v-if="!immersive" />
</template>
