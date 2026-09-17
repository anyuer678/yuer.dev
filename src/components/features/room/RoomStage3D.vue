<script setup>
// RoomStage3D —— 加载程序化 study_room.glb，射线点选 + 轨道视角
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import roomBooks from '@/content/room-books.json'

const props = defineProps({
  lampOn: { type: Boolean, default: true },
  monitorOn: { type: Boolean, default: false },
  drawerOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'hover'])

const host = ref(null)
const ready = ref(false)
const loadPct = ref(0)

let renderer, scene, camera, controls, raycaster, pointer
let frame = 0
let modelRoot = null
let deskLampLight, floorLampLight, screenMesh, drawerUpper, drawerLower
const clickables = []
const clock = new THREE.Clock()

const deskBookMap = Object.fromEntries((roomBooks.deskBooks || []).map((b) => [b.mesh, b]))
const sideBook = roomBooks.sideBook
const shelfNotes = roomBooks.shelfNotes || []

/** 节点名 → 交互元数据（书类在加载后二次覆盖） */
const INTERACTIVE = [
  {
    test: (n) => n === 'Monitor_Screen' || n.startsWith('Monitor'),
    data: { id: 'monitor', label: '显示器', kind: 'projects', blurb: '屏幕亮起：项目列表。', cta: '打开项目', to: '/projects' },
  },
  {
    test: (n) => n.startsWith('DeskLamp') || n.includes('lamp_shade'),
    data: { id: 'lamp', label: '书桌台灯', kind: 'timeline', blurb: '开关台灯，照亮工作台。', cta: '时间线', to: '/timeline' },
  },
  {
    test: (n) => n.startsWith('Desk_Drawer'),
    data: { id: 'drawer', label: '桌下抽屉', kind: 'lab', blurb: '拉开：实验与课程项目。', cta: '实验室', to: '/lab' },
  },
  {
    test: (n) => n.startsWith('Bookcase_Globe'),
    data: { id: 'globe', label: '地球仪', kind: 'lab', blurb: '走得更远：基础设施与实验。', cta: '实验室', to: '/lab' },
  },
  {
    test: (n) => n.startsWith('Bookcase') && !n.startsWith('BK') && !n.startsWith('BS'),
    data: { id: 'bookcase', label: '书架', kind: 'flagship', blurb: '满墙书脊：Flagship 与产品档案。', cta: '查看项目', to: '/projects' },
  },
  {
    test: (n) => n.includes('Desk_Papers'),
    data: { id: 'papers', label: '桌面文稿', kind: 'notes', blurb: '最近写的。', cta: '笔记', to: '/notes' },
  },
  {
    test: (n) => n.includes('Desk_Plant') || n.includes('Plant'),
    data: { id: 'plant', label: '绿植', kind: 'about', blurb: '关于我。', cta: '关于', to: '/about' },
  },
  {
    test: (n) => n.includes('Mug'),
    data: { id: 'mug', label: '茶杯', kind: 'easter', blurb: '「软件不是一次完成的作品，而是在不断使用和改进中成长的系统。」' },
  },
  {
    test: (n) => n.startsWith('FloorLamp'),
    data: { id: 'floorlamp', label: '落地灯', kind: 'timeline', blurb: '角落里的光。', cta: '时间线', to: '/timeline' },
  },
  {
    test: (n) => n.startsWith('WallClock'),
    data: { id: 'clock', label: '挂钟', kind: 'pulse', blurb: '最近仓库发生了什么。' },
  },
  {
    test: (n) => n.startsWith('Armchair') || n.startsWith('OfficeChair'),
    data: { id: 'chair', label: '椅子', kind: 'contact', blurb: '坐下聊聊？', cta: '联系', to: '/contact' },
  },
  {
    test: (n) => n.startsWith('Desktop_') || n === 'Desk_Pad',
    data: { id: 'desk', label: '橡木书桌', kind: 'desk', blurb: '工作台面。' },
  },
  {
    test: (n) => n.includes('Window') || n.includes('Curtain') || n.includes('Sill'),
    data: { id: 'window', label: '窗', kind: 'contact', blurb: '窗外有光。有事写信。', cta: '联系', to: '/contact' },
  },
]

