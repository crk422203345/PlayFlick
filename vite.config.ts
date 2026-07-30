import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gameApiTarget = env.VITE_GAME_API_TARGET || 'https://g.bingo.vip'
  const gameProxy = {
    '/game-api': {
      target: gameApiTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/game-api/, ''),
    },
  }

  return {
    plugins: [tailwindcss(), vue(), ...(mode === 'development' ? [vueDevTools()] : [])],
    server: {
      host: '0.0.0.0',
      proxy: gameProxy,
    },
    preview: {
      host: '0.0.0.0',
      proxy: gameProxy,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
