/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'vue/multi-word-component-names': 'off', // 单文件组件与页面文件命名自由（目录已区分）
    'vue/max-attributes-per-line': 'off', // 交由 Prettier 处理
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'error',
      { html: { void: 'always', normal: 'always', component: 'always' } },
    ],
  },
}
