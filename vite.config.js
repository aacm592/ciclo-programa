import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = 'Ciclo_programa'
const TARGET_HTML_FILE = 'Planificacion_Evaluacion_Programa.html'

/**
 * Plugin de Vite para renombrar index.html al nombre de archivo esperado
 * por el sistema una vez finalizado el empaquetado single-file.
 */
const renameHtmlPlugin = (outDir = OUT_DIR, targetName = TARGET_HTML_FILE) => ({
  name: 'rename-html',
  closeBundle() {
    const oldPath = path.resolve(currentDir, outDir, 'index.html')
    const newPath = path.resolve(currentDir, outDir, targetName)

    try {
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath)
      }
    } catch (error) {
      console.error(`[rename-html] Error al renombrar ${oldPath} a ${newPath}:`, error)
    }
  }
})

export default defineConfig({
  plugins: [vue(), tailwindcss(), viteSingleFile(), renameHtmlPlugin()],
  base: './',
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true
  }
})