function matchInteractive(name) {
  if (!name) return null
  for (const rule of INTERACTIVE) {
    if (rule.test(name)) return { ...rule.data }
  }
  return null
}

function bookDataFor(name) {
  if (!name) return null
  if (deskBookMap[name]) {
    const b = deskBookMap[name]
    return {
      id: 'book:' + name,
      label: b.title,
      kind: 'notes',
      blurb: b.blurb,
      cta: '打开笔记',
      to: `/notes/${b.slug}`,
    }
  }
  if (sideBook && name === sideBook.mesh) {
    return {
      id: 'book:' + name,
      label: sideBook.title,
      kind: 'notes',
      blurb: sideBook.blurb,
      cta: '打开笔记',
      to: `/notes/${sideBook.slug}`,
    }
  }
  if (name.startsWith('BK') || name.startsWith('BS')) {
    const idx = Math.abs(hashCode(name)) % shelfNotes.length
    const n = shelfNotes[idx]
    return {
      id: 'book:' + name,
      label: n.title,
      kind: 'notes',
      blurb: `书架上的一本：${n.title}`,
      cta: '打开笔记',
      to: `/notes/${n.slug}`,
    }
  }
  return null
}

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

async function decorateArt(root, base) {
  const texLoader = new THREE.TextureLoader()
  const urls = [`${base}models/study_room/art/art1.webp`, `${base}models/study_room/art/art2.webp`]
  const texes = []
  for (const u of urls) {
    try {
      const t = await texLoader.loadAsync(u)
      t.colorSpace = THREE.SRGBColorSpace
      texes.push(t)
    } catch {
      /* skip */
    }
  }
  if (!texes.length) return
  let i = 0
  root.traverse((c) => {
    if (!c.isMesh) return
    const n = c.name || ''
    const isArt =
      /art|Frame|Picture|Canvas|Painting/i.test(n) ||
      (c.material?.map && /art[123]/i.test(c.material.map.name || ''))
    if (!isArt) return
    const t = texes[i % texes.length]
    i++
    c.material = new THREE.MeshStandardMaterial({
      map: t,
      roughness: 0.85,
      metalness: 0,
    })
  })
}

function tagClickable(obj) {
  const shelfPool = []
  obj.traverse((child) => {
    if (!child.isMesh) return
    const book = bookDataFor(child.name) || bookDataFor(child.parent?.name)
    const data = book || matchInteractive(child.name) || matchInteractive(child.parent?.name)
    if (!data) return
    child.userData = { ...child.userData, interactive: true, ...data, meshName: child.name }
    clickables.push(child)
    if (child.name?.startsWith('BK') || child.name?.startsWith('BS')) shelfPool.push(child)
  })
  // 书架书按名稳定映射已在 bookDataFor 完成
  return shelfPool
}

function findByName(root, names) {
  const found = {}
  root.traverse((c) => {
    for (const n of names) {
      if (c.name === n || c.name.startsWith(n)) found[n] = found[n] || c
    }
  })
  return found
}

function applyLamp(on) {
  if (deskLampLight) {
    deskLampLight.intensity = on ? 2.8 : 0.2
    deskLampLight.visible = true
  }
  if (floorLampLight) floorLampLight.intensity = on ? 1.2 : 0.15
  scene?.traverse((c) => {
    if (c.isMesh && c.material && c.name.includes('lamp')) {
      // 保持材质；亮度靠灯光
    }
  })
}

function applyMonitor(on) {
  if (!screenMesh?.material) return
  const m = screenMesh.material
  if (on) {
    m.emissive = new THREE.Color(0x1a3d2e)
    m.emissiveIntensity = 0.85
    m.color = new THREE.Color(0x0d1512)
  } else {
    m.emissive = new THREE.Color(0x000000)
    m.emissiveIntensity = 0
    m.color = new THREE.Color(0x111111)
  }
  m.needsUpdate = true
}

function applyDrawer(open) {
  const d = drawerUpper || drawerLower
  if (!d) return
  // 抽屉沿 Z 拉出（模型局部）
  const z = open ? 0.12 : 0
  if (drawerUpper) drawerUpper.position.z = (drawerUpper.userData._z0 ?? drawerUpper.position.z) + z
  if (drawerLower) drawerLower.position.z = (drawerLower.userData._z0 ?? drawerLower.position.z) + z * 0.7
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
  if (hit?.userData?.interactive) emit('select', { ...hit.userData })
}

