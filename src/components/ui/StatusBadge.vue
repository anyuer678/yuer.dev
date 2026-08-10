<script setup>
// StatusBadge —— 项目/Lab 状态徽章（05 §2；03 §2.3 色板）
defineProps({
  status: {
    type: String,
    required: true,
    validator: (v) => ['development', 'completed', 'archived', 'experiment'].includes(v),
  },
})

const LABELS = {
  development: '开发中',
  completed: '已完成',
  archived: '已归档',
  experiment: '实验',
}
const CLASSES = {
  development: 'badge--dev',
  completed: 'badge--done',
  archived: 'badge--arch',
  experiment: 'badge--exp',
}
</script>

<template>
  <span class="badge" :class="CLASSES[status]" :aria-label="`状态：${LABELS[status]}`">
    {{ LABELS[status] }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 1px 8px;
  font-size: var(--text-caption);
  line-height: var(--lh-caption);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
.badge--dev {
  color: var(--color-dev-text);
  background: var(--color-dev-bg);
}
.badge--done {
  color: var(--color-done-text);
  background: var(--color-done-bg);
}
.badge--arch {
  color: var(--color-arch-text);
  background: var(--color-arch-bg);
}
.badge--exp {
  color: var(--color-exp-text);
  background: var(--color-exp-bg);
}
</style>
