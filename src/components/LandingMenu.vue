<script setup>
import { useCicloStore } from '../stores/cicloStore'
import { ref } from 'vue'
import { RAMAS } from '../utils/areasCrecimiento'

const store = useCicloStore()
const mostrarModalRama = ref(false)
const mostrarModalSinDirigentes = ref(false)

// Comprueba la existencia de dirigentes antes de iniciar el flujo
const intentarCrearCiclo = () => {
  if (store.dirigentes.length === 0) {
    mostrarModalSinDirigentes.value = true
  } else {
    mostrarModalRama.value = true
  }
}

const intentarEditarCiclo = () => {
  if (store.dirigentes.length === 0) {
    mostrarModalSinDirigentes.value = true
  } else {
    store.vistaActual = 'moduloA'
  }
}

const seleccionarRama = (idRama) => {
  mostrarModalRama.value = false
  store.crearNuevoCiclo(idRama)
}

const irADirigentes = () => {
  mostrarModalSinDirigentes.value = false
  store.vistaActual = 'dirigentes'
}

defineProps({
  isDarkMode: Boolean
})

// Colores temáticos por rama para los botones del modal
const estilosRama = {
  lobatos: 'border-amber-400/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:border-amber-400',
  exploradores: 'border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:border-blue-400',
  pioneros: 'border-rose-400/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 hover:border-rose-400',
  rovers: 'border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400'
}
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
        <h2
          :class="[
            'text-5xl md:text-6xl font-display font-medium leading-tight tracking-tight transition-colors',
            isDarkMode ? 'text-white' : 'text-morado'
          ]"
        >
          Planificación<br />nacida del<br />escultismo.
        </h2>
      </div>

      <!-- Columna Derecha: Botones Principales -->
      <div
        :class="[
          'flex flex-col justify-center gap-5 md:pl-8 pt-6 md:pt-0 md:border-l',
          isDarkMode ? 'border-white/10' : 'border-gris-lavanda/30'
        ]"
      >
        <button
          @click="intentarCrearCiclo"
          class="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm md:text-base font-semibold flex items-center justify-between cursor-pointer group"
        >
          Crear nuevo ciclo
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          @click="intentarEditarCiclo"
          class="px-6 py-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 transition-all text-sm md:text-base font-semibold text-gray-200 flex items-center justify-between cursor-pointer group"
        >
          Editar ciclo actual
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>

    <!-- Fila Inferior: Etiquetas tipo píldora -->
    <div
      :class="[
        'mt-20 flex flex-wrap gap-4 pt-8 border-t transition-colors',
        isDarkMode ? 'border-white/10' : 'border-gris-lavanda/20'
      ]"
    >
      <span
        :class="[
          'px-4 py-1.5 rounded-full border text-xs flex items-center gap-2',
          isDarkMode
            ? 'border-white/20 text-gray-200 bg-white/5'
            : 'border-gris-lavanda/30 text-morado bg-white/50'
        ]"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Lobatos
      </span>
      <span
        :class="[
          'px-4 py-1.5 rounded-full border text-xs flex items-center gap-2',
          isDarkMode
            ? 'border-white/20 text-gray-200 bg-white/5'
            : 'border-gris-lavanda/30 text-morado bg-white/50'
        ]"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Exploradores
      </span>
      <span
        :class="[
          'px-4 py-1.5 rounded-full border text-xs flex items-center gap-2',
          isDarkMode
            ? 'border-white/20 text-gray-200 bg-white/5'
            : 'border-gris-lavanda/30 text-morado bg-white/50'
        ]"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Pioneros
      </span>
      <span
        :class="[
          'px-4 py-1.5 rounded-full border text-xs flex items-center gap-2',
          isDarkMode
            ? 'border-white/20 text-gray-200 bg-white/5'
            : 'border-gris-lavanda/30 text-morado bg-white/50'
        ]"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Rovers
      </span>
    </div>
  </div>
  
<Teleport to="body">
  <!-- Modal: Sin dirigentes registrados -->
  <div
    v-if="mostrarModalSinDirigentes"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
  >
    <!-- Contenedor glassmorphism -->
    <div class="bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">

      <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">
        !
      </div>
      
      <h3 class="text-lg font-bold font-display text-morado dark:text-white">
        Sin dirigentes registrados
      </h3>
      
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Aún no tienes dirigentes en tu lista, añádelos con el siguiente botón para poder asignarlos en las reuniones.
      </p>

      <div class="pt-2 flex flex-col gap-2">
        <button
          type="button"
          @click="irADirigentes"
          class="w-full py-3 px-4 rounded-xl bg-jade hover:bg-jade/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Añadir dirigentes
        </button>
        
        <button
          type="button"
          @click="mostrarModalSinDirigentes = false"
          class="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1.5 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>

    <div
    v-if="mostrarModalRama"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
  >
    <div class="bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-5">
      <h3 class="text-xl font-bold font-display text-morado dark:text-white text-center tracking-tight">
        ¿A qué rama corresponde este ciclo?
      </h3>

      <div class="grid grid-cols-1 gap-3">
        <button
          v-for="r in RAMAS"
          :key="r.id"
          type="button"
          @click="seleccionarRama(r.id)"
          :class="[
            'p-3.5 rounded-2xl border font-bold text-sm text-center transition-all cursor-pointer shadow-sm active:scale-[0.98]',
            estilosRama[r.id] || 'border-slate-300 text-slate-700 dark:text-slate-200'
          ]"
        >
          {{ r.nombre }}
        </button>
      </div>

      <button
        type="button"
        @click="mostrarModalRama = false"
        class="w-full text-center text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 pt-1 cursor-pointer transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
</Teleport>

</template>
