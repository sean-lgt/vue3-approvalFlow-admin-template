import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// fix: The above dynamic import cannot be analyzed by Vite.
// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    // dynamicImportVars({
    //   // options
    // })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.vue', '.js', '.json', '.ts']
  },
  // 本地服务代理
  server: {
    host: 'localhost',
    port: '8080',
    proxy: {
      "/api": "http://127.0.0.1:3000",
      rewrite: path => path.replace(/\/api/, '/api')
    }
  }
})
