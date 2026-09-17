<script setup>
// RoomStage3D —— Three.js 暖色书房：轻转视角 + 物件射线拾取
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps({
  lampOn: { type: Boolean, default: true },
  drawerOpen: { type: Boolean, default: false },
  laptopOn: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'hover'])

const host = ref(null)
const ready = ref(false)

let renderer, scene, camera, controls, raycaster, pointer
let frame = 0
let lampLight, lampBulb, laptopScreen, drawerMesh
const clickables = []
const clock = new THREE.Clock()

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.05,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  })
}

function box(w, h, d, material, x, y, z, name) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  if (name) m.name = name
  return m
}

function markClickable(mesh, data) {
  mesh.userData = { ...mesh.userData, interactive: true, ...data }
  clickables.push(mesh)
  return mesh
}

function buildRoom() {
  const root = new THREE.Group()

  // 材质
  const floorMat = mat(0x8b6914, { roughness: 0.85 })
  floorMat.color.setHex(0x7a5c3a)
  const wallMat = mat(0xf2ebe0, { roughness: 0.95 })
  const wood = mat(0x9a6b3f, { roughness: 0.7 })
  const woodDark = mat(0x6e4a28, { roughness: 0.75 })
  const brass = mat(0xb0894f, { roughness: 0.35, metalness: 0.55 })
  const paper = mat(0xf7f1e6, { roughness: 0.9 })
  const fabric = mat(0xc4a882, { roughness: 0.95 })
  const screenOff = mat(0x1a1a1a, { roughness: 0.25, metalness: 0.2 })
  const ceramic = mat(0xe8ddd0, { roughness: 0.4 })
  const green = mat(0x6d8f6a, { roughness: 0.8 })
  const cork = mat(0xc4a574, { roughness: 0.95 })
  const note = mat(0xf5e6c8, { roughness: 0.9 })

  // 地板 / 墙
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  root.add(floor)

  const back = new THREE.Mesh(new THREE.PlaneGeometry(10, 4.2), wallMat)
  back.position.set(0, 2.1, -3.2)
  back.receiveShadow = true
  root.add(back)

  const left = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.2), wallMat)
  left.rotation.y = Math.PI / 2
  left.position.set(-4.2, 2.1, 0)
  left.receiveShadow = true
  root.add(left)

  // 窗（右墙）
  const windowFrame = box(0.12, 2.4, 2.2, woodDark, 4.15, 2.0, 0.2)
  root.add(windowFrame)
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 2.2),
    new THREE.MeshStandardMaterial({
      color: 0x8fadcf,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.55,
      emissive: 0x6a8aaa,
      emissiveIntensity: 0.25,
    })
  )
  glass.rotation.y = -Math.PI / 2
  glass.position.set(4.08, 2.0, 0.2)
  root.add(glass)

  // 书桌
  const desk = new THREE.Group()
  desk.position.set(0.4, 0, -0.6)
  const deskTop = box(3.2, 0.08, 1.5, wood, 0, 0.95, 0, 'desk')
  markClickable(deskTop, { id: 'desk', label: '橡木书桌', kind: 'desk', blurb: '工作台面。上面的东西都可以点。' })
  desk.add(deskTop)
  for (const [x, z] of [
    [-1.45, -0.6],
    [1.45, -0.6],
    [-1.45, 0.6],
    [1.45, 0.6],
  ]) {
    desk.add(box(0.1, 0.95, 0.1, woodDark, x, 0.475, z))
  }
  // 桌下抽屉
  drawerMesh = box(1.0, 0.28, 1.2, woodDark, 0.2, 0.72, 0)
  markClickable(drawerMesh, { id: 'drawer', label: '抽屉', kind: 'lab', blurb: '拉开看看实验室里的东西。' })
  desk.add(drawerMesh)
  root.add(desk)

  // 笔记本电脑
  const laptop = new THREE.Group()
  laptop.position.set(0.9, 1.02, -0.85)
  const base = box(0.72, 0.03, 0.5, mat(0xc5c5c5, { metalness: 0.4, roughness: 0.35 }), 0, 0, 0)
  laptop.add(base)
  const lid = box(0.72, 0.48, 0.02, mat(0xbdbdbd, { metalness: 0.35, roughness: 0.4 }), 0, 0.25, -0.24)
  lid.rotation.x = -0.15
  laptop.add(lid)
  laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.4), screenOff.clone())
  laptopScreen.position.set(0, 0.25, -0.225)
  laptopScreen.rotation.x = -0.15
  markClickable(laptopScreen, { id: 'laptop', label: '笔记本电脑', kind: 'projects', blurb: '屏幕亮起：项目列表。', cta: '打开项目' })
  laptop.add(laptopScreen)
  root.add(laptop)

  // 摊开的笔记本
  const notebook = new THREE.Group()
  notebook.position.set(-0.15, 1.01, -0.35)
  const pageL = box(0.28, 0.015, 0.36, paper, -0.14, 0, 0)
  const pageR = box(0.28, 0.015, 0.36, paper, 0.14, 0, 0)
  notebook.add(pageL, pageR)
  markClickable(pageL, { id: 'notebook', label: '摊开的笔记本', kind: 'focus', blurb: '当前 Focus：Lumen。', cta: '阅读 Lumen', to: '/projects/lumen' })
  markClickable(pageR, { id: 'notebook', label: '摊开的笔记本', kind: 'focus', blurb: '当前 Focus：Lumen。', cta: '阅读 Lumen', to: '/projects/lumen' })
  root.add(notebook)

  // 书堆
  const stack = new THREE.Group()
  stack.position.set(-0.55, 1.0, -0.75)
  const bookCols = [0x8b4a3a, 0x5c6b5a, 0xc4b49a]
  bookCols.forEach((c, i) => {
    const b = box(0.38, 0.06, 0.28, mat(c, { roughness: 0.85 }), 0, i * 0.065, 0)
    if (i === 1) {
      markClickable(b, { id: 'books', label: '书堆', kind: 'notes', blurb: '60+ 篇开发笔记。', cta: '浏览笔记', to: '/notes' })
    }
    stack.add(b)
  })
  root.add(stack)

  // 茶杯
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 20), ceramic)
  mug.position.set(-0.9, 1.06, -0.25)
  mug.castShadow = true
  markClickable(mug, { id: 'mug', label: '茶杯', kind: 'easter', blurb: '「软件不是一次完成的作品，而是在不断使用和改进中成长的系统。」' })
  root.add(mug)

  // 台灯
  const lamp = new THREE.Group()
  lamp.position.set(-1.1, 1.0, -0.9)
  lamp.add(box(0.22, 0.03, 0.22, brass, 0, 0.015, 0))
  lamp.add(box(0.04, 0.55, 0.04, brass, 0, 0.3, 0))
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.2, 24, 1, true), brass)
  shade.position.set(0.08, 0.58, 0)
  shade.rotation.z = -0.5
  lamp.add(shade)
  lampBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xffe6b0, emissive: 0xffc878, emissiveIntensity: 1.2 })
  )
  lampBulb.position.set(0.12, 0.5, 0)
  markClickable(lampBulb, { id: 'lamp', label: '黄铜台灯', kind: 'timeline', blurb: '开关灯，照亮工作台。', cta: '时间线', to: '/timeline' })
  markClickable(shade, { id: 'lamp', label: '黄铜台灯', kind: 'timeline', blurb: '开关灯，照亮工作台。', cta: '时间线', to: '/timeline' })
  lamp.add(lampBulb)
  lampLight = new THREE.PointLight(0xffc878, 2.2, 4.5, 2)
  lampLight.position.set(0.15, 0.48, 0)
  lampLight.castShadow = true
  lampLight.shadow.mapSize.set(512, 512)
  lamp.add(lampLight)
  root.add(lamp)

  // 多肉
  const plant = new THREE.Group()
  plant.position.set(0.15, 1.0, -0.95)
  plant.add(box(0.12, 0.1, 0.12, ceramic, 0, 0.05, 0))
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), green)
  leaves.position.y = 0.16
  leaves.scale.y = 0.7
  markClickable(leaves, { id: 'plant', label: '多肉', kind: 'about', blurb: '关于我。', cta: '关于', to: '/about' })
  plant.add(leaves)
  root.add(plant)

  // 书架
  const shelf = new THREE.Group()
  shelf.position.set(-2.8, 0, -2.6)
  shelf.add(box(2.2, 3.2, 0.45, woodDark, 0, 1.6, 0))
  for (let i = 0; i < 4; i++) {
    const y = 0.45 + i * 0.7
    shelf.add(box(2.0, 0.05, 0.4, wood, 0, y, 0.02))
    // 书
    for (let j = 0; j < 7; j++) {
      const bh = 0.28 + (j % 3) * 0.04
      const bcol = [0x8b5a4a, 0x5a6b5c, 0xc4b8a0, 0x4a5568][(i + j) % 4]
      const bk = box(0.12, bh, 0.28, mat(bcol, { roughness: 0.9 }), -0.85 + j * 0.28, y + bh / 2 + 0.03, 0)
      if (i === 1 && j === 3) {
        markClickable(bk, { id: 'bookshelf', label: '书架', kind: 'flagship', blurb: 'Flagship：Lumen · PolyCodeHub · EvoCode', cta: '查看项目', to: '/projects' })
      }
      shelf.add(bk)
    }
  }
  // 抽屉柜
  const cabinet = new THREE.Group()
  cabinet.position.set(1.3, 0, -0.1)
  cabinet.add(box(0.9, 1.6, 0.55, wood, 0, 0.8, 0))
  for (let i = 0; i < 3; i++) {
    const dr = box(0.75, 0.35, 0.08, woodDark, 0, 0.45 + i * 0.42, 0.28)
    markClickable(dr, { id: 'cabinet', label: '档案柜', kind: 'lab', blurb: '实验与课程项目。', cta: '实验室', to: '/lab' })
    cabinet.add(dr)
  }
  shelf.add(cabinet)
  root.add(shelf)

  // 软木板
  const board = new THREE.Group()
  board.position.set(-4.0, 2.0, -1.2)
  board.rotation.y = Math.PI / 2
  board.add(box(0.06, 1.4, 1.8, woodDark, 0, 0, 0))
  const corkFace = box(0.02, 1.2, 1.6, cork, 0.04, 0, 0)
  markClickable(corkFace, { id: 'pinboard', label: '软木板', kind: 'about', blurb: '关于我：把想法做成软件。', cta: '关于', to: '/about' })
  board.add(corkFace)
  for (let i = 0; i < 5; i++) {
    const n = box(0.015, 0.18, 0.14, note, 0.06, 0.35 - i * 0.15, -0.5 + (i % 3) * 0.4)
    board.add(n)
  }
  root.add(board)

  // 椅子
  const chair = new THREE.Group()
  chair.position.set(-0.3, 0, 1.1)
  chair.add(box(0.55, 0.08, 0.55, fabric, 0, 0.55, 0))
  chair.add(box(0.55, 0.7, 0.08, fabric, 0, 0.95, -0.24))
  for (const [x, z] of [
    [-0.22, -0.22],
    [0.22, -0.22],
    [-0.22, 0.22],
    [0.22, 0.22],
  ]) {
    chair.add(box(0.06, 0.55, 0.06, woodDark, x, 0.275, z))
  }
  root.add(chair)

  // 地毯
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), mat(0xd4c4a8, { roughness: 0.98 }))
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0.2, 0.01, 0.3)
  rug.receiveShadow = true
  root.add(rug)

  return root
}

