// utils/seo.js —— 组件不直接操作 document（14 §5.7）
import { site } from './content.js'

const SITE_URL = 'https://anyuer678.github.io/yuer.dev/' // 02 §8；与 vite base 一致

function upsertMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

export function setTitle(t) {
  if (!t) return
  document.title = String(t).slice(0, 60) // 02 §8：title ≤ 60 字符
  upsertMeta('property', 'og:title', document.title) // 社交卡片随路由同步
}

export function setDescription(d) {
  const text = String(d || site.bio).slice(0, 120) // 02 §8：description ≤ 120 字符
  upsertMeta('name', 'description', text)
  upsertMeta('property', 'og:description', text)
}

export function setCanonical(path = '') {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  // route.path 以 / 开头，直接 new URL(path, base) 会替换整个路径丢掉 /yuer.dev/ 目录
  // （review 复核阻断项）→ 去前导 / 后按相对路径解析，保留 base 目录
  el.href = new URL(path.replace(/^\//, ''), SITE_URL).toString()
  upsertMeta('property', 'og:url', el.href)
}

// afterEach 统一入口：静态路由用 meta.title/description（函数求值）；
// 详情路由（无 meta.title 定义）跳过 title/description，交给组件内 watchEffect 覆盖（14 §5.3/§5.7）；
// canonical 与 og:url 一律按当前路径注入（review 终审：SEO 完整性）。
export function applyMeta(route) {
  const meta = route.meta || {}
  if (meta.title) setTitle(typeof meta.title === 'function' ? meta.title(site) : meta.title)
  if (meta.description)
    setDescription(typeof meta.description === 'function' ? meta.description(site) : meta.description)
  setCanonical(route.path)
}
