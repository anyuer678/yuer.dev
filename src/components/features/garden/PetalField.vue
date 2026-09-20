<script setup>
// PetalField — 花庭落花与入口花（docs/17：同屏 portal ≤1，停留才显名）
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  worlds: { type: Array, required: true },
})
const emit = defineEmits(['enter'])

const cv = ref(null)
let ctx = null
let raf = 0
let W = 0
let H = 0
let petals = []
let portal = null
let queue = []
let labelEl = null
let overlayEl = null
const mouse = { x: -1e9, y: -1e9 }
let wind = 0
let dwell = 0
let nextAt = 0
let busy = false
let reduced = false

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ordinary() {
  return {
    portal: false,
    x: W * (0.05 + Math.random() * 0.7),
    y: -16 - Math.random() * H * 0.35,
    vx: 0.2 + Math.random() * 0.5,
    vy: 0.45 + Math.random() * 0.55,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.03,
    r: 5 + Math.random() * 5,
    ph: Math.random() * 6.28,
    wob: 0.5 + Math.random(),
  }
}

function makePortal(w) {
  return {
    portal: true,
    world: w,
    x: W * (0.18 + Math.random() * 0.45),
    y: -24 - Math.random() * 90,
    vx: 0.18 + Math.random() * 0.28,
    vy: 0.42 + Math.random() * 0.3,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.015,
    r: 9 + Math.random() * 2,
    ph: Math.random() * 6.28,
    wob: 0.65 + Math.random() * 0.4,
    near: false,
    named: false,
  }
}

function ensureLabel(text) {
  if (!labelEl) {
    labelEl = document.createElement('div')
    labelEl.className = 'portal-label'
    overlayEl?.appendChild(labelEl)
  }
  labelEl.textContent = text
  return labelEl
}

function hideLabel() {
  labelEl?.classList.remove('on')
  dwell = 0
}

function spawn() {
  if (portal) return
  if (!queue.length) queue = shuffle([...props.worlds])
  portal = makePortal(queue.shift())
  petals.push(portal)
  dwell = 0
  hideLabel()
}

function resize() {
  const c = cv.value
  if (!c) return
  W = c.width = window.innerWidth
  H = c.height = window.innerHeight
}

function petalPath(p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  const k = p.r
  ctx.fillStyle = p.portal ? 'rgba(232, 170, 168, 0.9)' : 'rgba(235, 200, 196, 0.5)'
  ctx.beginPath()
  ctx.moveTo(0, -k * 0.7)
  ctx.bezierCurveTo(k * 0.55, -k * 0.45, k * 0.45, k * 0.45, 0, k * 0.65)
  ctx.bezierCurveTo(-k * 0.45, k * 0.45, -k * 0.55, -k * 0.45, 0, -k * 0.7)
  ctx.fill()
  ctx.restore()
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  if (busy || !ctx) return
  ctx.clearRect(0, 0, W, H)
  wind = reduced ? 0.05 : Math.sin(now * 0.0002) * 0.55 + Math.sin(now * 0.0007) * 0.2

  if (!portal && now > nextAt) spawn()

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i]
    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const dist = Math.hypot(dx, dy)

    let ax = wind * 0.16 + Math.sin(p.ph) * 0.08 * p.wob
    let ay = 0.02
    if (!reduced && dist < 110 && dist > 0.5) {
      ax += (dx / dist) * 0.32
      ay += (dy / dist) * 0.2
    }

    p.ph += 0.02 * p.wob
    p.vx += ax * 0.06
    p.vy += ay * 0.06
    p.vx *= 0.992
    p.vy *= 0.992
    p.x += p.vx
    p.y += p.vy
    if (!p.portal || !p.named) p.rot += p.vr + wind * 0.008

    if (p.portal) {
      const nearD = reduced ? 40 : 55
      const farD = reduced ? 80 : 120
      if (dist < nearD) {
        p.near = true
        dwell += 16
        if (dwell > 600) {
          p.named = true
          const el = ensureLabel(p.world.label)
          el.style.left = `${p.x + 22}px`
          el.style.top = `${p.y}px`
          el.classList.add('on')
        }
      } else if (dist < farD) {
        p.near = true
        dwell = 0
        hideLabel()
      } else {
        p.near = false
        p.named = false
        hideLabel()
      }
    }

    if (p.y > H + 28 || p.x < -40 || p.x > W + 40) {
      if (p.portal) {
        hideLabel()
        petals.splice(i, 1)
        portal = null
        nextAt = now + 2800 + Math.random() * 4000
      } else {
        petals[i] = ordinary()
      }
      continue
    }
    petalPath(p)
  }
}

function onMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onLeave(e) {
  if (busy || !portal) return
  const d = Math.hypot(portal.x - e.clientX, portal.y - e.clientY)
  if (d < 36 && (portal.named || portal.near)) {
    busy = true
    emit('enter', portal.world)
  }
}

onMounted(() => {
  reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const isTouch =
    window.matchMedia?.('(pointer: coarse)').matches && (navigator.maxTouchPoints || 0) > 0
  queue = shuffle([...props.worlds])
  ctx = cv.value?.getContext('2d')
  overlayEl = cv.value?.parentElement?.querySelector('.garden__overlay')
  resize()
  const count = reduced || isTouch ? 10 : 16
  for (let i = 0; i < count; i++) petals.push(ordinary())
  nextAt = performance.now() + 1800
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMove)
  cv.value?.addEventListener('click', onLeave)
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMove)
  cv.value?.removeEventListener('click', onLeave)
  labelEl?.remove()
  labelEl = null
  petals = []
  portal = null
})
</script>

<template>
  <canvas
    id="petals"
    ref="cv"
    class="petals"
    aria-hidden="true"
    role="presentation"
  />
</template>

<style scoped>
.petals {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: default;
}
</style>

<style>
.portal-label {
  position: absolute;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.22em;
  color: var(--color-accent);
  background: rgba(255, 252, 246, 0.72);
  border-radius: 999px;
  padding: 4px 12px;
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
  z-index: 5;
}
.portal-label.on {
  opacity: 0.95;
}
</style>
