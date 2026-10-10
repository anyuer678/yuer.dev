// ESLint flat config（eslint 10 + eslint-plugin-vue 10）
// 迁移自 .eslintrc.cjs（eslint 8 legacy）：规则意图一比一保留，格式类规则交 Prettier
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/content/_meta/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      // 单文件组件与页面文件命名自由（目录已区分）
      'vue/multi-word-component-names': 'off',
      // 交由 Prettier 处理的格式规则一律关闭（v10 的 flat preset 已不含格式规则）
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': [
        'error',
        { html: { void: 'always', normal: 'always', component: 'always' } },
      ],
    },
  },
]