function applyLamp(on) {
  if (!lampLight || !lampBulb) return
  lampLight.intensity = on ? 2.4 : 0.15
  lampLight.color.set(on ? 0xffc878 : 0x8899aa)
  lampBulb.material.emissiveIntensity = on ? 1.3 : 0.05
  if (laptopScreen && props.laptopOn) {
    laptopScreen.material.emissiveIntensity = on ? 0.7 : 0.35
  }
}

function applyLaptop(on) {
  if (!laptopScreen) return
  laptopScreen.material = (on ? laptopScreen.material.clone() : laptopScreen.material.clone())
  laptopScreen.material.color.set(on ? 0x1e2a22 : 0x1a1a1a)
  laptopScreen.material.emissive = new THREE.Color(on ? 0x2f5540 : 0x000000)
  laptopScreen.material.emissiveIntensity = on ? 0.65 : 0
}

function applyDrawer(open) {
  if (!drawerMesh) return
  drawerMesh.position.z = open ? 0.35 : 0
  drawerMesh.position.y = open ? 0.78 : 0.72
}

function onPointerMove(e) {
  if (!renderer || !camera || !host.value) return
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(clickables, false)
  const hit = hits[0]?.object
  if (hit?.userData?.interactive) {
    host.value.style.cursor = 'pointer'
    emit('hover', hit.userData)
  } else {
    host.value.style.cursor = 'grab'
    emit('hover', null)
  }
}