function animate() {
  frame = requestAnimationFrame(animate)
  const t = clock.getElapsedTime()
  controls?.update()
  if (deskLampLight && props.lampOn) {
    deskLampLight.intensity = 2.6 + Math.sin(t * 1.7) * 0.15
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

onMounted(async () => {
  const el = host.value
  if (!el) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2a2218)

  camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.05, 40)
  camera.position.set(2.6, 1.85, 2.4)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.appendChild(renderer.domElement)

  // 环境反射，避免塑料感
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 1.6
  controls.maxDistance = 6.0
  controls.minPolarAngle = 0.55
  controls.maxPolarAngle = 1.48
  controls.minAzimuthAngle = -1.2
  controls.maxAzimuthAngle = 1.2
  controls.target.set(0, 0.9, -0.4)
  controls.enablePan = false

  scene.add(new THREE.AmbientLight(0xffe6cc, 0.55))
  const hemi = new THREE.HemisphereLight(0xb8c8d8, 0x3a2a18, 0.5)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xffd8a8, 1.1)
  sun.position.set(3.5, 5, 2.5)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 20
  scene.add(sun)

  deskLampLight = new THREE.PointLight(0xffc078, 2.6, 3.2, 2)
  deskLampLight.position.set(0.62, 1.35, -2.05)
  deskLampLight.castShadow = true
  scene.add(deskLampLight)

  floorLampLight = new THREE.PointLight(0xffd0a0, 1.0, 4, 2)
  floorLampLight.position.set(1.78, 1.4, 1.28)
  scene.add(floorLampLight)

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  const loader = new GLTFLoader()
  const base = import.meta.env.BASE_URL
  try {
    const gltf = await loader.loadAsync(`${base}models/study_room/study_room.glb`, (e) => {
      if (e.total) loadPct.value = Math.round((e.loaded / e.total) * 100)
    })
    modelRoot = gltf.scene
    modelRoot.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true
        c.receiveShadow = true
      }
    })
    scene.add(modelRoot)
    tagClickable(modelRoot)
    await decorateArt(modelRoot, base)

    const named = findByName(modelRoot, [
      'Monitor_Screen',
      'Desk_Drawer_Upper',
      'Desk_Drawer_Lower',
      'DeskLamp',
      'FloorLamp',
    ])
    screenMesh = named['Monitor_Screen'] || null
    drawerUpper = named['Desk_Drawer_Upper'] || null
    drawerLower = named['Desk_Drawer_Lower'] || null
    if (drawerUpper) drawerUpper.userData._z0 = drawerUpper.position.z
    if (drawerLower) drawerLower.userData._z0 = drawerLower.position.z

    // 若模型自带灯节点，对齐点光位置
    if (named['DeskLamp']) {
      const p = new THREE.Vector3()
      named['DeskLamp'].getWorldPosition(p)
      deskLampLight.position.set(p.x, p.y + 0.35, p.z)
    }

    applyLamp(props.lampOn)
    applyMonitor(props.monitorOn)
    applyDrawer(props.drawerOpen)
    ready.value = true
  } catch (err) {
    console.error('[RoomStage3D] load failed', err)
  }

  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('click', onClick)
  window.addEventListener('resize', resize)
  animate()
})

watch(
  () => props.lampOn,
  (v) => applyLamp(v)
)
watch(
  () => props.monitorOn,
  (v) => applyMonitor(v)
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
  <div ref="host" class="room3d" :class="{ 'room3d--ready': ready }" aria-label="3D 工作室">
    <div v-if="!ready" class="room3d__loading">
      <span>载入书房… {{ loadPct }}%</span>
    </div>
  </div>
</template>

<style scoped>
.room3d {
  position: absolute;
  inset: 0;
  background: #2a2218;
  opacity: 0;
  transition: opacity 0.55s var(--ease-standard);
  touch-action: none;
}
.room3d--ready {
  opacity: 1;
}
.room3d__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  color: #e8d8c0;
  letter-spacing: 0.06em;
}
.room3d :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
