import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    rollupOptions: {
      // Due pagine: home e /eventi/
      input: {
        main: resolve(__dirname, 'index.html'),
        eventi: resolve(__dirname, 'eventi/index.html'),
      },
    },
  },
})