function onClick(e) {
  if (!renderer || !camera || !host.value) return
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(clickables, false)
  const hit = hits[0]?.object
  if (hit?.userData?.interactive) {
    emit('select', { ...hit.userData })
  }
}

function animate() {
  frame = requestAnimationFrame(animate)
  const t = clock.getElapsedTime()
  if (controls) controls.update()
  if (lampBulb && props.lampOn) {
    lampBulb.material.emissiveIntensity = 1.15 + Math.sin(t * 2.2) * 0.12
  }
  renderer?.render(scene, camera)
}

function resize() {
  if (!host.value || !renderer || !camera) return
  const w = host.value.clientWidth
  const h = host.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

onMounted(() => {
  const el = host.value
  if (!el) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1c1610)
  scene.fog = new THREE.Fog(0x1c1610, 8, 16)

  camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 50)
  camera.position.set(2.8, 2.4, 3.6)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  el.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.minDistance = 2.2
  controls.maxDistance = 6.5
  controls.minPolarAngle = 0.9
  controls.maxPolarAngle = 1.45
  controls.minAzimuthAngle = -0.9
  controls.maxAzimuthAngle = 0.9
  controls.target.set(0.2, 1.0, -0.4)
  controls.enablePan = false

  // 灯光
  scene.add(new THREE.AmbientLight(0xffe8d0, 0.35))
  const hemi = new THREE.HemisphereLight(0xc8d8e8, 0x3a2a18, 0.45)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xffd4a8, 0.85)
  sun.position.set(5, 6, 2)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 20
  scene.add(sun)

  scene.add(buildRoom())
  applyLamp(props.lampOn)
  applyLaptop(props.laptopOn)
  applyDrawer(props.drawerOpen)

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('click', onClick)
  window.addEventListener('resize', resize)

  animate()
  ready.value = true
})

watch(
  () => props.lampOn,
  (v) => applyLamp(v)
)
watch(
  () => props.laptopOn,
  (v) => applyLaptop(v)
)
watch(
  () => props.drawerOpen,
  (v) => applyDrawer(v)
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  if (host.value) {
    host.value.removeEventListener('pointermove', onPointerMove)
    host.value.removeEventListener('click', onClick)
  }
  controls?.dispose()
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  clickables.length = 0
})
</script>

<template>
  <div ref="host" class="room3d" :class="{ 'room3d--ready': ready }" aria-label="3D 工作室" />
</template>

<style scoped>
.room3d {
  position: absolute;
  inset: 0;
  background: #1c1610;
  opacity: 0;
  transition: opacity 0.6s var(--ease-standard);
  touch-action: none;
}
.room3d--ready {
  opacity: 1;
}
.room3d :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
