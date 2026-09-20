<script setup>
// /garden 花庭 — 全画幅对齐三层：底图 / 枝 / 门 + 天光纸纹
// 三层同尺寸 cover，避免裁切小块叠图导致的错位变形
import { onBeforeUnmount, onMounted, ref } from 'vue'
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
const stage = ref(null)
const base = import.meta.env.BASE_URL
const L = {
  base: `${base}images/garden/garden-base.webp`,
  branch: `${base}images/garden/garden-branch-full.webp`,
  door: `${base}images/garden/garden-door-full.webp`,
}

const px = ref(0)
const py = ref(0)
let reduced = false

function onPointer(e) {
  if (reduced || !stage.value) return
  const r = stage.value.getBoundingClientRect()
  px.value = ((e.clientX - r.left) / r.width - 0.5) * 2
  py.value = ((e.clientY - r.top) / r.height - 0.5) * 2
}

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
  reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  setTitle(`花庭 · ${site?.brand || 'Yuer Studio'}`)
  setDescription('风里偶尔有一朵不一样的花——从花庭遇见项目、笔记与书房。')
  stage.value?.addEventListener('pointermove', onPointer, { passive: true })
})

onBeforeUnmount(() => {
  stage.value?.removeEventListener('pointermove', onPointer)
})
</script>

<template>
  <div class="garden">
    <div ref="stage" class="garden__stage">
      <!-- 1 远景院墙（已挖空枝/门） -->
      <img
        class="garden__layer garden__layer--base"
        :src="L.base"
        alt=""
        aria-hidden="true"
        :style="{ transform: `translate3d(${px * -6}px, ${py * -4}px, 0)` }"
      />
      <!-- 2 门层（全画幅透明） -->
      <img
        class="garden__layer garden__layer--door"
        :src="L.door"
        alt=""
        aria-hidden="true"
        :style="{ transform: `translate3d(${px * -3}px, ${py * -2}px, 0)` }"
      />
      <!-- 3 梅枝前景（全画幅透明，视差最大） -->
      <img
        class="garden__layer garden__layer--branch"
        :src="L.branch"
        alt=""
        aria-hidden="true"
        :style="{ transform: `translate3d(${px * 16}px, ${py * 10}px, 0)` }"
      />
      <div
        class="garden__light"
        :style="{ transform: `translate3d(${px * 3}px, ${py * 2}px, 0)` }"
        aria-hidden="true"
      />
      <div class="garden__vignette" aria-hidden="true" />
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
  background: #e8e2d6;
}
/* 三层同尺寸 cover → 特征对齐；位移只差在 translate */
.garden__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  user-select: none;
  transition: transform 0.45s cubic-bezier(0, 0, 0.2, 1);
  will-change: transform;
}
.garden__layer--base {
  z-index: 0;
  filter: saturate(0.94) brightness(1.02);
}
.garden__layer--door {
  z-index: 1;
}
.garden__layer--branch {
  z-index: 2;
}
.garden__light {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 45% at 18% 12%, rgba(255, 244, 214, 0.35), transparent 55%),
    linear-gradient(165deg, rgba(255, 250, 240, 0.12), transparent 40%);
  mix-blend-mode: soft-light;
  transition: transform 0.55s cubic-bezier(0, 0, 0.2, 1);
}
.garden__vignette {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  box-shadow:
    inset 0 0 100px rgba(45, 32, 20, 0.2),
    inset 0 0 0 1px rgba(45, 32, 20, 0.06);
}
.garden__grain {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0.2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  background-size: 140px;
  mix-blend-mode: multiply;
}
.garden__overlay {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}
.garden__overlay :deep(canvas) {
  pointer-events: auto;
}
.brand {
  position: absolute;
  top: 22px;
  left: 24px;
  z-index: 7;
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
  z-index: 7;
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
  z-index: 7;
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
  .garden__layer,
  .garden__light {
    transition: none;
  }
}
</style>
