import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// `vite build --mode regolamento` produce solo il regolamento, con la pagina
// alla radice e il CNAME, pronto per regolamento.encoderp.it
const rulesSite = {
  name: 'regolamento-root',
  enforce: 'post',
  generateBundle(_, bundle) {
    const page = bundle['regolamento/index.html']
    delete bundle['regolamento/index.html']
    page.fileName = 'index.html'
    bundle['index.html'] = page
    this.emitFile({ type: 'asset', fileName: 'CNAME', source: 'regolamento.encoderp.it\n' })
  },
}

export default defineConfig(({ mode }) => {
  const rules = mode === 'regolamento'
  return {
    plugins: [vue(), rules && rulesSite],
    server: { port: Number(process.env.PORT) || 5173 },
    build: {
      outDir: rules ? 'dist-regolamento' : 'dist',
      rollupOptions: {
        // Home e /eventi/ sul sito principale, il regolamento sul sottodominio
        input: rules
          ? { regolamento: resolve(__dirname, 'regolamento/index.html') }
          : {
              main: resolve(__dirname, 'index.html'),
              eventi: resolve(__dirname, 'eventi/index.html'),
            },
      },
    },
  }
})
