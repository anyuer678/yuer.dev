<script setup>
// /garden 花庭 — 原图 garden-bg 单幅（不再用生成素材覆盖原设计）
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PetalField from '@/components/features/garden/PetalField.vue'
import PaperTransition from '@/components/features/garden/PaperTransition.vue'
import { portalWorlds } from '@/utils/gardenCuration.js'
import { site } from '@/utils/content.js'
import { setDescription, setTitle } from '@/utils/seo.js'

const router = useRouter()
const worlds = portalWorlds()
const fx = ref(null)
const leaving = ref(false)
const base = import.meta.env.BASE_URL
const bgUrl = `${base}images/garden/garden-bg.webp`

function leave(to) {
  if (leaving.value) return
  leaving.value = true
  fx.value?.play(to)
}

function onEnter(world) {
  leave(world.to)
}

function onFxDone(dest) {
  router.push(dest)
}

onMounted(() => {
  setTitle(`花庭 · ${site?.brand || 'Yuer Studio'}`)
  setDescription('风里偶尔有一朵不一样的花——从花庭遇见项目、笔记与书房。')
})
</script>

<template>
  <div class="garden">
    <div class="garden__stage">
      <div class="garden__bg" :style="{ backgroundImage: `url(${bgUrl})` }" aria-hidden="true" />
      <div class="garden__grain" aria-hidden="true" />

      <div class="brand" aria-hidden="true">
        花笺<small>HUAJIAN</small>
      </div>

      <div class="garden__overlay">
        <PetalField :worlds="worlds" @enter="onEnter" />
      </div>

      <button type="button" class="study-gate" aria-label="进入书房" @click="leave('/room')">
        <span>书房</span>
      </button>

      <p class="hint">风里偶尔有一朵不一样的花 · 靠近停一停</p>

      <PaperTransition ref="fx" @done="onFxDone" />
    </div>
  </div>
</template>

<style scoped>
.garden {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-bg);
}
.garden__stage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f0ebe2;
}
.garden__bg {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: none;
}
.garden__grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  background-size: 140px;
  mix-blend-mode: multiply;
}
.garden__overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}
.garden__overlay :deep(canvas) {
  pointer-events: auto;
}
.brand {
  position: absolute;
  top: 22px;
  left: 24px;
  z-index: 4;
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.35em;
  color: #4a3c30;
  opacity: 0.85;
}
.brand small {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  opacity: 0.75;
  margin-top: 8px;
}
.hint {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  z-index: 4;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  letter-spacing: 0.14em;
  pointer-events: none;
  text-align: center;
  max-width: min(90vw, 420px);
}
.study-gate {
  position: absolute;
  right: 6%;
  bottom: 18%;
  z-index: 4;
  width: min(160px, 22vw);
  height: min(220px, 32vh);
  border: none;
  background: transparent;
  cursor: pointer;
}
.study-gate:focus-visible {
  outline: 1px dashed var(--color-accent);
  outline-offset: 6px;
}
.study-gate span {
  position: absolute;
  left: 50%;
  top: 38%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.28em;
  color: #5a4a3a;
  opacity: 0.55;
  transition: opacity 0.3s;
}
.study-gate:hover span,
.study-gate:focus-visible span {
  opacity: 0.95;
  color: var(--color-accent);
}
@media (max-width: 639px) {
  .hint {
    font-size: 11px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .garden__grain {
    opacity: 0.1;
  }
}
</style>
