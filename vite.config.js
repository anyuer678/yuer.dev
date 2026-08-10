import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages 项目仓库部署：https://anyuer678.github.io/yuer.dev/
export default defineConfig({
  base: '/yuer.dev/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2018', // 浏览器矩阵：Safari 15+ / Chrome 100+（07 §15）
  },
})
