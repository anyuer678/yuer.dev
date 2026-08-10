// utils/seo.js —— 组件不直接操作 document（14 §5.7）
// P1 过渡：直接读 site.json；P2 切换为 content.js 的 getSite()。
import site from '@/content/site.json'

export function setTitle(t) {
  if (!t) return
  document.title = String(t).slice(0, 60) // 02 §8：title ≤ 60 字符
}

export function setDescription(d) {
  const text = d || site.bio
  let el = document.querySelector('meta[name="description"]')
  if (!el) {
    el = document.createElement('meta')
    el.name = 'description'
    document.head.appendChild(el)
  }
  el.content = String(text).slice(0, 120) // 02 §8：description ≤ 120 字符
}

export function setCanonical() {
  // v1.1 启用（签名预留）
}

// afterEach 统一入口：meta.title 为函数 → 求值设置；
// 详情路由（无 meta.title 函数）跳过，交给组件内 watchEffect 覆盖。
export function applyMeta(route) {
  const title = route.meta?.title
  if (typeof title !== 'function') return
  setTitle(title(site))
  const desc = route.meta?.description
  setDescription(typeof desc === 'function' ? desc(site) : site.bio)
}
