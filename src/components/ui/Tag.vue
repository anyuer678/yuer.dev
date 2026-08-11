<script setup>
// Tag —— 技术/主题标签（05 §2）
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  count: { type: [Number, String], default: null },
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
    {{ label }}<span v-if="count !== null" class="tag__count">{{ count }}</span>
  </button>
  <span v-else class="tag" :class="{ 'is-active': active }" :title="label">{{ label }}<span v-if="count !== null" class="tag__count">{{ count }}</span></span>
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
.tag__count {
  margin-left: 6px;
  font-size: 0.82em;
  opacity: 0.65;
}
.tag.is-active .tag__count {
  opacity: 0.85;
}
button.tag {
  cursor: pointer;
  min-height: 28px; /* 默认紧凑 */
}
button.tag:hover {
  border-color: var(--color-border-strong);
}
/* 触摸目标 ≥ 44px（14 §5.10；F10）——仅可点击态 */
@media (max-width: 639px) {
  button.tag {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}
</style>
