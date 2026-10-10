import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    rollupOptions: {
      // Tre pagine: home, /eventi/ e /regolamento/
      input: {
        main: resolve(__dirname, 'index.html'),
        eventi: resolve(__dirname, 'eventi/index.html'),
        regolamento: resolve(__dirname, 'regolamento/index.html'),
      },
    },
  },
})
