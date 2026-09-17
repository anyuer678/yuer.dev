<script setup>
// RoomHotspot —— 语义化热区：百分比定位 + 键盘可达（15 Wave 3.A）
defineProps({
  hotspot: { type: Object, required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['activate'])
</script>

<template>
  <button
    type="button"
    class="hotspot"
    :class="{ 'hotspot--active': active }"
    :style="{
      left: hotspot.x + '%',
      top: hotspot.y + '%',
      width: hotspot.w + '%',
      height: hotspot.h + '%',
    }"
    :aria-label="hotspot.label"
    :aria-pressed="hotspot.stateful ? active : undefined"
    @click="$emit('activate', hotspot)"
  >
    <span class="hotspot__ring" aria-hidden="true" />
    <span class="hotspot__tag">{{ hotspot.label }}</span>
  </button>
</template>

<style scoped>
.hotspot {
  position: absolute;
  z-index: 2;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-md);
}
.hotspot__ring {
  position: absolute;
  inset: 0;
  border: 1.5px dashed transparent;
  border-radius: inherit;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);
  pointer-events: none;
}
.hotspot:hover .hotspot__ring,
.hotspot:focus-visible .hotspot__ring {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent-soft) 55%, transparent);
}
.hotspot--active .hotspot__ring {
  border-color: var(--color-accent);
  border-style: solid;
  background: color-mix(in srgb, var(--color-accent-soft) 70%, transparent);
}
.hotspot:focus-visible {
  outline: none;
}
.hotspot:focus-visible .hotspot__ring {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.hotspot__tag {
  position: absolute;
  left: 50%;
  bottom: -22px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-standard);
}
.hotspot:hover .hotspot__tag,
.hotspot:focus-visible .hotspot__tag,
.hotspot--active .hotspot__tag {
  opacity: 1;
}
</style>
