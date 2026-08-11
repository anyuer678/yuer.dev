// 受控子集解析：单行 key: value；字符串/布尔/整数/简单字符串数组/空值。
// 越界内容由 scripts/validate-content.mjs（规则 14）拦截，构建期报错。
export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) throw new Error('frontmatter missing')
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf(':')
    const key = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if (v === '') {
      meta[key] = null
      continue
    }
    if (v.startsWith('[') && v.endsWith(']')) {
      if (v.includes('{')) {
        try {
          meta[key] = JSON.parse(v)
          continue
        } catch {
          // 不是合法 JSON（如对象数组未转义），落入普通字符串数组解析
        }
      }
      meta[key] = v
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (v === 'true') meta[key] = true
    else if (v === 'false') meta[key] = false
    else if (/^-?\d+$/.test(v)) meta[key] = Number(v)
    else meta[key] = v.replace(/^["']|["']$/g, '')
  }
  return { meta, raw: raw.slice(m[0].length).trimStart() }
}
