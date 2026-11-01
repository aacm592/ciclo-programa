<script setup>
import { useLandingMenu } from '../composables/useLandingMenu'
import ModalAviso from './shared/ModalAviso.vue'
import ModalRama from './shared/ModalRama.vue'

const { modal, cerrarModal, mostrarModalRama, intentarCrearCiclo, intentarEditarCiclo, seleccionarRama } = useLandingMenu()

defineProps({ isDarkMode: Boolean })

const PILDORAS = [
  { nombre: 'Lobatos',      dot: 'bg-yellow-400' },
  { nombre: 'Exploradores', dot: 'bg-blue-500'   },
  { nombre: 'Pioneros',     dot: 'bg-red-500'    },
  { nombre: 'Rovers',       dot: 'bg-green-500'  },
]
</script>

<template>
  <!-- Contenedor Dark Glassmorphism -->
  <div
    :class="[
      'relative w-full max-w-5xl mx-auto mt-4 rounded-[2rem] p-10 md:p-16 shadow-2xl overflow-hidden transition-all duration-300',
      isDarkMode
        ? 'bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white'
        : 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(67,61,149,0.08)] text-morado'
    ]"
  >
    <!-- Diseño en dos columnas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
      <!-- Columna Izquierda: Título -->
      <div class="flex items-center">
        <h2 :class="['text-5xl md:text-6xl font-display font-medium leading-tight tracking-tight transition-colors', isDarkMode ? 'text-white' : 'text-morado']">
          Planificación<br />nacida del<br />escultismo.
        </h2>
      </div>

      <!-- Columna Derecha: Botones Principales -->
      <div :class="['flex flex-col justify-center gap-5 md:pl-8 pt-6 md:pt-0 md:border-l', isDarkMode ? 'border-white/10' : 'border-gris-lavanda/30']">
        <button @click="intentarCrearCiclo"
          class="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm md:text-base font-semibold flex items-center justify-between cursor-pointer group"
        >
          Crear nuevo ciclo
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <button @click="intentarEditarCiclo"
          class="px-6 py-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 transition-all text-sm md:text-base font-semibold text-gray-200 flex items-center justify-between cursor-pointer group"
        >
          Editar ciclo actual
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>

    <!-- Fila Inferior: Etiquetas tipo píldora -->
    <div :class="['mt-20 flex flex-wrap gap-4 pt-8 border-t transition-colors', isDarkMode ? 'border-white/10' : 'border-gris-lavanda/20']">
      <span
        v-for="p in PILDORAS" :key="p.nombre"
        :class="['px-4 py-1.5 rounded-full border text-xs flex items-center gap-2',
          isDarkMode ? 'border-white/20 text-gray-200 bg-white/5' : 'border-gris-lavanda/30 text-morado bg-white/50']"
      >
        <span :class="['w-1.5 h-1.5 rounded-full', p.dot]"></span> {{ p.nombre }}
      </span>
    </div>
  </div>

  <ModalAviso :modal="modal" @close="cerrarModal" />
  <ModalRama :show="mostrarModalRama" @seleccionar="seleccionarRama" @cancelar="mostrarModalRama = false" />
</template>
