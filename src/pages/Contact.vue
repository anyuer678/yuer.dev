<script setup>
// Contact 页（F08）：无表单；邮箱实体编码防爬（&#64;）+ mailto 运行时拼接
import PageHeader from '@/components/layout/PageHeader.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import { site } from '@/utils/content.js'

const email = site.links.email
const emailLocal = email.split('@')[0] ?? ''
const emailDomain = email.split('@')[1] ?? ''
</script>

<template>
  <div class="container">
    <PageHeader title="联系" description="欢迎交流 AI 应用与工程化相关话题" />

    <div class="container container--narrow contact">
      <ul class="contact__list">
        <li v-if="email" class="contact__item">
          <span class="contact__label">邮箱</span>
          <!-- 实体编码展示防 HTML 源码爬虫（04 §8.4），mailto 运行时拼接 -->
          <a :href="`mailto:${email}`" class="contact__value">{{ emailLocal }}<span aria-hidden="true">&#64;</span>{{ emailDomain }}</a>
        </li>
        <li class="contact__item">
          <span class="contact__label">GitHub</span>
          <ExternalLink :href="site.links.github">{{ site.name }} on GitHub</ExternalLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.contact {
  padding-bottom: var(--space-16);
}
.contact__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.contact__item {
  display: flex;
  align-items: baseline;
  gap: var(--space-6);
}
.contact__label {
  flex-shrink: 0;
  width: 80px;
  font-size: var(--text-small);
  color: var(--color-text-tertiary);
}
.contact__value {
  font-size: var(--text-body);
  color: var(--color-accent);
}
.contact__value:hover {
  color: var(--color-accent-hover);
}
</style>
