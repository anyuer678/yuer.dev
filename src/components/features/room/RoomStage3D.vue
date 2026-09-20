<script setup>
// RoomStage3D —— GLB 书房：性能优先（限 DPR、节流射线、轻量开书）
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import roomBooks from '@/content/room-books.json'
import { githubData, getProject, projects } from '@/utils/content.js'

const props = defineProps({
  lampOn: { type: Boolean, default: true },
  monitorOn: { type: Boolean, default: false },
  drawerOpen: { type: Boolean, default: false },
  openBookId: { type: String, default: '' },
  focusId: { type: String, default: '' },
})
const emit = defineEmits(['select', 'hover', 'ready', 'shelfmap', 'viewchange', 'failed', 'clock'])

const host = ref(null)
const ready = ref(false)
const loadPct = ref(0)
const failed = ref(false)
// 本地时段（窗外/光照）；给 HUD 显示
const clockLabel = ref('')

let renderer, scene, camera, controls, raycaster, pointer
let frame = 0
let modelRoot = null
let deskLampLight, floorLampLight, screenMesh, drawerUpper, drawerLower
let pmrem = null
let dustPoints = null
let clockHands = null
let windowGlass = null
let sunLight = null
let ceilingMesh = null
let skyMat = null
const clickables = []
// 场景时钟。原本用 THREE.Clock，R186 起它已废弃（控制台会打一条 deprecation），
// 而这里只需要"累加式秒数 + 可暂停"两件事，自己维护反而更直白：
// hidden 期间不累加，浮尘/钟针就不会在切回标签页时瞬移。
let elapsed = 0
let elapsedAt = 0
let elapsedRunning = true

function tickElapsed() {
  const now = performance.now()
  if (!elapsedAt) {
    elapsedAt = now
    return elapsed
  }
  if (elapsedRunning) elapsed += (now - elapsedAt) / 1000
  elapsedAt = now
  return elapsed
}

// 阴影贴图按需重算：房间几何是静态的，只有抽屉这类物件位移会改变遮挡关系
function markShadowDirty() {
  if (renderer) renderer.shadowMap.needsUpdate = true
}

const openBooks = new Map()
const DUST_DAYS = 45
let bookGlow = null
let hoverMesh = null
const hoverBase = new WeakMap()

const deskBookMap = Object.fromEntries((roomBooks.deskBooks || []).map((b) => [b.mesh, b]))
const sideBook = roomBooks.sideBook
const shelfNotes = roomBooks.shelfNotes || []

// ── 排架映射 ──────────────────────────────────────────────────────────────
// 书架上 101 本（BK_001..BK_101）的命名顺序本身就是排架顺序：先上层后下层、
// 每层从左到右（已逐本比对过 GLB 里的坐标）。所以不必另存一张索引表，直接把
// 101 本按序号均分成 18 段、每段对应一篇笔记 —— 18 个书名于是均匀铺满整面
// 书架。段内居中那一本刻上书名（锚点）；同段其它书翻开仍是同一篇笔记，
// 「书架上每一本都能点开」这条既有行为保持不变。
const SHELF_RE = /^(BK_|BS_)/
let shelfOrder = []        // 排架后的书名数组，长度 = 书架书本总数
let shelfAnchorList = []   // 锚点：{ mesh, slot, slug, title, repo }
let spineLabels = null     // 18 个书脊标签合并成的单个 mesh（1 draw call）

function shelfSortKey(name) {
  const m = /(\d+)/.exec(name)
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER
}

function buildShelfMap(root) {
  const names = []
  root.traverse((c) => {
    if (c.isMesh && SHELF_RE.test(c.name) && !names.includes(c.name)) names.push(c.name)
  })
  names.sort((a, b) => shelfSortKey(a) - shelfSortKey(b))
  shelfOrder = names

  const slots = shelfNotes.length
  const total = names.length
  shelfAnchorList = []
  if (!total || !slots) return
  for (let k = 0; k < slots; k++) {
    const lo = Math.ceil((k * total) / slots)
    const hi = Math.ceil(((k + 1) * total) / slots) - 1
    const mid = Math.round(((k + 0.5) * total) / slots)
    const note = shelfNotes[k]
    shelfAnchorList.push({
      mesh: names[Math.min(hi, Math.max(lo, mid))],
      slot: k,
      slug: note.slug,
      title: note.title,
      repo: note.repo || null,
    })
  }
}

function shelfSlotOf(name) {
  if (!shelfOrder.length || !shelfNotes.length) return -1
  const i = shelfOrder.indexOf(name)
  if (i < 0) return -1
  const slots = shelfNotes.length
  return Math.min(slots - 1, Math.floor((i * slots) / shelfOrder.length))
}

