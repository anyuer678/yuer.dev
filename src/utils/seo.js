// utils/seo.js —— 组件不直接操作 document（14 §5.7）
import { site } from './content.js'

export function setTitle(t) {
  if (!t) return
  document.title = String(t).slice(0, 60) // 02 §8：title ≤ 60 字符
}

export function setDescription(d) {
  const text = String(d || site.bio).slice(0, 120) // 02 §8：description ≤ 120 字符
  let el = document.querySelector('meta[name="description"]')
  if (!el) {
    el = document.createElement('meta')
    el.name = 'description'
    document.head.appendChild(el)
  }
  el.content = text
}

export function setCanonical() {
  // v1.1 启用（签名预留）
}

// afterEach 统一入口：静态路由用 meta.title/description（函数求值）；
// 详情路由（无 meta.title 定义）跳过，交给组件内 watchEffect 覆盖（14 §5.3/§5.7）。
export function applyMeta(route) {
  const meta = route.meta || {}
  if (meta.title) setTitle(typeof meta.title === 'function' ? meta.title(site) : meta.title)
  if (meta.description)
    setDescription(typeof meta.description === 'function' ? meta.description(site) : meta.description)
}
