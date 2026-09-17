<script setup>
// RoomStage3D —— GLB 书房：性能优先（限 DPR、节流射线、轻量开书）
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import roomBooks from '@/content/room-books.json'
import { githubData, getProject } from '@/utils/content.js'

const props = defineProps({
  lampOn: { type: Boolean, default: true },
  monitorOn: { type: Boolean, default: false },
  drawerOpen: { type: Boolean, default: false },
  openBookId: { type: String, default: '' },
  focusId: { type: String, default: '' },
})
const emit = defineEmits(['select', 'hover', 'ready'])

const host = ref(null)
const ready = ref(false)
const loadPct = ref(0)

let renderer, scene, camera, controls, raycaster, pointer
let frame = 0
let modelRoot = null
let deskLampLight, floorLampLight, screenMesh, drawerUpper, drawerLower
let pmrem = null
let dustPoints = null
let clockHands = null
let windowGlass = null
let sunLight = null
const clickables = []
const clock = new THREE.Clock()

const openBooks = new Map()
const DUST_DAYS = 45
let bookGlow = null
let hoverMesh = null
const hoverBase = new WeakMap()

const deskBookMap = Object.fromEntries((roomBooks.deskBooks || []).map((b) => [b.mesh, b]))
const sideBook = roomBooks.sideBook
const shelfNotes = roomBooks.shelfNotes || []

