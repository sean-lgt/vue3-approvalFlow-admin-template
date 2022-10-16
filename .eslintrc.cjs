module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off', //除了根组件（App.vue）外，自定义组件名称应该由多单词组成，防止和html标签冲突
    'prettier/prettier': 0 //让eslint忽略pretteir的格式化，不发出警告 已经有自动化格式插件
  }
}