function daysSince(iso) {
  if (!iso) return 999
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function repoAgeDays(repo) {
  if (!repo) return null
  const r = githubData.repos?.[repo]
  return r?.pushed_at ? daysSince(r.pushed_at) : null
}

/** 书 → 项目档案（slug / 仓名 / github 尾段） */
function projectForBook(projectSlug, repo) {
  if (projectSlug) {
    const p = getProject(projectSlug)
    if (p) return p
  }
  if (!repo) return null
  return (
    getProject(repo) ||
    projects.find((p) => p.slug === repo || (p.github || '').includes(`/${repo}`)) ||
    null
  )
}

/**
 * 书皮状态：
 * - 长时间未推送 → 褪色蒙尘（去饱和、发灰、变哑）
 * - 完工项目 → 暖金精装感（偏金、更干净、微金属）；极旧时金调仍在但罩尘
 * 材质务必先 clone（见 tagClickable），避免同材质百书一起变色。
 */
function applyBookFinish(mesh, data) {
  if (!mesh?.material?.color) return
  const age = data?.ageDays
  const status = data?.projectStatus
  const completed = status === 'completed'
  const archived = status === 'archived'

  let dust = 0
  if (age != null && age > DUST_DAYS) {
    dust = Math.min(1, (age - DUST_DAYS) / 90)
  }
  if (archived) dust = Math.max(dust, 0.4)

  const m = mesh.material
  const hsl = {}
  m.color.getHSL(hsl)

  if (completed) {
    // 完工：暖金书脊，像合上并归档的精装本
    const gold = new THREE.Color().setHSL(0.11, 0.42, 0.48)
    m.color.lerp(gold, 0.55 - dust * 0.25)
    if (m.emissive) m.emissive.setRGB(0.035 * (1 - dust), 0.028 * (1 - dust), 0.01)
    m.roughness = Math.max(0.28, (m.roughness ?? 0.75) - 0.22 + dust * 0.3)
    if (m.metalness != null) m.metalness = Math.min(0.42, m.metalness + 0.18 - dust * 0.2)
  } else if (status === 'development') {
    // 在写：略偏暖、保持纸感，不蒙尘（除非仓库真旧）
    if (m.emissive) m.emissive.setRGB(0.012, 0.008, 0.004)
  }

  if (dust > 0) {
    m.color.getHSL(hsl)
    m.color.setHSL(
      hsl.h,
      hsl.s * (1 - dust * 0.72),
      Math.min(0.86, hsl.l + dust * 0.24)
    )
    m.roughness = Math.min(1, (m.roughness ?? 0.8) + dust * 0.22)
    if (m.metalness != null) m.metalness *= 1 - dust * 0.65
    if (m.emissive) m.emissive.multiplyScalar(Math.max(0.15, 1 - dust))
  }

  mesh.userData.bookDust = dust
  mesh.userData.bookCompleted = completed
}

function bookMeta(projectSlug, repo) {
  const proj = projectForBook(projectSlug, repo)
  const age = repoAgeDays(repo || proj?.slug)
  const status = proj?.status || null
  return {
    ageDays: age,
    projectStatus: status,
    completed: status === 'completed',
    dusty: age != null && age > DUST_DAYS,
    projectSlug: projectSlug || proj?.slug || null,
  }
}

function bookDataFor(name) {
  if (!name) return null
  if (deskBookMap[name]) {
    const b = deskBookMap[name]
    const meta = bookMeta(b.projectSlug, b.repo)
    const proj = projectForBook(b.projectSlug, b.repo)
    return {
      id: 'book:' + name,
      label: b.title,
      kind: 'book',
      blurb: b.blurb,
      cta: '翻开书',
      to: proj ? `/projects/${b.projectSlug || proj.slug}` : `/notes/${b.slug}`,
      noteSlug: b.slug,
      projectTitle: proj?.title || null,
      projectSubtitle: proj?.subtitle || null,
      storyTo: b.projectSlug ? `/stories/${b.projectSlug}` : null,
      ...meta,
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
      completed: false,
      projectStatus: null,
    }
  }
  if (SHELF_RE.test(name)) {
    const n = shelfNotes[shelfSlotOf(name)]
    if (!n) return null
    const meta = bookMeta(null, n.repo)
    return {
      id: 'book:' + name,
      label: n.title,
      kind: 'book',
      blurb: `书架 · ${n.title}`,
      cta: '翻开书',
      to: `/notes/${n.slug}`,
      noteSlug: n.slug,
      ...meta,
    }
  }
  return null
}

const INTERACTIVE = [
  { test: (n) => n === 'Laptop_Screen' || /^Laptop_(Lid|Base|Hinge|Trackpad|Webcam|Feet)/.test(n), data: { id: 'monitor', label: '笔记本电脑', kind: 'projects', blurb: '屏幕亮起：项目列表。', cta: '打开项目', to: '/projects' } },
  { test: (n) => n.startsWith('Desk_OpenBook'), data: { id: 'openbook', label: '摊开的笔记', kind: 'notes', blurb: '正在写的东西。', cta: '笔记', to: '/notes' } },
  { test: (n) => n.startsWith('Bulletin_Board'), data: { id: 'bulletin', label: '便签墙', kind: 'notes', blurb: '随手记下的想法。', cta: '笔记', to: '/notes' } },
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
  { test: (n) => n === 'Keyboard' || n.includes('Keyboard'), data: { id: 'keyboard', label: '键盘', kind: 'projects', blurb: '纸面终端：工具墙。', cta: '工作台', to: '/bench' } },
  { test: (n) => n.startsWith('Sill_Book') || n.startsWith('Sill_Plant'), data: { id: 'sill', label: '窗台', kind: 'notes', blurb: '窗边读一会儿。', cta: '笔记', to: '/notes' } },
  { test: (n) => n.includes('Window_Glass') || n === 'Window', data: { id: 'window', label: '窗', kind: 'contact', blurb: '窗外是花庭。', cta: '回花庭', to: '/garden' } },
  { test: (n) => n.includes('Window') || n.includes('Curtain'), data: { id: 'curtain', label: '窗帘', kind: 'desk', blurb: '半掩的纱帘。' } },
]

function matchInteractive(name) {
  if (!name) return null
  for (const rule of INTERACTIVE) if (rule.test(name)) return { ...rule.data }
  return null
}

async function decorateArt(root, base) {
  const texLoader = new THREE.TextureLoader()
  const load = async (path) => {
    try {
      const t = await texLoader.loadAsync(`${base}models/study_room/art/${path}`)
      t.colorSpace = THREE.SRGBColorSpace
      // 斜视角下地板 / 地毯的纹理会糊成一片，各向异性过滤几乎零成本
      t.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() ?? 4)
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
  // 几何带 COLOR_0（烘焙 AO），换材质时必须保留顶点色，否则墙面/地毯会失去接触阴影
  const withAO = (geo) => !!geo?.attributes?.color
  let ai = 0
  root.traverse((c) => {
    if (!c.isMesh) return
    const n = c.name || ''
    // 画芯 Canvas（不要贴到 Frame/Mat）
    if (/Canvas/i.test(n) && artTexes.length) {
      const t = artTexes[ai % artTexes.length]
      ai++
      c.material = new THREE.MeshStandardMaterial({
        map: t, roughness: 0.9, metalness: 0, vertexColors: withAO(c.geometry),
      })
      return
    }
    if (n === 'Rug' && rug) {
      rug.wrapS = rug.wrapT = THREE.RepeatWrapping
      c.material = new THREE.MeshStandardMaterial({
        map: rug, roughness: 0.96, metalness: 0, vertexColors: withAO(c.geometry),
      })
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
        vertexColors: withAO(c.geometry),
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
    // 光照已烘焙，不再需要小物件投影的取舍逻辑
    child.castShadow = false
    child.receiveShadow = false
    const book = bookDataFor(child.name) || bookDataFor(child.parent?.name)
    const data = book || matchInteractive(child.name) || matchInteractive(child.parent?.name)
    if (!data) return
    child.userData = { ...child.userData, interactive: true, ...data, meshName: child.name }
    clickables.push(child)
    if (data.kind === 'book') {
      // 101 本书一共只用 2 个材质（pages / gold）。不克隆的话，"选中发光"和
      // "蒙尘"会同时作用在同材质的上百本书上 —— 亮成一片，等于没高亮，
      // 而"我怎么知道点的是哪一本"正是这一页最大的问题。
      if (child.material) {
        child.material = child.material.clone()
        child.material.name = `${child.material.name || 'book'}@${child.name}`
      }
      applyBookFinish(child, data)
      child.userData._home = { y: child.position.y, x: child.rotation.x, z: child.rotation.z }
    }
  })
  // 地板接影即可
  const floor = obj.getObjectByName('Floor') || obj.children.find((c) => c.isMesh && c.geometry?.type === 'PlaneGeometry')
  if (floor) floor.receiveShadow = true
}

/** 阴影分配：几何已按材质合并，所以投影开销很小。
 *  - Batch_Static / 墙 / 地板 / 桌面：投影 + 接影
 *  - 大家具（书架、椅子、灯、画框等）：投影
 *  - 书（BK_/BS_）不投影：它们在层板里，收益小、数量大
 *  想再省性能就把 CAST_RE 收紧，或把 sun.shadow.mapSize 降到 1024。 */
const CAST_RE = /^(Batch_Static|Wall_|Bookcase|Desk|DeskLamp|FloorLamp|Armchair|OfficeChair|CornerPlant|Picture_|Window_Frame|SideTable|Bulletin_Board|Stool)/
const RECV_RE = /^(Batch_Static|Floor|Rug|Wall_|Desktop_|Desk$|Bookcase|Window_Sill)/
function applyShadows(obj) {
  obj.traverse((c) => {
    if (!c.isMesh) return
    const n = c.name || ''
    if (/^(BK_|BS_)/.test(n)) return
    if (RECV_RE.test(n)) c.receiveShadow = true
    if (CAST_RE.test(n)) c.castShadow = true
  })
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

// ── 书脊刻名 ──────────────────────────────────────────────────────────────
// 先摆事实：书脊只有 1.7cm 宽，默认机位下在屏上不到 10px，最近距离也就 20px 上下。
// 所以刻字是"凑近才有"的锦上添花，真正保证任意距离都能认书的是 hover 纸签。
// 18 个标签画进同一张图集、合并成一个 mesh —— 只多 1 个 draw call。
const LABEL_COLS = 6
const LABEL_W = 96
const LABEL_H = 384

function buildSpineLabels(root) {
  const anchors = shelfAnchorList.filter((a) => root.getObjectByName(a.mesh))
  if (!anchors.length) return null
  root.updateMatrixWorld(true)

  const cols = LABEL_COLS
  const rows = Math.ceil(anchors.length / cols)
  const canvas = document.createElement('canvas')
  canvas.width = cols * LABEL_W
  canvas.height = rows * LABEL_H
  const g = canvas.getContext('2d')

  anchors.forEach((a, k) => {
    const ox = (k % cols) * LABEL_W
    const oy = Math.floor(k / cols) * LABEL_H
    // 签纸：米白底 + 一道细墨线，四周留出书脊本色，像贴上去的一枚小标签
    g.fillStyle = '#efe4cf'
    g.fillRect(ox + 2, oy + 2, LABEL_W - 4, LABEL_H - 4)
    g.strokeStyle = 'rgba(84, 58, 36, 0.45)'
    g.lineWidth = 2
    g.strokeRect(ox + 7, oy + 7, LABEL_W - 14, LABEL_H - 14)
    // 竖排书名：中文书脊本来就这么排，正好吃掉"窄而高"这个形状
    const chars = [...String(a.title)]
    const room = LABEL_H - 48
    const size = Math.max(9, Math.min(LABEL_W * 0.6, room / Math.max(1, chars.length)))
    g.font = `600 ${size.toFixed(1)}px "Songti SC", "Noto Serif SC", serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#3a2919'
    let y = oy + LABEL_H / 2 - (chars.length * size) / 2 + size / 2
    for (const ch of chars) {
      g.fillText(ch, ox + LABEL_W / 2, y)
      y += size
    }
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() ?? 4)

  const pos = []
  const nor = []
  const uvs = []
  const index = []
  const spin = new THREE.Quaternion()
  const nrm = new THREE.Vector3()
  let vbase = 0

  for (let k = 0; k < anchors.length; k++) {
    const mesh = root.getObjectByName(anchors[k].mesh)
    if (!mesh?.isMesh || !mesh.geometry) continue
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
    const bb = mesh.geometry.boundingBox
    // 书脊面 = 朝向房间的那一面（法线 +X）。PlaneGeometry 默认立在 XY 平面、
    // 法线 +Z，绕 Y 转 90° 后法线指 +X，宽度正好落到 Z 轴（即书脊厚度）。
    const quad = new THREE.PlaneGeometry((bb.max.z - bb.min.z) * 0.84, (bb.max.y - bb.min.y) * 0.9)
    quad.applyQuaternion(spin.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)))
    quad.translate(
      bb.max.x + 0.0015,                      // 抬 1.5mm 贴到书脊面上，避开 z-fighting
      (bb.min.y + bb.max.y) / 2,
      (bb.min.z + bb.max.z) / 2
    )
    quad.applyMatrix4(mesh.matrixWorld)
    mesh.getWorldQuaternion(spin)
    nrm.set(1, 0, 0).applyQuaternion(spin)

    const u0 = (k % cols) / cols
    const v1 = 1 - Math.floor(k / cols) / rows
    const p = quad.attributes.position
    const q = quad.attributes.uv
    for (let i = 0; i < 4; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i))
      nor.push(nrm.x, nrm.y, nrm.z)
      uvs.push(u0 + q.getX(i) / cols, v1 - (1 - q.getY(i)) / rows)
    }
    // 绕序必须沿用 PlaneGeometry 自己的（0,2,1 / 2,3,1）。按 0,1,2 拼会把正面
    // 翻成背面，FrontSide 一剔除就一个像素都画不出来 —— 几何、贴图、法线全对也白搭。
    for (let t = 0; t < 6; t++) index.push(vbase + quad.index.getX(t))
    vbase += 4
    quad.dispose()
  }

  if (!pos.length) {
    tex.dispose()
    return null
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(index)
  const labels = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.88,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  }))
  labels.name = 'Shelf_SpineLabels'
  return labels
}

/** 世界坐标 → 视口像素。UI 侧靠它把纸签钉在物件旁边 */
function projectToScreen(p) {
  const el = host.value
  if (!el) return null
  const rect = el.getBoundingClientRect()
  const v = p.clone().project(camera)
  return {
    x: rect.left + ((v.x + 1) / 2) * rect.width,
    y: rect.top + ((1 - v.y) / 2) * rect.height,
  }
}

let lastRay = 0
let pendingMove = null
let dragging = false          // 指针按下 → 抬起之间都在转镜头/缩放，不是"指着某个东西"
let lastPointerType = 'mouse' // click 事件拿不到可靠的 pointerType，靠 pointerdown 记住

function doRaycast(clientX, clientY, transient = false) {
  if (!renderer || !camera || !host.value) return
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  // 只测可点列表，且限距离
  raycaster.far = 8
  const hits = raycaster.intersectObjects(clickables, false)
  const first = hits[0]
  const hit = first?.object
  setHoverMesh(hit?.userData?.interactive ? hit : null)
  if (hit?.userData?.interactive) {
    host.value.style.cursor = 'pointer'
    // 一并送出命中点的屏幕坐标：书脊刻字远看读不到，UI 侧靠它把书名纸签贴到书旁边。
    // transient = 这一次是"点了一下"而非"鼠标停在这儿"，触屏没有移开动作，UI 侧要定
    // 时收掉，否则纸签会永久留在屏上。
    emit('hover', { ...hit.userData, at: projectToScreen(first.point), transient })
  } else {
    host.value.style.cursor = 'grab'
    emit('hover', null)
  }
}

function onWheel() {
  // 滚轮缩放不触发 pointermove，浮签会停在旧位置指错东西 —— 缩放时直接收掉
  emit('hover', null)
}

function onPointerDown(e) {
  lastPointerType = e.pointerType || 'mouse'
  dragging = true
  pendingMove = null
  // 按下去接下来就是转镜头了，先把上一枚纸签收掉
  emit('hover', null)
}

function onPointerEnd(e) {
  if (e?.pointerType) lastPointerType = e.pointerType
  dragging = false
}

function onPointerMove(e) {
  touchActive()
  // 触屏上没有 hover 这回事：手指在屏上滑就是在转镜头；按住拖动同理。
  // 若照鼠标那样一路 raycast，转一次视角就会把沿途物件全标成"已看"
  //（悬停即已看的语义），纸签还会跟着乱闪。触摸这条路径只认「轻点」，由 onClick 负责。
  // 注意 pendingMove 也要清掉 —— 动画循环后面还会拿它补一次延迟判定，
  // 只 return 不清理的话，拖动照样会一路判定。
  if (e.pointerType === 'touch' || dragging) {
    pendingMove = null
    return
  }
  pendingMove = { x: e.clientX, y: e.clientY }
  const now = performance.now()
  if (now - lastRay < 48) return // ~20fps 节流
  lastRay = now
  doRaycast(e.clientX, e.clientY)
}

function onClick(e) {
  if (!renderer || !camera || !host.value) return
  // 触摸轻点没有"移开"这一步，所以纸签要标成 transient 交给 UI 定时收
  doRaycast(e.clientX, e.clientY, lastPointerType === 'touch')
  const rect = host.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(clickables, false)
  const hit = hits[0]?.object
  if (hit?.userData?.interactive) emit('select', { ...hit.userData })
}

function applyLamp(on) {
  // 参照参考图：暖色台灯是室内主光，所以开灯时给得足、关灯时留一点余光
  if (deskLampLight) deskLampLight.intensity = on ? 3.4 : 0.30
  if (floorLampLight) floorLampLight.intensity = on ? 1.35 : 0.16
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
  markShadowDirty()   // 抽屉位置变了，遮挡关系跟着变，重算一次阴影贴图
}

// 相机静止一小段时间后降到约 30fps：房间是静态的，持续满帧空转只是白烧 GPU。
// 任何交互（拖动 / 缩放 / 指针移动）都会立刻回到满帧。
// 用时间差而不是「隔帧」—— 隔帧在高刷屏上会退化成 60/120fps，时间基才稳定。
const IDLE_MS = 1200
const IDLE_MIN_MS = 1000 / 30
let lastActive = 0
let lastDraw = 0

function touchActive() {
  lastActive = performance.now()
}

// 页面切到后台就彻底停掉渲染循环，回来再续上（场景时钟同步暂停，浮尘不会瞬移）
function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(frame)
    frame = 0
    elapsedRunning = false
  } else if (!frame) {
    // 补掉 hidden 这段空档，否则回来第一帧会把整段后台时长算进场景时钟
    elapsedAt = performance.now()
    elapsedRunning = true
    touchActive()
    animate()
  }
}

// ── 镜头导航 ──────────────────────────────────────────────────────────────
// 先摆事实：默认机位离书架 3.2m，一块书脊标签在屏上只有 8~17px 宽 —— 刻了字
// 也读不出来。所以补一个"走近"的动作：从索引点书架条目会把镜头送到那本书前，
// 落位后把 OrbitControls 的取景范围放宽到"贴着书架看"；走远时再收回房间限位。
// 受限位约束，相机绕的是房间中心，光靠滚轮永远靠不到书架前面，这一步必须显式做。
const ROOM_LIMITS = { min: 1.8, max: 5.5, az: [-1.0, 1.0], pol: [0.7, 1.42] }
const SHELF_LIMITS = { min: 0.3, max: 2.6, az: [0.8, 2.3], pol: [0.9, 1.55] }
let camTween = null
let shelfView = false

function applyLimits(l) {
  if (!controls) return
  controls.minDistance = l.min
  controls.maxDistance = l.max
  controls.minAzimuthAngle = l.az[0]
  controls.maxAzimuthAngle = l.az[1]
  controls.minPolarAngle = l.pol[0]
  controls.maxPolarAngle = l.pol[1]
}

function flyTo(pos, target, limits, dur = 0.85) {
  if (!camera || !controls) return
  camTween = {
    p0: camera.position.clone(),
    t0: controls.target.clone(),
    p1: pos.clone(),
    t1: target.clone(),
    t0ms: performance.now(),
    dur: dur * 1000,
    limits,
  }
  controls.enabled = false
  emit('hover', null)    // 纸签钉的是屏幕坐标，镜头一动就过期
  touchActive()
}

function tickCamera() {
  if (!camTween) return
  const k = Math.min(1, (performance.now() - camTween.t0ms) / camTween.dur)
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
  camera.position.lerpVectors(camTween.p0, camTween.p1, e)
  controls.target.lerpVectors(camTween.t0, camTween.t1, e)
  camera.lookAt(controls.target)   // 缓动期间跳过 controls.update()，朝向得自己补
  if (k >= 1) {
    applyLimits(camTween.limits)
    const next = camTween.limits === SHELF_LIMITS
    camTween = null
    controls.enabled = true
    controls.update()
    if (next !== shelfView) {
      shelfView = next
      emit('viewchange', next ? 'shelf' : 'room')
    }
  }
  touchActive()
}

/** 站到这本书斜前方：书越高退得越远，保证整本进画 */
function focusBook(mesh) {
  const size = new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3())
  const ctr = mesh.getWorldPosition(new THREE.Vector3())
  const face = ctr.clone().add(new THREE.Vector3(size.x / 2, 0, 0))
  const d = Math.max(0.6, size.y * 2.8)
  flyTo(face.clone().add(new THREE.Vector3(d, size.y * 0.3, 0.04)), face, SHELF_LIMITS)
}

/** 书架全景：以 18 本锚点书撑出来的包围盒取景 */
function focusShelf() {
  if (!shelfAnchorList.length || !modelRoot) return
  const box = new THREE.Box3()
  const tmp = new THREE.Box3()
  for (const a of shelfAnchorList) {
    const m = modelRoot.getObjectByName(a.mesh)
    if (m) box.union(tmp.setFromObject(m))
  }
  if (box.isEmpty()) return
  const ctr = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const d = Math.max(1.5, size.z * 0.62)
  flyTo(new THREE.Vector3(ctr.x + d, ctr.y + size.y * 0.12, ctr.z + 0.1), ctr, SHELF_LIMITS, 1.0)
}

function backToRoom() {
  const pos = new THREE.Vector3(1.5, 1.55, 2.3)
  const tgt = new THREE.Vector3(0, 0.85, -0.5)
  if (host.value && host.value.clientWidth / host.value.clientHeight < 1.1) {
    pos.set(0.9, 1.72, 2.42)
    tgt.set(-0.15, 0.92, -0.95)
  }
  flyTo(pos, tgt, ROOM_LIMITS)
}

function animate() {
  frame = requestAnimationFrame(animate)
  const now = performance.now()

  if (now - lastActive > IDLE_MS && now - lastDraw < IDLE_MIN_MS) return
  lastDraw = now

  const t = tickElapsed()

  tickCamera()
  if (!camTween) controls?.update()   // 缓动期间不让限位把相机拽回去
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

// 拖动窗口时 resize 会高频触发，每次都 setSize 会反复重建绘制缓冲；
// 用一帧合并一次
let resizePending = 0

// 初始机位是按 16:9 调的 42° 垂直视角。竖屏时 aspect 掉到 0.46 左右，
// 水平视角会被压到 20° —— 房间宽度根本进不了画面，只剩桌子一角。
// 这里改成「锁定 16:9 下的水平视角」，由实际 aspect 反推垂直视角；
// 上限 66° 是防止大 FOV 在画面边缘产生明显畸变。
const BASE_FOV = 42
const BASE_ASPECT = 16 / 9
const MAX_FOV = 66

function fovForAspect(aspect) {
  const hTan = Math.tan((BASE_FOV * Math.PI) / 360) * BASE_ASPECT
  const vFov = (2 * Math.atan(hTan / aspect) * 180) / Math.PI
  return Math.min(Math.max(vFov, BASE_FOV), MAX_FOV)
}

function resize() {
  if (resizePending) return
  resizePending = requestAnimationFrame(() => {
    resizePending = 0
    if (!host.value || !renderer || !camera) return
    const w = host.value.clientWidth
    const h = host.value.clientHeight
    camera.aspect = w / h
    camera.fov = fovForAspect(camera.aspect)
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
    touchActive()
  })
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

/** 窗外远景：按本地时段参数程序化绘制天空 + 远山 */
function makeSkyTexture(st) {
  const s = st || dayState(12)
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 640
  const g = c.getContext('2d')
  const H = c.height
  const hz = H * 0.58
  const cols = s.skyCols || ['#c3cfd8', '#dfe0d6', '#f2e2c6']
  const grad = g.createLinearGradient(0, 0, 0, hz)
  grad.addColorStop(0, cols[0])
  grad.addColorStop(0.55, cols[1])
  grad.addColorStop(0.82, cols[2])
  grad.addColorStop(1, cols[2])
  g.fillStyle = grad
  g.fillRect(0, 0, c.width, hz + 2)
  // 夜空星点
  if ((s.stars || 0) > 0.02) {
    g.fillStyle = `rgba(255,250,230,${s.stars})`
    for (let i = 0; i < 60; i++) {
      const x = (i * 97) % c.width
      const y = (i * 53) % (hz * 0.85)
      g.fillRect(x, y, 1.5, 1.5)
    }
  }
  const ground = g.createLinearGradient(0, hz, 0, H)
  ground.addColorStop(0, s.ground)
  ground.addColorStop(1, s.ground)
  g.fillStyle = ground
  g.fillRect(0, hz, c.width, H - hz)
  for (let i = 0; i < 7; i++) {
    const y = hz * (0.16 + i * 0.09)
    g.fillStyle = `rgba(255,248,236,${Math.max(0.04, 0.14 - i * 0.012)})`
    g.beginPath()
    g.ellipse(c.width * (0.2 + (i * 0.23) % 0.7), y, c.width * 0.3, 9 + i * 1.6, 0, 0, Math.PI * 2)
    g.fill()
  }
  const night = (s.stars || 0) > 0.2
  const layers = [
    { y: 0.615, amp: 14, col: night ? 'rgba(40,48,68,0.7)' : 'rgba(186,192,184,0.55)', k: [1, 2.3, 4.7] },
    { y: 0.672, amp: 20, col: night ? 'rgba(28,36,52,0.8)' : 'rgba(150,160,142,0.65)', k: [0.7, 1.7, 3.9] },
    { y: 0.752, amp: 25, col: night ? 'rgba(16,22,36,0.9)' : 'rgba(112,124,98,0.8)', k: [0.5, 1.3, 2.7] },
  ]
  for (const L of layers) {
    const base = H * L.y
    g.fillStyle = L.col
    g.beginPath()
    g.moveTo(0, H)
    for (let x = 0; x <= c.width; x += 8) {
      const t = x / c.width * Math.PI * 2
      const h = Math.sin(t * L.k[0]) * L.amp + Math.sin(t * L.k[1] + 1.7) * L.amp * 0.5
        + Math.sin(t * L.k[2] + 3.1) * L.amp * 0.28
      g.lineTo(x, base + h)
    }
    g.lineTo(c.width, H)
    g.closePath()
    g.fill()
  }
  const haze = g.createLinearGradient(0, hz - 10, 0, hz + 110)
  haze.addColorStop(0, s.haze || 'rgba(255,247,232,0.82)')
  haze.addColorStop(0.45, s.haze || 'rgba(255,247,232,0.34)')
  haze.addColorStop(1, 'rgba(255,247,232,0)')
  g.fillStyle = haze
  g.fillRect(0, hz - 10, c.width, 120)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** 背景补空：模型顶部是敞开的、窗外也没有背景，
 *  抬头 / 看窗会看到一片深色空洞，这里补天花板和窗外远景。 */
function addBackdrop() {
  // 天花板（略大于房间 4.24×5.24，避免边缘露缝）
  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 5.5),
    new THREE.MeshStandardMaterial({
      color: 0xe4dccd, roughness: 0.98, metalness: 0,
      emissive: 0x1a1712, emissiveIntensity: 1.0, side: THREE.DoubleSide,
    })
  )
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, 2.87, 0)
  ceil.name = 'Ceiling_Backdrop'
  scene.add(ceil)
  ceilingMesh = ceil

  // 窗外远景（正对窗户的远处面片）——贴图随时段由 makeSkyTexture 重建
  const st0 = dayState(new Date().getHours() + new Date().getMinutes() / 60)
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(6.0, 3.6),
    new THREE.MeshBasicMaterial({ map: makeSkyTexture(st0) })
  )
  sky.position.set(0, 1.84, -6.5)
  sky.name = 'Sky_Backdrop'
  scene.add(sky)
  skyMat = sky.material
  skyPhaseKey = `${st0.name}|${Math.floor(st0.hr)}`
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

function tickDust(t) {  if (!dustPoints) return
  const arr = dustPoints.geometry.attributes.position.array
  for (let i = 0; i < arr.length; i += 3) {
    arr[i + 1] += Math.sin(t * 0.4 + i) * 0.00025
    arr[i] += Math.cos(t * 0.25 + i * 0.1) * 0.00015
    if (arr[i + 1] > 2.4) arr[i + 1] = 0.3
  }
  dustPoints.geometry.attributes.position.needsUpdate = true
}

/**
 * 窗外 / 室内光：绑定本地墙钟时间，关键帧连续插值。
 * 不是「三档开关」，而是随 getHours()+minutes 滑动。
 */
const DAY_KEYS = [
  { h: 0, name: '深夜', glass: 0x151c28, em: 0.05, sky: 0x1a2233, sunI: 0.16, sunCol: 0x6a7a96, ceil: 0.55, skyCols: ['#070b14', '#101828', '#182238'], ground: '#121820', haze: 'rgba(30,40,60,0.35)', stars: 0.55 },
  { h: 5, name: '破晓', glass: 0x3a4a5c, em: 0.08, sky: 0x4a5870, sunI: 0.28, sunCol: 0xc0a090, ceil: 0.7, skyCols: ['#2a3548', '#5a5a68', '#c4a090'], ground: '#3a4048', haze: 'rgba(200,160,140,0.25)', stars: 0.15 },
  { h: 7, name: '清晨', glass: 0x9ec0d8, em: 0.14, sky: 0xffe9d2, sunI: 0.55, sunCol: 0xfff0dc, ceil: 0.95, skyCols: ['#a8c4d8', '#d8e4e8', '#f0e2c8'], ground: '#c8d0b8', haze: 'rgba(255,247,232,0.55)', stars: 0 },
  { h: 11, name: '上午', glass: 0xa8c8dc, em: 0.16, sky: 0xffe9d2, sunI: 0.68, sunCol: 0xfff5e8, ceil: 1.0, skyCols: ['#9ec4dc', '#c8dce8', '#e8e8d8'], ground: '#c0c8b0', haze: 'rgba(255,250,240,0.7)', stars: 0 },
  { h: 14, name: '午后', glass: 0x9ec0d8, em: 0.16, sky: 0xffe9d2, sunI: 0.64, sunCol: 0xfff0dc, ceil: 1.0, skyCols: ['#98bcd4', '#c4d4d8', '#e4d8c0'], ground: '#b8c0a8', haze: 'rgba(255,248,236,0.65)', stars: 0 },
  { h: 17, name: '傍晚', glass: 0xd8a878, em: 0.22, sky: 0xffcfa0, sunI: 0.82, sunCol: 0xffb878, ceil: 0.95, skyCols: ['#8aa0b8', '#d8b898', '#f0c090'], ground: '#b8a888', haze: 'rgba(255,200,140,0.55)', stars: 0 },
  { h: 19, name: '黄昏', glass: 0xc08860, em: 0.2, sky: 0xe8a880, sunI: 0.55, sunCol: 0xffa070, ceil: 0.85, skyCols: ['#5a6888', '#c09080', '#e0a070'], ground: '#8a8070', haze: 'rgba(220,140,100,0.4)', stars: 0.05 },
  { h: 20.5, name: '入夜', glass: 0x3a4858, em: 0.1, sky: 0x33405c, sunI: 0.3, sunCol: 0x8fa4c0, ceil: 0.7, skyCols: ['#1a2438', '#2a3850', '#4a5068'], ground: '#2a3038', haze: 'rgba(40,50,80,0.4)', stars: 0.35 },
  { h: 24, name: '深夜', glass: 0x151c28, em: 0.05, sky: 0x1a2233, sunI: 0.16, sunCol: 0x6a7a96, ceil: 0.55, skyCols: ['#070b14', '#101828', '#182238'], ground: '#121820', haze: 'rgba(30,40,60,0.35)', stars: 0.55 },
]

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a)
  const cb = new THREE.Color(b)
  return ca.lerp(cb, t).getHex()
}

function lerpCss(a, b, t) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t)
  const g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t)
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t)
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`
}

function dayState(hr) {
  const h = ((hr % 24) + 24) % 24
  let i = 0
  while (i < DAY_KEYS.length - 2 && DAY_KEYS[i + 1].h <= h) i++
  const a = DAY_KEYS[i]
  const b = DAY_KEYS[i + 1] || DAY_KEYS[0]
  const span = b.h - a.h || 1
  const t = Math.min(1, Math.max(0, (h - a.h) / span))
  return {
    hr: h,
    name: t < 0.5 ? a.name : b.name,
    glass: lerpHex(a.glass, b.glass, t),
    em: a.em + (b.em - a.em) * t,
    sky: lerpHex(a.sky, b.sky, t),
    sunI: a.sunI + (b.sunI - a.sunI) * t,
    sunCol: lerpHex(a.sunCol, b.sunCol, t),
    ceil: a.ceil + (b.ceil - a.ceil) * t,
    skyCols: a.skyCols.map((c, k) => lerpCss(c, b.skyCols[k] || c, t)),
    ground: lerpCss(a.ground, b.ground, t),
    haze: t < 0.5 ? a.haze : b.haze,
    stars: a.stars + (b.stars - a.stars) * t,
  }
}

function formatClock(d) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function tickClock() {
  const d = new Date()
  const label = `${formatClock(d)} · ${dayState(d.getHours() + d.getMinutes() / 60).name}`
  if (clockLabel.value !== label) {
    clockLabel.value = label
    emit('clock', { label, hhmm: formatClock(d), phase: dayState(d.getHours() + d.getMinutes() / 60).name })
  }
  if (!clockHands) return
  const m = d.getMinutes() + d.getSeconds() / 60
  const h = (d.getHours() % 12) + m / 60
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

let skyPhaseKey = ''

function applyDayState(st) {
  if (windowGlass?.material) {
    if (windowGlass.material.color) windowGlass.material.color.setHex(st.glass)
    if (windowGlass.material.emissive) {
      windowGlass.material.emissive.setHex(st.glass)
      windowGlass.material.emissiveIntensity = st.em
    }
  }
  if (ceilingMesh?.material) ceilingMesh.material.emissiveIntensity = st.ceil
  if (sunLight) {
    sunLight.intensity = st.sunI
    sunLight.color.setHex(st.sunCol)
  }
  // 天空：按小时键重绘（不是每帧），键 = 时段名+小时取整
  const key = `${st.name}|${Math.floor(st.hr)}`
  if (skyMat && key !== skyPhaseKey) {
    skyPhaseKey = key
    const tex = makeSkyTexture(st)
    if (skyMat.map) skyMat.map.dispose()
    skyMat.map = tex
    skyMat.color.setHex(0xffffff)
    skyMat.needsUpdate = true
  } else if (skyMat) {
    skyMat.color.setHex(st.sky)
  }
}

function tickWindowLight() {
  const d = new Date()
  const st = dayState(d.getHours() + d.getMinutes() / 60)
  applyDayState(st)
}

onMounted(async () => {
  const el = host.value
  if (!el) return

  // WebGL 不可用 → 直接失败事件，页面走 2D 索引降级
  try {
    const probe = document.createElement('canvas')
    const gl =
      probe.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      probe.getContext('webgl', { failIfMajorPerformanceCaveat: false })
    if (!gl) throw new Error('WebGL unavailable')
  } catch (err) {
    console.error('[RoomStage3D] no webgl', err)
    failed.value = true
    emit('failed', err)
    return
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2a2218)

  camera = new THREE.PerspectiveCamera(
    fovForAspect(el.clientWidth / el.clientHeight),
    el.clientWidth / el.clientHeight,
    0.08,
    30,
  )
  // 相机必须在房间内：房间进深到 z=+2.62、右墙在 x=2.12，
  // 之前停在 (2.4, 1.7, 2.6) 已经贴到墙外，只能看到外墙壳
  camera.position.set(1.5, 1.55, 2.3)

  // 触屏设备（手机 / 平板）GPU 弱得多：关掉 MSAA（高 DPR 本身已有超采样效果）、
  // 收紧填充率上限，阴影分辨率也从 2048 降到 1024。
  // 必须两个条件同时成立：媒体查询单独用会被部分环境误判。
  const coarse = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches
    && (navigator.maxTouchPoints || 0) > 0
  renderer = new THREE.WebGLRenderer({
    antialias: !coarse,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.25 : 1.5))
  // 极弱 GPU / 省电：再压一档 DPR，优先保证可交互
  if (coarse && window.devicePixelRatio > 2) renderer.setPixelRatio(1.1)
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  // 几何已按材质合并（draw call 722 -> ~230）。房间是静态的，
  // 阴影贴图没必要时重算 —— 关掉每帧自动更新，只在遮挡关系变化时手动标脏。
  renderer.shadowMap.enabled = true
  // three.js R186 起 PCFSoftShadowMap 已被移除（设置它会静默降级并打警告），
  // 现在用 PCFShadowMap + 更大的采样半径来拿到柔和的阴影边缘
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.shadowMap.needsUpdate = true
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.94
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.appendChild(renderer.domElement)

  pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  // 环境贴图只负责金属/光滑面的反射；强度必须压低，否则整间屋子会被冲白
  scene.environmentIntensity = 0.35

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  applyLimits(ROOM_LIMITS)
  controls.target.set(0, 0.85, -0.5)
  // 竖屏：42° 的斜角构图会把书架整个挤出取景范围，
  // 换成更正、稍远的机位，让房间宽度方向尽可能完整入画
  if (el.clientWidth / el.clientHeight < 1.1) {
    camera.position.set(0.9, 1.72, 2.42)
    controls.target.set(-0.15, 0.92, -0.95)
  }
  controls.enablePan = false
  controls.rotateSpeed = 0.65
  controls.zoomSpeed = 0.7
  // 相机一动就回到满帧渲染
  controls.addEventListener('change', touchActive)
  controls.addEventListener('start', touchActive)
  el.addEventListener('wheel', onWheel, { passive: true })

  // 主光 = 窗外日光。强度压低，让暖色台灯成为室内主光（对齐参考图）
  const sun = new THREE.DirectionalLight(0xffe8d2, 0.62)
  sun.position.set(1.6, 3.4, -5.2)
  sun.castShadow = true
  const sm = coarse ? 1024 : 2048
  sun.shadow.mapSize.set(sm, sm)
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 16
  sun.shadow.camera.left = -3.4
  sun.shadow.camera.right = 3.4
  sun.shadow.camera.top = 3.4
  sun.shadow.camera.bottom = -3.4
  sun.shadow.bias = -0.0009
  sun.shadow.normalBias = 0.03
  // PCF 采样半径：数值越大边缘越柔。这是现在唯一的柔和度旋钮
  sun.shadow.radius = 2.5
  sun.target.position.set(-0.1, 0.85, -0.2)
  sunLight = sun
  scene.add(sun)
  scene.add(sun.target)

  // 补光：天光 + 地面反弹，避免背光面死黑
  scene.add(new THREE.HemisphereLight(0xa8c0d8, 0x4a3826, 0.22))
  scene.add(new THREE.AmbientLight(0xffe8d4, 0.07))
  // 侧向补一盏弱光，勾出家具体块的边缘
  const fill = new THREE.DirectionalLight(0x9fb4cc, 0.12)
  fill.position.set(-3.0, 2.4, 2.6)
  scene.add(fill)

  // 台灯 / 落地灯：烘焙里已含一层暖光，这里只承担开关时的增量
  deskLampLight = new THREE.PointLight(0xffc078, 0.9, 2.8, 2)
  deskLampLight.position.set(0.55, 1.25, -2.0)
  scene.add(deskLampLight)

  floorLampLight = new THREE.PointLight(0xffd0a0, 0.45, 3.5, 2)
  floorLampLight.position.set(1.7, 1.3, 1.2)
  scene.add(floorLampLight)

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  const loader = new GLTFLoader()
  // Draco 压缩模型（8.1MB → ~1MB）；解码器 vendored 在 public/draco
  const draco = new DRACOLoader()
  draco.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
  loader.setDRACOLoader(draco)
  const base = import.meta.env.BASE_URL
  try {
    const gltf = await loader.loadAsync(`${base}models/study_room/study_room_web.opt.glb`, (e) => {
      if (e.total) loadPct.value = Math.round((e.loaded / e.total) * 100)
    })
    draco.dispose()
    modelRoot = gltf.scene
    // 材质：提高环境反射权重，让木器 / 黄铜 / 玻璃有真实反射
    modelRoot.traverse((c) => {
      if (!c.isMesh) return
      const m = c.material
      if (m && 'envMapIntensity' in m) m.envMapIntensity = 0.62
      if (m && m.roughness != null && m.roughness < 0.06) m.roughness = 0.06
      // 烘焙 AO 存在 COLOR_0 里，必须打开顶点色才会生效
      if (m && c.geometry?.attributes?.color) m.vertexColors = true
    })
    // 排架映射必须先算好：下面的 tagClickable 靠它决定每本书翻开哪篇笔记
    buildShelfMap(modelRoot)
    // 书脊标签依赖独立的 BK_* 网格；若模型被错误合并则跳过，避免贴出错位面片
    if (!shelfOrder.length || shelfOrder.length < 20) {
      console.warn('[RoomStage3D] shelf books missing, skip spine labels', shelfOrder.length)
    } else {
      emit('shelfmap', shelfAnchorList)
    }
    scene.add(modelRoot)
    tagClickable(modelRoot)
    applyShadows(modelRoot)
    await decorateArt(modelRoot, base)
    // 书脊刻名：18 本锚点书各贴一枚书名签（一张图集 + 合并四边形，只加 1 个 draw call）
    if (shelfOrder.length >= 20) {
      spineLabels = buildSpineLabels(modelRoot)
      if (spineLabels) scene.add(spineLabels)
    }
    addBackdrop()
    addDust()
    setupClockAndWindow(modelRoot)

    const named = findByName(modelRoot, ['Laptop_Screen', 'Desk_Drawer_Upper', 'Desk_Drawer_Lower', 'DeskLamp'])
    screenMesh = named.Laptop_Screen || null
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
    // 调试句柄只挂在开发环境：自动化截图 / 探针脚本会被它读取
    if (import.meta.env.DEV) {
      const bb = new THREE.Box3().setFromObject(modelRoot)
      window.__room3d = {
        THREE, scene, camera, controls, modelRoot, bbox: bb, renderer, sunLight,
        shelfAnchors: shelfAnchorList,   // 排架锚点，供探针脚本核对
      }
      // 自增计数：多实例会带来双份 WebGL 上下文，探针脚本靠它一眼看出
      window.__r3dInstances = (window.__r3dInstances || 0) + 1
    }
  } catch (err) {
    console.error('[RoomStage3D] load failed', err)
    try {
      draco.dispose()
    } catch {
      /* ignore */
    }
    failed.value = true
    emit('failed', err)
    return
  }

  el.addEventListener('pointerdown', onPointerDown, { passive: true })
  el.addEventListener('pointermove', onPointerMove, { passive: true })
  el.addEventListener('click', onClick)
  window.addEventListener('pointerup', onPointerEnd)
  window.addEventListener('pointercancel', onPointerEnd)
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)
  touchActive()
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
  (raw) => {
    if (!raw) return
    // 尾部时间戳只是为了"点同一本也能再触发一次"，这里剥掉
    const id = String(raw).split('@')[0]
    if (id === 'room') {
      backToRoom()
      return
    }
    const hit = clickables.find((c) => c.userData?.id === id)
    if (!hit) return
    openBook(hit)
    // 书架上的书才需要走近：桌面那几本在默认机位就有 140px 宽，看得清
    if (SHELF_RE.test(hit.name)) focusBook(hit)
    else if (id === 'bookcase') focusShelf()
  }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  if (resizePending) cancelAnimationFrame(resizePending)
  closeAllBooks()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
  if (host.value) {
    host.value.removeEventListener('pointerdown', onPointerDown)
    host.value.removeEventListener('pointermove', onPointerMove)
    host.value.removeEventListener('click', onClick)
    host.value.removeEventListener('wheel', onWheel)
  }
  window.removeEventListener('pointerup', onPointerEnd)
  window.removeEventListener('pointercancel', onPointerEnd)
  controls?.removeEventListener('change', touchActive)
  controls?.removeEventListener('start', touchActive)
  controls?.dispose()
  pmrem?.dispose()
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  clickables.length = 0
  if (spineLabels) {
    scene.remove(spineLabels)
    spineLabels.geometry.dispose()
    spineLabels.material.map?.dispose()
    spineLabels.material.dispose()
    spineLabels = null
  }
})
</script>

<template>
  <div ref="host" class="room3d" :class="{ 'room3d--ready': ready }" aria-label="3D 工作室">
    <div v-if="!ready" class="room3d__loading">
      <span>载入书房… {{ loadPct }}%</span>
    </div>
    <!-- 暗角：纯 CSS 合成，不给 GPU 增加负担，只把视线收到画面中心 -->
    <div v-if="ready" class="room3d__vignette" aria-hidden="true" />
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
.room3d__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  background: radial-gradient(
    ellipse 78% 70% at 50% 46%,
    rgba(0, 0, 0, 0) 42%,
    rgba(20, 12, 6, 0.42) 100%
  );
}
</style>
