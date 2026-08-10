<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  tags: { type: Array, default: () => [] },
  interval: { type: Number, default: 500 },
})

const index = ref(0)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timer

onMounted(() => {
  if (props.tags.length > 1 && !reduced) {
    timer = setInterval(() => {
      index.value = (index.value + 1) % props.tags.length
    }, props.interval)
  }
})
onBeforeUnmount(() => clearInterval(timer))

const current = computed(() => props.tags[index.value] ?? '')
</script>

<template>
  <!-- aria-hidden：对读屏是噪音；hero 副标题静态文本承载同等信息（14 §5.12） -->
  <span class="tag-rotator" aria-hidden="true">
    <Transition name="fade" mode="out-in">
      <span :key="current" class="tag-rotator__word">{{ current }}</span>
    </Transition>
  </span>
</template>

<style scoped>
.tag-rotator__word {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms var(--ease-standard);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
