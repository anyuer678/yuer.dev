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
  margin-inline: calc(var(--space-2) * -1);
  padding: var(--space-4) var(--space-2);
  border-bottom: var(--border-default);
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard);
}
.note-card:hover {
  text-decoration: none;
  color: var(--color-text);
  background: var(--color-surface-muted);
  border-color: transparent;
}
.note-card__date {
  flex-shrink: 0;
  width: 96px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  transition: color var(--dur-fast) var(--ease-standard);
}
.note-card:hover .note-card__date {
  color: var(--color-text-secondary);
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
