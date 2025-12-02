import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import vitePluginCompression from 'vite-plugin-compression'
import fs from 'fs'
import path from 'path'

function copyStaticAssets() {
  const srcDir = path.resolve(__dirname, 'assets')
  const destDir = path.resolve(__dirname, 'public/assets')
  if (!fs.existsSync(srcDir)) return
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, file)
    const dest = path.join(destDir, file)
    try {
      fs.copyFileSync(src, dest)
    } catch (e) {
      // ignore
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const dashKey = env.VITE_DASHSCOPE_API_KEY || process.env.VITE_DASHSCOPE_API_KEY || ''
  return {
  plugins: [
    vue(),
    vitePluginCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    {
      name: 'copy-static-assets-serve',
      apply: 'serve',
      configureServer() {
        copyStaticAssets()
      }
    },
    {
      name: 'copy-static-assets-build',
      apply: 'build',
      buildStart() {
        copyStaticAssets()
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          'library': ['canvas-confetti']
        }
      }
    }
  },
  server: {
    port: 8080,
    open: true,
    proxy: {
      '/api/name-scoring': {
        target: 'https://api.yuanfenju.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/name-scoring/, '/index.php/v1/Dafen/xingming')
      },
      '/api/wordart-texture': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/wordart-texture/, '/api/v1/services/aigc/wordart/texture')
      },
      '/api/dashscope-task': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/dashscope-task/, '/api/v1/tasks')
      }
    }
  }
}
})
