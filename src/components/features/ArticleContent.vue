<script setup>
// ArticleContent —— Markdown 渲染容器（05 §2；项目/笔记详情共用）
// #extra 插槽预留 v2.0 动态数据区，v1 不渲染
import '../../styles/markdown.css'

defineProps({
  html: { type: String, required: true },
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- markdown-it 已 html:false + 外链强制新标签（04 §10），受控渲染 -->
  <article class="article" v-html="html" />
  <slot name="extra" />
</template>
