<script setup>
// NoteCard —— 笔记列表行（05 §3）
import Tag from '@/components/ui/Tag.vue'

defineProps({
  note: { type: Object, required: true },
})
</script>

<template>
  <RouterLink :to="`/notes/${note.slug}`" class="note-card">
    <time class="note-card__date" :datetime="note.date">{{ note.date }}</time>
    <div class="note-card__body">
      <h3 class="note-card__title">{{ note.title }}</h3>
      <p class="note-card__summary">{{ note.summary }}</p>
      <div class="note-card__tags">
        <Tag v-for="t in note.tags" :key="t" :label="t" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.note-card {
  display: flex;
  align-items: baseline;
  gap: var(--space-6);
  padding: var(--space-4) 0;
  border-bottom: var(--border-default);
  color: var(--color-text);
  text-decoration: none;
}
.note-card:hover {
  text-decoration: none;
  color: var(--color-text);
}
.note-card__date {
  flex-shrink: 0;
  width: 96px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.note-card__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
}
.note-card:hover .note-card__title {
  color: var(--color-accent);
}
.note-card__summary {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.note-card__tags {
  margin-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
