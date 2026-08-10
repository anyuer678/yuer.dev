<script setup>
// P1 骨架：P3 实现详情渲染（watchEffect title/description）
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="container container--narrow">
    <h1>项目详情</h1>
    <p>slug: {{ route.params.slug }}（P3 填充）</p>
  </div>
</template>
