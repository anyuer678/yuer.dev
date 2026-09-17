<script setup>
// RoomHotspot —— 可发现的热区：常显小光点 + hover 标签（15 Wave 3.A）
defineProps({
  hotspot: { type: Object, required: true },
  active: { type: Boolean, default: false },
  dimmed: { type: Boolean, default: false },
})
defineEmits(['activate', 'hover'])
</script>

<template>
  <button
    type="button"
    class="hotspot"
    :class="{ 'hotspot--active': active, 'hotspot--dim': dimmed }"
    :style="{
      left: hotspot.x + '%',
      top: hotspot.y + '%',
      width: hotspot.w + '%',
      height: hotspot.h + '%',
    }"
    :aria-label="hotspot.label"
    @click="$emit('activate', hotspot)"
    @mouseenter="$emit('hover', hotspot)"
    @mouseleave="$emit('hover', null)"
    @focus="$emit('hover', hotspot)"
    @blur="$emit('hover', null)"
  >
    <span class="hotspot__ring" aria-hidden="true" />
    <span class="hotspot__dot" aria-hidden="true" />
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
  border: 1.5px solid transparent;
  border-radius: inherit;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);
  pointer-events: none;
}
/* 常显光点：让物件可被发现 */
.hotspot__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 25%, transparent);
  opacity: 0.55;
  pointer-events: none;
  transition:
    opacity var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);
  animation: pulse-dot 2.4s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hotspot__dot {
    animation: none;
  }
}
.hotspot:hover .hotspot__ring,
.hotspot:focus-visible .hotspot__ring,
.hotspot--active .hotspot__ring {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent-soft) 45%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 20%, transparent);
}
.hotspot:hover .hotspot__dot,
.hotspot:focus-visible .hotspot__dot,
.hotspot--active .hotspot__dot {
  opacity: 1;
  transform: scale(1.2);
}
.hotspot--dim {
  opacity: 0.35;
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
  bottom: -26px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-sm);
  padding: 3px 10px;
  box-shadow: var(--shadow-card-hover);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-standard);
  z-index: 4;
}
.hotspot:hover .hotspot__tag,
.hotspot:focus-visible .hotspot__tag,
.hotspot--active .hotspot__tag {
  opacity: 1;
}
</style>
