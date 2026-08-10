<script setup>
// Tag —— 技术/主题标签（05 §2）
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
})
const emit = defineEmits(['click'])
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    class="tag"
    :class="{ 'is-active': active }"
    :title="label"
    :aria-pressed="active"
    @click="emit('click')"
  >
    {{ label }}
  </button>
  <span v-else class="tag" :class="{ 'is-active': active }" :title="label">{{ label }}</span>
</template>

<style scoped>
.tag {
  display: inline-block;
  max-width: 12em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 10px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  line-height: var(--lh-caption);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
.tag.is-active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
button.tag {
  cursor: pointer;
}
button.tag:hover {
  border-color: var(--color-border-strong);
}
</style>
