<script setup>
// EmptyState —— 空结果占位（05 §2）
defineProps({
  message: { type: String, default: '这里暂时是空的' },
  actionLabel: { type: String, default: '' },
})
const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <p class="empty-state__message">{{ message }}</p>
    <button v-if="actionLabel" type="button" class="btn btn--ghost" @click="emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  padding-block: var(--space-16);
  text-align: center;
  color: var(--color-text-secondary);
}
.empty-state__message {
  font-size: var(--text-small);
}
.empty-state .btn {
  margin-top: var(--space-6);
}
</style>
