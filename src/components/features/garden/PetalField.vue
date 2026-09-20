<script setup>
// PetalField — 花庭落花与入口花（docs/17 + 手感校准：入口花更常见、可跟、可点）
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

// 手感：入口花出现更勤、更好跟、好点；外观与普通花接近，不做偏红/花心/光晕
const CFG = {
  firstDelayMs: 400,
  respawnMinMs: 600,
  respawnJitterMs: 900,
  dwellNameMs: 450,
  nearDist: 80,
  keepNamedDist: 140,
  clickDist: 48,
  portalRMin: 9,
  portalRMax: 12,
}

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
  // 偏左/中上落下，避免贴边；下落更慢，方便跟上
  return {
    portal: true,
    world: w,
    x: W * (0.22 + Math.random() * 0.42),
    y: -20 - Math.random() * 40,
    vx: 0.08 + Math.random() * 0.16,
    vy: 0.22 + Math.random() * 0.16,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.01,
    r: CFG.portalRMin + Math.random() * (CFG.portalRMax - CFG.portalRMin),
    ph: Math.random() * 6.28,
    wob: 0.55 + Math.random() * 0.25,
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

function placeLabel(p) {
  if (!labelEl) return
  labelEl.style.left = `${Math.min(W - 48, p.x + p.r + 14)}px`
  labelEl.style.top = `${p.y}px`
}

function spawn() {
  if (portal) return
  if (!queue.length) queue = shuffle([...props.worlds])
  portal = makePortal(queue.shift())
  petals.push(portal)
  dwell = 0
  hideLabel()
}

function scheduleRespawn(now) {
  portal = null
  nextAt = now + CFG.respawnMinMs + Math.random() * CFG.respawnJitterMs
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
  // 入口花仅比普通花略实一点（同色系），无偏红、无花心、无光晕
  ctx.fillStyle = p.portal ? 'rgba(232, 170, 168, 0.88)' : 'rgba(235, 200, 196, 0.5)'
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

  // 兜底：长时间无入口花则立刻刷一朵
  if (!portal && (now > nextAt || nextAt === 0)) spawn()

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i]
    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const dist = Math.hypot(dx, dy)

    let ax = wind * 0.16 + Math.sin(p.ph) * 0.08 * p.wob
    let ay = 0.02

    if (p.portal) {
      // 入口花：靠近时悬停变慢，不再「躲开鼠标」；稍远处轻微气流即可
      const hovering = dist < CFG.nearDist
      if (hovering) {
        p.vx *= 0.82
        p.vy *= 0.72
        ay = -0.01 + Math.sin(now * 0.004) * 0.015
      } else if (!reduced && dist < CFG.keepNamedDist && dist > 0.5) {
        // 极轻牵引，帮指针跟上（不是磁吸按钮）
        ax += (-dx / dist) * 0.04
        ay += (-dy / dist) * 0.03
      } else {
        ay = 0.012 // 更慢下落
      }
    } else if (!reduced && dist < 110 && dist > 0.5) {
      // 装饰花仍躲开鼠标
      ax += (dx / dist) * 0.32
      ay += (dy / dist) * 0.2
    }

    p.ph += 0.02 * p.wob
    p.vx += ax * 0.06
    p.vy += ay * 0.06
    if (p.portal) {
      p.vx *= 0.985
      p.vy *= 0.985
      // 入口花限速，避免突然窜出屏
      const sp = Math.hypot(p.vx, p.vy)
      const maxSp = hoveringSafe(dist, p) ? 0.35 : 0.85
      if (sp > maxSp) {
        p.vx = (p.vx / sp) * maxSp
        p.vy = (p.vy / sp) * maxSp
      }
    } else {
      p.vx *= 0.992
      p.vy *= 0.992
    }
    p.x += p.vx
    p.y += p.vy
    if (!p.portal || !p.named) p.rot += p.vr + wind * 0.008

    if (p.portal) {
      const nearD = reduced ? CFG.nearDist - 20 : CFG.nearDist
      if (dist < nearD) {
        p.near = true
        dwell += 16
        if (dwell >= (reduced ? 200 : CFG.dwellNameMs)) {
          p.named = true
        }
        if (p.named) {
          const el = ensureLabel(p.world.label)
          placeLabel(p)
          el.classList.add('on')
        }
      } else if (dist < CFG.keepNamedDist) {
        p.near = true
        // 显名后短暂离开近距不立刻丢名，降低「一闪就没」
        if (!p.named) {
          dwell = Math.max(0, dwell - 8)
        } else {
          const el = ensureLabel(p.world.label)
          placeLabel(p)
          el.classList.add('on')
        }
      } else {
        p.near = false
        if (p.named && dist > CFG.keepNamedDist + 40) {
          p.named = false
          hideLabel()
        } else if (!p.named) {
          hideLabel()
        } else {
          const el = ensureLabel(p.world.label)
          placeLabel(p)
          el.classList.add('on')
        }
      }
    }

    if (p.y > H + 28 || p.x < -60 || p.x > W + 60) {
      if (p.portal) {
        hideLabel()
        petals.splice(i, 1)
        scheduleRespawn(now)
      } else {
        petals[i] = ordinary()
      }
      continue
    }
    petalPath(p)
  }
}

function hoveringSafe(dist, p) {
  return p.portal && dist < CFG.keepNamedDist
}

function onMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onTouch(e) {
  const t = e.touches?.[0]
  if (!t) return
  mouse.x = t.clientX
  mouse.y = t.clientY
}

function tryEnter(clientX, clientY) {
  if (busy || !portal) return
  const d = Math.hypot(portal.x - clientX, portal.y - clientY)
  const hit = Math.max(CFG.clickDist, portal.r + 28)
  // 靠近、已显名，或已在花附近停留过：都可进入
  if (d < hit && (portal.named || portal.near || dwell > 120)) {
    busy = true
    emit('enter', portal.world)
  }
}

function onClick(e) {
  tryEnter(e.clientX, e.clientY)
}

function onTouchEnd(e) {
  const t = e.changedTouches?.[0]
  if (!t) return
  tryEnter(t.clientX, t.clientY)
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
  nextAt = performance.now() + CFG.firstDelayMs
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('touchstart', onTouch, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  cv.value?.addEventListener('click', onClick)
  cv.value?.addEventListener('touchend', onTouchEnd, { passive: true })
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('touchstart', onTouch)
  window.removeEventListener('touchmove', onTouch)
  cv.value?.removeEventListener('click', onClick)
  cv.value?.removeEventListener('touchend', onTouchEnd)
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
  background: rgba(255, 252, 246, 0.82);
  border: 1px solid rgba(176, 92, 58, 0.35);
  border-radius: 999px;
  padding: 4px 12px;
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
  z-index: 5;
  white-space: nowrap;
}
.portal-label.on {
  opacity: 0.98;
}
</style>
