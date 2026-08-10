<script setup>
// Icon —— 内联 SVG 图标（05 §2；03 设计令牌 stroke 统一 1.5px）
defineProps({
  name: {
    type: String,
    required: true,
    validator: (v) =>
      ['github', 'mail', 'arrow-left', 'arrow-right', 'external', 'menu', 'close', 'calendar', 'code'].includes(v),
  },
  size: { type: Number, default: 20 },
  label: { type: String, default: '' }, // 传入则加 aria-label，缺省 aria-hidden
})

const paths = {
  github: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  'arrow-left': 'M19 12H5 M12 19l-7-7 7-7',
  'arrow-right': 'M5 12h14 M12 5l7 7-7 7',
  external: 'M14 5h5v5 M19 5l-9 9 M19 13v6H5V5h6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  calendar: 'M6 3v3M18 3v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label || undefined"
    role="img"
  >
    <path v-if="name === 'github'" :d="paths.github" fill="currentColor" stroke="none" />
    <path v-else :d="paths[name]" />
  </svg>
</template>
