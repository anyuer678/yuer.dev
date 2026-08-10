// utils/markdown.js —— 详情 chunk，仅被详情页动态 import（14 §5.2）
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'

const md = new MarkdownIt({
  html: false, // 正文禁止内嵌 HTML，防 XSS（04 §10 强制执行点）
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs language-${md.utils
        .escapeHtml(lang)
        .replace(/\s+/g, '-')}">${hljs.highlight(str, { language: lang }).value}</code></pre>`
    }
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// 外链（站外 http(s)）新标签打开；站内绝对路径（/projects、/notes 开头）走 SPA 导航
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet('href') ?? ''
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

// h2 锚点：<h2 id="<prefix>-<n>">；计数用闭包状态，渲染调用间互不污染
function createAnchorPlugin() {
  let idPrefix = 's'
  let idCounter = 0
  md.core.ruler.push('h2_anchor', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'heading_open' && token.tag === 'h2') {
        token.attrSet('id', `${idPrefix}-${++idCounter}`)
      }
    }
  })
  return (prefix) => {
    idPrefix = prefix
    idCounter = 0
  }
}
const resetAnchor = createAnchorPlugin()

export function renderMarkdown(raw, prefix = 's') {
  resetAnchor(prefix)
  return md.render(raw)
}
