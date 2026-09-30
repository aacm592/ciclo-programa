<script setup>
import { useCicloStore } from '../stores/cicloStore'
import { computed } from 'vue'
const store = useCicloStore()

// Recibimos el estado del modo oscuro desde App.vue
defineProps({
  isDarkMode: Boolean
})

// Emitimos un evento para avisar a App.vue que debe cambiar el tema
const emit = defineEmits(['toggleTheme'])

const activeIndex = computed(() => {
  if (['moduloA', 'moduloB', 'moduloC'].includes(store.vistaActual)) return 0
  if (store.vistaActual === 'evaluacion') return 1
  if (store.vistaActual === 'dirigentes') return 2
  return -1
})
</script>

<template>
  <nav
    :class="[
      'relative z-50 rounded-full px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300 mb-8',
      isDarkMode
        ? 'bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white'
        : 'bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(67,61,149,0.08)] text-morado'
    ]"
  >
    <!-- Logo y Botón de Tema -->
    <div class="flex items-center gap-4 pl-2">
      <!-- BOTÓN HOME -->
      <button
        @click="store.vistaActual = 'landing'"
        :class="[
          'p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center',
          isDarkMode
            ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            : 'bg-morado/10 hover:bg-morado/20 border-gris-lavanda/30 text-morado'
        ]"
        title="Ir al inicio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
      <div class="cursor-pointer flex flex-col items-start" @click="store.vistaActual = 'landing'">
        <h1
          :class="[
            'font-display font-black text-2xl tracking-tight transition-colors',
            isDarkMode ? 'text-white drop-shadow-md' : 'text-morado'
          ]"
        >
          Kairos
        </h1>
        <p
          :class="[
            'font-sans text-[10px] font-bold uppercase tracking-wider transition-colors',
            isDarkMode ? 'text-jade' : 'text-morado'
          ]"
        >
          Planificación
        </p>
      </div>
      <!-- BOTÓN DARK/LIGHT MODE -->
      <button
        @click="emit('toggleTheme')"
        :class="[
          'p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-inner',
          isDarkMode
            ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            : 'bg-morado/10 hover:bg-morado/20 border-gris-lavanda/30 text-morado'
        ]"
        title="Cambiar tema"
      >
        <span v-if="!isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>

    <!-- Contenedor de Botones con Burbuja Deslizante -->
    <div
      :class="[
        'relative grid grid-cols-3 gap-1 p-1.5 rounded-full border text-sm font-semibold transition-colors w-full md:w-auto',
        isDarkMode
          ? 'bg-black/40 border-white/5 shadow-inner'
          : 'bg-white/60 border-gris-lavanda/20 shadow-sm'
      ]"
    >
      <!-- BURBUJA / INDICADOR DESLIZANTE -->
      <div
        v-if="activeIndex !== -1"
        class="absolute top-1.5 bottom-1.5 rounded-full transition-all duration-300 ease-out shadow-sm"
        :style="{
          left: `calc(${activeIndex * 33.33}% + 6px)`,
          width: 'calc(33.33% - 8px)'
        }"
        :class="isDarkMode ? 'bg-white/20 border border-white/20 shadow-sm' : 'bg-morado shadow-sm'"
      ></div>

      <!-- Botón 1 -->
      <button
        @click="store.vistaActual = 'moduloA'"
        :class="[
          'relative z-10 px-5 py-2 rounded-full transition-colors duration-200 cursor-pointer text-center',
          activeIndex === 0
            ? 'text-white font-bold'
            : isDarkMode
              ? 'text-gray-300 hover:text-white'
              : 'text-morado hover:text-morado/80'
        ]"
      >
        Editar Ciclo
      </button>

      <!-- Botón 2 -->
      <button
        @click="store.vistaActual = 'evaluacion'"
        :class="[
          'relative z-10 px-5 py-2 rounded-full transition-colors duration-200 cursor-pointer text-center',
          activeIndex === 1
            ? 'text-white font-bold'
            : isDarkMode
              ? 'text-gray-300 hover:text-white'
              : 'text-morado hover:text-morado/80'
        ]"
      >
        Evaluar Reunión
      </button>

      <!-- Botón 3 -->
      <button
        @click="store.vistaActual = 'dirigentes'"
        :class="[
          'relative z-10 px-5 py-2 rounded-full transition-colors duration-200 cursor-pointer text-center',
          activeIndex === 2
            ? 'text-white font-bold'
            : isDarkMode
              ? 'text-gray-300 hover:text-white'
              : 'text-morado hover:text-morado/80'
        ]"
      >
        Dirigentes
      </button>
    </div>
  </nav>
</template>
