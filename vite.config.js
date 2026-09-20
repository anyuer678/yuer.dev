import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { generateContentMeta } from './scripts/gen-content-meta.mjs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

/**
 * 生成 content 的 frontmatter 索引（见 scripts/gen-content-meta.mjs 顶部说明）。
 *
 * 起因：主包里混进了 3.1MB 的笔记正文 —— utils/content.js 用 eager raw glob 读全部
 * markdown，只为解析 frontmatter。改读 _meta/*.json 之后，主包只带元数据，
 * 正文继续由非 eager glob 在详情页按需加载。
 *
 * 做成插件而不是手动 npm script：dev / build 都会自动生成，改完笔记不必记得跑命令。
 */
function contentMetaPlugin() {
  const isContentMd = (f) => /[\\/]src[\\/]content[\\/](notes|projects)[\\/][^\\/]+\.md$/.test(f)
  return {
    name: 'content-meta',
    async buildStart() {
      await generateContentMeta(rootDir)
    },
    async configureServer(server) {
      await generateContentMeta(rootDir)
      // 写完笔记立即更新索引（索引内容不变时脚本不写盘，因此不会造成循环刷新）
      for (const ev of ['change', 'add', 'unlink']) {
        server.watcher.on(ev, async (file) => {
          if (isContentMd(file)) await generateContentMeta(rootDir)
        })
      }
    },
  }
}

// GitHub Pages 项目仓库部署：https://anyuer678.github.io/yuer.dev/
export default defineConfig({
  base: '/yuer.dev/',
  plugins: [vue(), contentMetaPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2018', // 浏览器矩阵：Safari 15+ / Chrome 100+（07 §15）
  },
})
