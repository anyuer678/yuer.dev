<script setup>
// PageTransition —— 包 router-view，页面切换淡入（05 §1）
// CSS：base.css 中 .page-* 类（150ms fade + 8px 上移）
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in" name="page">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
