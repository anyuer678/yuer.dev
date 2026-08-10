<script setup>
// About 页（F08）：数据来自 site.json（bio）+ 可选 about.md 正文
// v1 默认用 bio 字段渲染；若 content/about.md 存在则优先渲染正文（单独加载，不走 glob 管线）
import PageHeader from '@/components/layout/PageHeader.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import ArticleContent from '@/components/features/ArticleContent.vue'
import { site } from '@/utils/content.js'
import { renderMarkdown } from '@/utils/markdown.js'

// about.md 可选（04 §3）：eager glob 零匹配时为空对象，构建安全（Vite 确认）
const aboutFiles = import.meta.glob('@/content/about.md', { query: '?raw', import: 'default', eager: true })
const aboutRaw = Object.values(aboutFiles)[0]
const aboutHtml = aboutRaw ? renderMarkdown(aboutRaw, 'about') : ''

// bio 的结构化展示（来自 site.json，12 §2 方向）
const directions = ['AI 应用', '软件架构', '全栈', 'Linux']
</script>

<template>
  <div class="container">
    <PageHeader title="关于" description="简洁版自我介绍" />

    <div class="container container--narrow about">
      <!-- about.md 存在时优先渲染正文 -->
      <ArticleContent v-if="aboutHtml" :html="aboutHtml" />
      <template v-else>
        <p class="about__bio">{{ site.bio }}</p>
        <h2 class="about__sub">方向</h2>
        <div class="about__directions">
          <span v-for="d in directions" :key="d" class="about__direction">{{ d }}</span>
        </div>
      </template>

      <div class="about__links">
        <ExternalLink :href="site.links.github">GitHub</ExternalLink>
        <ExternalLink :href="`mailto:${site.links.email}`">Email</ExternalLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding-bottom: var(--space-16);
}
.about__bio {
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-text);
}
.about__sub {
  margin-top: var(--space-8);
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.about__directions {
  margin-top: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.about__direction {
  padding: 2px 10px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
.about__links {
  margin-top: var(--space-8);
  display: flex;
  gap: var(--space-6);
}
</style>
