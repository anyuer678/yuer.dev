<script setup>
// /garden 花庭 — 漫游壳：分层静态空间 + Canvas 落花 + 纸页转场（docs/16/17）
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
  far: `${base}images/garden/garden-far.webp`,
  branch: `${base}images/garden/garden-branch.webp`,
  door: `${base}images/garden/garden-door.webp`,
}

// 视差（静态层 + 指针；减动效关闭）
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
      <!-- 静态分层：远景 → 院墙 → 梅枝/门（网页负责动态，不靠一张动画壁纸） -->
      <div
        class="garden__layer garden__layer--far"
        :style="{
          backgroundImage: `url(${L.far})`,
          transform: `translate(${px * -8}px, ${py * -4}px) scale(1.06)`,
        }"
        aria-hidden="true"
      />
      <div
        class="garden__layer garden__layer--branch"
        :style="{
          backgroundImage: `url(${L.branch})`,
          transform: `translate(${px * 22}px, ${py * 14}px)`,
        }"
        aria-hidden="true"
      />
      <div
        class="garden__layer garden__layer--door"
        :style="{
          backgroundImage: `url(${L.door})`,
          transform: `translate(${px * -6}px, ${py * -3}px)`,
        }"
        aria-hidden="true"
      />

      <div class="garden__grain" aria-hidden="true" />

      <div class="brand" aria-hidden="true">
        花笺<small>HUAJIAN</small>
      </div>

      <div class="garden__overlay">
        <PetalField :worlds="worlds" @enter="onEnter" />
      </div>

      <!-- 门热区：叠在分层门上，不是列表导航 -->
      <button
        type="button"
        class="study-gate"
        aria-label="进入书房"
        @click="leave('/room')"
      >
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
  background-color: #f0ebe2;
  overflow: hidden;
}
.garden__layer {
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.35s var(--ease-out, cubic-bezier(0, 0, 0.2, 1));
}
.garden__layer--far {
  inset: -4%;
  z-index: 0;
  background-size: cover;
}
.garden__layer--branch {
  left: 0;
  top: 0;
  width: min(48vw, 640px);
  height: min(46vh, 420px);
  z-index: 2;
  background-size: contain;
  background-position: left top;
  background-repeat: no-repeat;
}
.garden__layer--door {
  right: 4%;
  bottom: 10%;
  width: min(28vw, 360px);
  height: min(58vh, 520px);
  z-index: 2;
  background-size: contain;
  background-position: center bottom;
  opacity: 0.95;
}
.garden__grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  background-size: 140px;
  mix-blend-mode: multiply;
}
.garden__overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}
.garden__overlay :deep(canvas) {
  pointer-events: auto;
}
.brand {
  position: absolute;
  top: 22px;
  left: 24px;
  z-index: 5;
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
  z-index: 5;
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
  right: 7%;
  bottom: 16%;
  z-index: 5;
  width: min(170px, 24vw);
  height: min(240px, 34vh);
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
  top: 42%;
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
  .garden__layer--branch {
    width: min(62vw, 360px);
    height: min(36vh, 260px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .garden__grain {
    opacity: 0.12;
  }
  .garden__layer {
    transition: none;
  }
}
</style>
