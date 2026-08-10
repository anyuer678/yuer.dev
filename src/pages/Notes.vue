<script setup>
// Notes 列表页（F06）：tag 单选过滤，URL query ?tag=（14 §5.4 同款模式）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import Tag from '@/components/ui/Tag.vue'
import NoteCard from '@/components/features/NoteCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { notes, noteTags } from '@/utils/content.js'

const route = useRoute()
const router = useRouter()

const tag = computed(() => String(route.query.tag ?? '')) // 防数组形态 ?tag=a&tag=b
const filtered = computed(() => (tag.value ? notes.filter((n) => n.tags.includes(tag.value)) : notes))

function applyTag(next) {
  const query = { ...route.query }
  next === '' ? delete query.tag : (query.tag = next)
  router.replace({ query })
}
</script>

<template>
  <div class="container">
    <PageHeader title="笔记" description="开发日志" :count="filtered.length" />

    <div v-if="noteTags.length" class="note-tags" role="group" aria-label="按标签筛选">
      <Tag label="全部" :clickable="true" :active="tag === ''" @click="applyTag('')" />
      <Tag
        v-for="t in noteTags"
        :key="t"
        :label="t"
        :clickable="true"
        :active="tag === t"
        @click="applyTag(t)"
      />
    </div>

    <div v-if="filtered.length" class="note-list">
      <NoteCard v-for="n in filtered" :key="n.slug" :note="n" />
    </div>
    <EmptyState v-else message="没有符合条件的笔记" action-label="清除筛选" @action="applyTag('')" />
  </div>
</template>

<style scoped>
.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
.note-list {
  display: grid;
  gap: var(--space-3);
}
</style>
