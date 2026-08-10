<script setup>
import Icon from '@/components/ui/Icon.vue'

defineProps({
  href: { type: String, required: true },
  icon: { type: Boolean, default: true }, // 尾部外链图标
})
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="external-link">
    <slot />
    <Icon v-if="icon" name="external" :size="14" class="external-link__icon" />
  </a>
</template>

<style scoped>
.external-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-accent);
}
.external-link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}
.external-link__icon {
  flex-shrink: 0;
}
</style>
