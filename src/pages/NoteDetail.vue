<script setup>
// NoteDetail 详情页（F06）：复用 ArticleContent 渲染，与项目详情一致
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Tag from '@/components/ui/Tag.vue'
import ArticleContent from '@/components/features/ArticleContent.vue'
import { getNote, noteRawFiles } from '@/utils/content.js'
import { renderMarkdown } from '@/utils/markdown.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const route = useRoute()
const note = ref(getNote(route.params.slug))
const html = ref('')

watchEffect(async (onInvalidate) => {
  const slug = route.params.slug
  let cancelled = false
  onInvalidate(() => {
    cancelled = true
  })
  note.value = getNote(slug)
  if (!note.value) return

  setTitle(`${note.value.title} · ${note.value.date}`)
  setDescription(note.value.summary)

  const loader = noteRawFiles[slug]
  if (loader) {
    html.value = ''
    const raw = await loader()
    if (!cancelled) html.value = renderMarkdown(raw, slug)
  }
})
</script>

<template>
  <div class="note-detail-root">
    <div v-if="!note" class="container container--narrow">
      <p>笔记不存在</p>
      <RouterLink to="/notes" class="back-link">← 返回笔记列表</RouterLink>
    </div>

    <div v-else class="container container--narrow note-detail">
      <RouterLink to="/notes" class="back-link">← 返回笔记列表</RouterLink>
      <header class="note-detail__head">
        <h1>{{ note.title }}</h1>
        <div class="note-detail__meta">
          <time :datetime="note.date">{{ note.date }}</time>
          <Tag v-for="t in note.tags" :key="t" :label="t" />
        </div>
      </header>

      <hr class="note-detail__divider" />

      <ArticleContent :html="html" />
    </div>
  </div>
</template>

<style scoped>
.note-detail-root {
  /* 单根容器：保证 <Transition> 可动画（组件根必须是单元素，14 §5.1） */
}

<style scoped>
.back-link {
  display: inline-block;
  margin-block: var(--space-6) var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-tertiary);
}
.back-link:hover {
  color: var(--color-accent);
}
.note-detail {
  max-width: var(--container-narrow);
  padding-bottom: var(--space-16);
}
.note-detail h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.note-detail__meta {
  margin-top: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.note-detail__divider {
  margin: var(--space-8) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
</style>
