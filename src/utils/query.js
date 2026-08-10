// utils/query.js —— URL 查询工具，零依赖（14 §4.3 决策 D2）
// vue-router 查询值形态：单值 string | 重复参数 string[] | 缺失 undefined | 空串 ''
// toQueryArray 统一归一为 string[]（§5.4 契约）
export function toQueryArray(v) {
  if (v == null) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  return v === '' ? [] : [v]
}
