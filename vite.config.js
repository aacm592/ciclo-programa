import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'

// Plugin automático para renombrar el archivo al terminar de compilar
const renameHtmlPlugin = () => ({
  name: 'rename-html',
  closeBundle() {
    const outDir = 'Ciclo_programa' // Carpeta exclusiva
    const oldPath = path.resolve(__dirname, outDir, 'index.html')
    const newPath = path.resolve(__dirname, outDir, 'Planificacion_Evaluacion_Programa.html')
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath)
    }
  }
})

export default defineConfig({
  plugins: [vue(), tailwindcss(), viteSingleFile(), renameHtmlPlugin()],
  base: './',
  build: {
    outDir: 'Ciclo_programa',
    emptyOutDir: true, // Limpia la carpeta antes de cada compilación
    base: './'
  }
})