function daysSince(iso) {
  if (!iso) return 999
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function repoAgeDays(repo) {
  if (!repo) return null
  const r = githubData.repos?.[repo]
  return r?.pushed_at ? daysSince(r.pushed_at) : null
}

function applyDust(mesh, ageDays) {
  if (!mesh?.material?.color || ageDays == null) return
  const dust = Math.min(1, Math.max(0, (ageDays - DUST_DAYS) / 90))
  if (dust <= 0) return
  const hsl = {}
  mesh.material.color.getHSL(hsl)
  mesh.material.color.setHSL(hsl.h, hsl.s * (1 - dust * 0.7), Math.min(0.82, hsl.l + dust * 0.2))
  mesh.material.roughness = Math.min(1, (mesh.material.roughness ?? 0.8) + dust * 0.15)
}

const INTERACTIVE = [
  { test: (n) => n === 'Monitor_Screen' || n.startsWith('Monitor'), data: { id: 'monitor', label: '显示器', kind: 'projects', blurb: '屏幕亮起：项目列表。', cta: '打开项目', to: '/projects' } },
  { test: (n) => n.startsWith('DeskLamp') || n.includes('lamp_shade'), data: { id: 'lamp', label: '书桌台灯', kind: 'timeline', blurb: '开关台灯。', cta: '时间线', to: '/timeline' } },
  { test: (n) => n.startsWith('Desk_Drawer'), data: { id: 'drawer', label: '桌下抽屉', kind: 'lab', blurb: '拉开：实验与课程。', cta: '实验室', to: '/lab' } },
  { test: (n) => n.startsWith('Bookcase_Globe'), data: { id: 'globe', label: '地球仪', kind: 'lab', blurb: '基础设施实验。', cta: '实验室', to: '/lab' } },
  { test: (n) => n.startsWith('Bookcase') && !n.startsWith('BK') && !n.startsWith('BS'), data: { id: 'bookcase', label: '书架', kind: 'flagship', blurb: '满墙书脊。', cta: '项目', to: '/projects' } },
  { test: (n) => n.includes('Desk_Papers'), data: { id: 'papers', label: '桌面文稿', kind: 'notes', blurb: '最近写的。', cta: '笔记', to: '/notes' } },
  { test: (n) => n.includes('Plant'), data: { id: 'plant', label: '绿植', kind: 'about', blurb: '关于我。', cta: '关于', to: '/about' } },
  { test: (n) => n.includes('Mug') || n.includes('CoffeeMug'), data: { id: 'mug', label: '茶杯', kind: 'easter', blurb: '「软件不是一次完成的作品…」' } },
  { test: (n) => n.startsWith('FloorLamp'), data: { id: 'floorlamp', label: '落地灯', kind: 'timeline', blurb: '角落的光。', cta: '时间线', to: '/timeline' } },
  { test: (n) => n.startsWith('WallClock'), data: { id: 'clock', label: '挂钟', kind: 'pulse', blurb: '最近仓库动态。' } },
  { test: (n) => n.startsWith('Armchair') || n.startsWith('OfficeChair'), data: { id: 'chair', label: '椅子', kind: 'contact', blurb: '坐下聊聊。', cta: '联系', to: '/contact' } },
  { test: (n) => n.startsWith('Desktop_') || n === 'Desk_Pad', data: { id: 'desk', label: '橡木书桌', kind: 'desk', blurb: '工作台面。' } },
  { test: (n) => n === 'Keyboard' || n.includes('Keyboard'), data: { id: 'keyboard', label: '键盘', kind: 'projects', blurb: '手感不错——适合敲项目。', cta: '打开项目', to: '/projects' } },
  { test: (n) => n.startsWith('Sill_Book') || n.startsWith('Sill_Plant'), data: { id: 'sill', label: '窗台', kind: 'notes', blurb: '窗边读一会儿。', cta: '笔记', to: '/notes' } },
  { test: (n) => n.includes('Window_Glass') || n === 'Window', data: { id: 'window', label: '窗', kind: 'contact', blurb: '窗外的光会随时间变化。有事写信。', cta: '联系', to: '/contact' } },
  { test: (n) => n.includes('Window') || n.includes('Curtain'), data: { id: 'curtain', label: '窗帘', kind: 'desk', blurb: '半掩的纱帘。' } },
]

function matchInteractive(name) {
  if (!name) return null
  for (const rule of INTERACTIVE) if (rule.test(name)) return { ...rule.data }
  return null
}

function bookDataFor(name) {
  if (!name) return null
  if (deskBookMap[name]) {
    const b = deskBookMap[name]
    const age = repoAgeDays(b.repo)
    const proj = b.projectSlug ? getProject(b.projectSlug) : null
    return {
      id: 'book:' + name,
      label: b.title,
      kind: 'book',
      blurb: b.blurb,
      cta: '翻开书',
      to: proj ? `/projects/${b.projectSlug}` : `/notes/${b.slug}`,
      noteSlug: b.slug,
      projectSlug: b.projectSlug || null,
      ageDays: age,
      dusty: age != null && age > DUST_DAYS,
      projectTitle: proj?.title || null,
      projectSubtitle: proj?.subtitle || null,
    }
  }
  if (sideBook && name === sideBook.mesh) {
    return {
      id: 'book:' + name,
      label: sideBook.title,
      kind: 'book',
      blurb: sideBook.blurb,
      cta: '翻开书',
      to: `/notes/${sideBook.slug}`,
      noteSlug: sideBook.slug,
      ageDays: null,
      dusty: false,
    }
  }
  if (name.startsWith('BK') || name.startsWith('BS')) {
    const idx = Math.abs(hashCode(name)) % shelfNotes.length
    const n = shelfNotes[idx]
    const age = repoAgeDays(n.repo)
    return {
      id: 'book:' + name,
      label: n.title,
      kind: 'book',
      blurb: `书架：${n.title}`,
      cta: '翻开书',
      to: `/notes/${n.slug}`,
      noteSlug: n.slug,
      ageDays: age,
      dusty: age != null && age > DUST_DAYS,
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
  const load = async (path) => {
    try {
      const t = await texLoader.loadAsync(`${base}models/study_room/art/${path}`)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      return t
    } catch {
      return null
    }
  }
  const [land, abstract, rug, plaster] = await Promise.all([
    load('art-landscape.webp'),
    load('art-abstract.webp'),
    load('rug-pattern.webp'),
    load('wall-plaster.webp'),
  ])
  const artTexes = [land, abstract].filter(Boolean)
  let ai = 0
  root.traverse((c) => {
    if (!c.isMesh) return
    const n = c.name || ''
    // 画芯 Canvas（不要贴到 Frame/Mat）
    if (/Canvas/i.test(n) && artTexes.length) {
      const t = artTexes[ai % artTexes.length]
      ai++
      c.material = new THREE.MeshStandardMaterial({ map: t, roughness: 0.9, metalness: 0 })
      return
    }
    if (n === 'Rug' && rug) {
      rug.wrapS = rug.wrapT = THREE.RepeatWrapping
      c.material = new THREE.MeshStandardMaterial({ map: rug, roughness: 0.96, metalness: 0 })
      return
    }
    // 墙：Wall_Left / Wall_Back_* 等
    if (/^Wall_(Left|Right|Back)/i.test(n) && plaster) {
      plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping
      plaster.repeat.set(4, 2)
      c.material = new THREE.MeshStandardMaterial({
        map: plaster,
        color: 0xf3ebe0,
        roughness: 0.97,
        metalness: 0,
      })
    }
  })
}

/** 拨动模型自带钟针 */
function setupClockAndWindow(root) {
  const named = findByName(root, [
    'WallClock_Hand_Hour',
    'WallClock_Hand_Minute',
    'Window_Glass',
    'CoffeeMug',
  ])
  windowGlass = named.Window_Glass || null
  clockHands = {
    hour: named.WallClock_Hand_Hour || null,
    min: named.WallClock_Hand_Minute || null,
    group: null,
  }
}

function tagClickable(obj) {
  obj.traverse((child) => {
    if (!child.isMesh) return
    // 性能：小物件不投影
    child.castShadow = false
    child.receiveShadow = false
    const book = bookDataFor(child.name) || bookDataFor(child.parent?.name)
    const data = book || matchInteractive(child.name) || matchInteractive(child.parent?.name)
    if (!data) return
    child.userData = { ...child.userData, interactive: true, ...data, meshName: child.name }
    clickables.push(child)
    if (data.kind === 'book') {
      applyDust(child, data.ageDays)
      child.userData._home = { y: child.position.y, x: child.rotation.x, z: child.rotation.z }
    }
  })
  // 地板接影即可
  const floor = obj.getObjectByName('Floor') || obj.children.find((c) => c.isMesh && c.geometry?.type === 'PlaneGeometry')
  if (floor) floor.receiveShadow = true
}

/** 选中书：只发光高亮，不改姿态（避免原点偏移导致的变形） */
function openBook(mesh) {
  closeAllBooks()
  if (!mesh) return
  openBooks.set(mesh.userData.id, { mesh, t: 1 })
  if (mesh.material?.emissive) {
    mesh.material.emissive.setHex(0x3a2818)
    mesh.material.emissiveIntensity = 0.4
  }
  if (!bookGlow) {
    bookGlow = new THREE.PointLight(0xffc890, 0, 1.0, 2)
    scene.add(bookGlow)
  }
  const wp = new THREE.Vector3()
  mesh.getWorldPosition(wp)
  bookGlow.position.copy(wp).add(new THREE.Vector3(0, 0.1, 0.04))
  bookGlow.intensity = 0.9
}

function closeAllBooks() {
  for (const [, st] of openBooks) {
    if (st.mesh.material?.emissive) {
      st.mesh.material.emissive.setHex(0x000000)
      st.mesh.material.emissiveIntensity = 0
    }
  }
  openBooks.clear()
  if (bookGlow) bookGlow.intensity = 0
}

function setHoverMesh(mesh) {
  if (hoverMesh === mesh) return
  // 还原上一个
  if (hoverMesh?.material?.emissive) {
    const base = hoverBase.get(hoverMesh)
    if (base) {
      hoverMesh.material.emissive.copy(base.emissive)
      hoverMesh.material.emissiveIntensity = base.intensity
    }
  }
  hoverMesh = mesh
  if (!mesh?.material?.emissive) return
  if (!hoverBase.has(mesh)) {
    hoverBase.set(mesh, {
      emissive: mesh.material.emissive.clone(),
      intensity: mesh.material.emissiveIntensity ?? 0,
    })
  }
  // 书类暖高亮，其它物件淡高亮
  const isBook = mesh.userData?.kind === 'book'
  mesh.material.emissive.setHex(isBook ? 0x4a3020 : 0x2a2018)
  mesh.material.emissiveIntensity = isBook ? 0.45 : 0.2
}

let lastRay = 0
let pendingMove = null

function doRaycast(clientX, clientY) {
  if (!renderer || !camera || !host.value) return
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  // 只测可点列表，且限距离
  raycaster.far = 8
  const hits = raycaster.intersectObjects(clickables, false)
  const hit = hits[0]?.object
  setHoverMesh(hit?.userData?.interactive ? hit : null)
  if (hit?.userData?.interactive) {
    host.value.style.cursor = 'pointer'
    emit('hover', hit.userData)
  } else {
    host.value.style.cursor = 'grab'
    emit('hover', null)
  }
}

function onPointerMove(e) {
  pendingMove = { x: e.clientX, y: e.clientY }
  const now = performance.now()
  if (now - lastRay < 48) return // ~20fps 节流
  lastRay = now
  doRaycast(e.clientX, e.clientY)
}

function onClick(e) {
  if (!renderer || !camera || !host.value) return
  doRaycast(e.clientX, e.clientY)
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(clickables, false)
  const hit = hits[0]?.object
  if (hit?.userData?.interactive) emit('select', { ...hit.userData })
}

function applyLamp(on) {
  if (deskLampLight) deskLampLight.intensity = on ? 2.4 : 0.25
  if (floorLampLight) floorLampLight.intensity = on ? 0.9 : 0.12
}

function applyMonitor(on) {
  if (!screenMesh?.material) return
  const m = screenMesh.material
  if (on) {
    m.emissive = new THREE.Color(0x1a3d2e)
    m.emissiveIntensity = 0.8
    m.color = new THREE.Color(0x0d1512)
  } else {
    m.emissive = new THREE.Color(0x000000)
    m.emissiveIntensity = 0
    m.color = new THREE.Color(0x111111)
  }
}

function applyDrawer(open) {
  const z = open ? 0.1 : 0
  if (drawerUpper) drawerUpper.position.z = (drawerUpper.userData._z0 ?? 0) + z
  if (drawerLower) drawerLower.position.z = (drawerLower.userData._z0 ?? 0) + z * 0.65
}

function animate() {
  frame = requestAnimationFrame(animate)
  const t = clock.elapsedTime
  controls?.update()
  tickDust(t)
  tickClock()
  tickWindowLight()
  if (pendingMove) {
    const now = performance.now()
    if (now - lastRay >= 48) {
      lastRay = now
      doRaycast(pendingMove.x, pendingMove.y)
      pendingMove = null
    }
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

function findByName(root, names) {
  const found = {}
  root.traverse((c) => {
    for (const n of names) {
      if (c.name === n || c.name.startsWith(n)) found[n] = found[n] || c
    }
  })
  return found
}

/** 浮尘粒子：光束里的微尘，极轻 */
function addDust() {
  const count = 180
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = -1.5 + Math.random() * 3.2
    pos[i * 3 + 1] = 0.3 + Math.random() * 2.0
    pos[i * 3 + 2] = -2.4 + Math.random() * 3.5
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    color: 0xffe0b0,
    size: 0.012,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    sizeAttenuation: true,
  })
  dustPoints = new THREE.Points(geo, mat)
  scene.add(dustPoints)
}

function tickDust(t) {
  if (!dustPoints) return
  const arr = dustPoints.geometry.attributes.position.array
  for (let i = 0; i < arr.length; i += 3) {
    arr[i + 1] += Math.sin(t * 0.4 + i) * 0.00025
    arr[i] += Math.cos(t * 0.25 + i * 0.1) * 0.00015
    if (arr[i + 1] > 2.4) arr[i + 1] = 0.3
  }
  dustPoints.geometry.attributes.position.needsUpdate = true
}

function tickClock() {
  if (!clockHands) return
  const d = new Date()
  const m = d.getMinutes() + d.getSeconds() / 60
  const h = (d.getHours() % 12) + m / 60
  // 模型自带指针：绕自身轴旋转（先存初始值）
  if (clockHands.min) {
    if (clockHands.min.userData._r0 == null) clockHands.min.userData._r0 = clockHands.min.rotation.clone()
    const r0 = clockHands.min.userData._r0
    clockHands.min.rotation.set(r0.x, r0.y, r0.z - (m * Math.PI * 2) / 60)
  }
  if (clockHands.hour) {
    if (clockHands.hour.userData._r0 == null) clockHands.hour.userData._r0 = clockHands.hour.rotation.clone()
    const r0 = clockHands.hour.userData._r0
    clockHands.hour.rotation.set(r0.x, r0.y, r0.z - (h * Math.PI * 2) / 12)
  }
}

function tickWindowLight() {
  if (!windowGlass?.material) return
  const hr = new Date().getHours() + new Date().getMinutes() / 60
  // 白天偏亮蓝，黄昏偏暖，夜里偏深蓝
  let col, em
  if (hr >= 7 && hr < 17) {
    col = 0x9ec0d8
    em = 0.35
  } else if (hr >= 17 && hr < 20) {
    col = 0xd8a878
    em = 0.45
  } else {
    col = 0x2a3848
    em = 0.12
  }
  if (windowGlass.material.color) windowGlass.material.color.setHex(col)
  if (windowGlass.material.emissive) {
    windowGlass.material.emissive.setHex(col)
    windowGlass.material.emissiveIntensity = em
  }
  if (sunLight) {
    const day = hr >= 7 && hr < 18
    sunLight.intensity = day ? 0.95 : 0.35
    sunLight.color.setHex(hr >= 17 && hr < 20 ? 0xffc090 : day ? 0xffd8b0 : 0x8090b0)
  }
}

onMounted(async () => {
  const el = host.value
  if (!el) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2a2218)

  camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.08, 30)
  camera.position.set(2.4, 1.7, 2.6)

  renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  renderer.shadowMap.enabled = false // 关阴影，显著降卡顿
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.22
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.appendChild(renderer.domElement)

  pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 1.8
  controls.maxDistance = 5.5
  controls.minPolarAngle = 0.7
  controls.maxPolarAngle = 1.42
  controls.minAzimuthAngle = -1.0
  controls.maxAzimuthAngle = 1.0
  controls.target.set(0, 0.85, -0.5)
  controls.enablePan = false
  controls.rotateSpeed = 0.65
  controls.zoomSpeed = 0.7

  scene.add(new THREE.AmbientLight(0xffe8d4, 0.48))
  scene.add(new THREE.HemisphereLight(0xb8c8d8, 0x3a2a18, 0.4))
  const sun = new THREE.DirectionalLight(0xffd8b0, 1.15)
  sun.position.set(3, 4.5, 2)
  sunLight = sun
  scene.add(sun)
  const fill = new THREE.DirectionalLight(0x88a8c8, 0.4)
  fill.position.set(-3.5, 2.2, 1.5)
  scene.add(fill)
  // 暖顶光，让桌面更亮
  const top = new THREE.PointLight(0xffe0b8, 0.55, 6, 2)
  top.position.set(0, 3.2, -0.5)
  scene.add(top)

  deskLampLight = new THREE.PointLight(0xffc078, 2.2, 2.8, 2)
  deskLampLight.position.set(0.55, 1.25, -2.0)
  scene.add(deskLampLight)

  floorLampLight = new THREE.PointLight(0xffd0a0, 0.8, 3.5, 2)
  floorLampLight.position.set(1.7, 1.3, 1.2)
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
    // 材质：关阴影相关，统一 roughness 上限
    modelRoot.traverse((c) => {
      if (!c.isMesh) return
      c.castShadow = false
      c.receiveShadow = false
      if (c.material && 'envMapIntensity' in c.material) c.material.envMapIntensity = 0.55
    })
    scene.add(modelRoot)
    tagClickable(modelRoot)
    await decorateArt(modelRoot, base)
    addDust()
    setupClockAndWindow(modelRoot)

    const named = findByName(modelRoot, ['Monitor_Screen', 'Desk_Drawer_Upper', 'Desk_Drawer_Lower', 'DeskLamp'])
    screenMesh = named.Monitor_Screen || null
    drawerUpper = named.Desk_Drawer_Upper || null
    drawerLower = named.Desk_Drawer_Lower || null
    if (drawerUpper) drawerUpper.userData._z0 = drawerUpper.position.z
    if (drawerLower) drawerLower.userData._z0 = drawerLower.position.z
    if (named.DeskLamp) {
      const p = new THREE.Vector3()
      named.DeskLamp.getWorldPosition(p)
      deskLampLight.position.set(p.x, p.y + 0.3, p.z)
    }

    applyLamp(props.lampOn)
    applyMonitor(props.monitorOn)
    applyDrawer(props.drawerOpen)
    ready.value = true
    emit('ready')
  } catch (err) {
    console.error('[RoomStage3D] load failed', err)
  }

  el.addEventListener('pointermove', onPointerMove, { passive: true })
  el.addEventListener('click', onClick)
  window.addEventListener('resize', resize)
  animate()
})

watch(() => props.lampOn, (v) => applyLamp(v))
watch(() => props.monitorOn, (v) => applyMonitor(v))
watch(() => props.drawerOpen, (v) => applyDrawer(v))
watch(
  () => props.openBookId,
  (id) => {
    if (!id) {
      closeAllBooks()
      return
    }
    const hit = clickables.find((c) => c.userData?.id === id)
    if (hit) openBook(hit)
  }
)

watch(
  () => props.focusId,
  (id) => {
    if (!id) return
    const hit = clickables.find((c) => c.userData?.id === id)
    if (hit) openBook(hit)
  }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  closeAllBooks()
  window.removeEventListener('resize', resize)
  if (host.value) {
    host.value.removeEventListener('pointermove', onPointerMove)
    host.value.removeEventListener('click', onClick)
  }
  controls?.dispose()
  pmrem?.dispose()
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
  transition: opacity 0.5s var(--ease-standard);
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
}
.room3d :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
