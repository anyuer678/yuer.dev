<script setup>
// PaperTransition — 纸页转场（17 §4：风卷 + 纸层，禁纯白 fade）
import { ref } from 'vue'

const props = defineProps({
  to: { type: String, default: '' },
})
const emit = defineEmits(['done'])

const active = ref(false)
const paper = ref(null)
const sweep = ref(null)

function play(target) {
  if (active.value) return
  active.value = true
  sweep.value?.classList.add('on')
  requestAnimationFrame(() => paper.value?.classList.add('on'))
  const dest = target || props.to
  window.setTimeout(() => {
    emit('done', dest)
  }, 480)
}

function reset() {
  active.value = false
  sweep.value?.classList.remove('on')
  paper.value?.classList.remove('on')
}

defineExpose({ play, reset })
</script>

<template>
  <div class="paper-fx" :class="{ 'paper-fx--on': active }" aria-hidden="true">
    <div ref="sweep" class="paper-fx__sweep" />
    <div ref="paper" class="paper-fx__sheet" />
  </div>
</template>

<style scoped>
.paper-fx {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}
.paper-fx__sheet {
  position: absolute;
  inset: -6%;
  background: linear-gradient(120deg, #fffcf6 0%, #f0e8da 48%, #fffcf6 100%);
  box-shadow: 0 20px 50px rgba(70, 50, 30, 0.14);
  transform: translate(105%, 8%) rotate(4deg);
  opacity: 0;
  transition:
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s;
}
.paper-fx__sheet.on {
  transform: none;
  opacity: 1;
}
.paper-fx__sweep {
  position: absolute;
  top: 40%;
  left: -10%;
  height: 1px;
  width: 0;
  background: rgba(176, 92, 58, 0.28);
  transition:
    width 0.5s ease,
    left 0.5s ease;
}
.paper-fx__sweep.on {
  width: 120%;
  left: 0;
}
@media (prefers-reduced-motion: reduce) {
  .paper-fx__sheet {
    transition: opacity 0.2s linear;
    transform: none;
  }
  .paper-fx__sheet.on {
    transform: none;
  }
  .paper-fx__sweep {
    display: none;
  }
}
</style>
