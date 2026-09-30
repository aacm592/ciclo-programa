<script setup>
import { ref, computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'

const props = defineProps({
  modelValue: { type: Array, required: true }
})
const emit = defineEmits(['update:modelValue'])

const store = useCicloStore()
const mostrarDropdownResponsables = ref(false)

// Actúa como puente entre la prop del padre y los checkboxes locales
const responsables = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full relative">
    <label class="text-xs font-display font-bold text-morado dark:text-slate-200 uppercase tracking-wider">
      Responsable(s) de la Actividad
    </label>

    <!-- Botón que activa el dropdown -->
    <button
      type="button"
      @click="mostrarDropdownResponsables = !mostrarDropdownResponsables"
      class="w-full glass-input rounded-xl px-3 py-2 text-left text-slate-800 dark:text-slate-200 font-sans text-sm outline-none focus:ring-2 focus:ring-jade/30 transition-all cursor-pointer bg-white/70 dark:bg-slate-900/40 flex justify-between items-center"
    >
      <span class="truncate pr-4 font-semibold text-jade">
        {{ responsables.length > 0 ? responsables.join(', ') : 'Selecciona dirigente(s)...' }}
      </span>
      <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Menú desplegable flotante con checkboxes -->
    <div
      v-if="mostrarDropdownResponsables"
      @mouseleave="mostrarDropdownResponsables = false"
      class="dropdown-responsables absolute top-[65px] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gris-lavanda/30 dark:border-white/10 rounded-xl shadow-lg z-50 p-3 max-h-60 overflow-y-auto animate-fade-in"
    >
      <div class="flex justify-between items-center mb-2 pb-2 border-b border-gris-lavanda/20 dark:border-white/10">
        <span class="text-xs font-bold text-morado dark:text-slate-200 uppercase tracking-wide">
          Elegir responsables:
        </span>
        <button
          type="button"
          @click="mostrarDropdownResponsables = false"
          class="text-rose-500 hover:text-rose-700 font-bold px-1 text-xs cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <label
          v-for="dirigente in store.dirigentes"
          :key="dirigente"
          class="flex items-center gap-2 cursor-pointer hover:bg-jade/10 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
        >
          <input
            type="checkbox"
            :value="dirigente"
            v-model="responsables"
            class="w-4 h-4 text-jade rounded focus:ring-jade/50 border-gray-300 dark:border-slate-600 dark:bg-slate-900 cursor-pointer"
          />
          <span class="text-sm text-slate-700 dark:text-slate-200 font-medium select-none">{{ dirigente }}</span>
        </label>
        
        <span v-if="store.dirigentes.length === 0" class="text-xs text-slate-500 italic">
          Sin dirigentes. Añádelos en el menú principal.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>