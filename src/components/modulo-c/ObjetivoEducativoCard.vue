<script setup>
import { computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import { areasCrecimiento, objetivosPorRama, RAMAS } from '../../utils/areasCrecimiento.js'

const store = useCicloStore()

const props = defineProps({
  objetivo: { type: Object, required: true },
  numero: { type: Number, required: true }
})

const cambiarArea = () => {
  props.objetivo.media = ''
  props.objetivo.tardia = ''
}

const ramaActual = computed(() => store.rama || 'exploradores')
const infoRama = computed(() => RAMAS.find(r => r.id === ramaActual.value) ?? RAMAS[0])
const etapas = computed(() => infoRama.value.etapas)

const objetivosDelArea = computed(() => {
  if (!props.objetivo.area) return null
  return objetivosPorRama[ramaActual.value]?.[props.objetivo.area] ?? null
})
</script>

<template>
  <div class="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 p-4 rounded-xl space-y-4 transition-colors">
    <!-- Selector de Área -->
    <div class="flex flex-col gap-1.5 w-full">
      <label class="text-xs font-display font-bold text-morado dark:text-slate-200 uppercase tracking-wider">
        Área {{ numero }}
      </label>
      <div class="relative">
        <select
          v-model="objetivo.area"
          @change="cambiarArea"
          class="w-full bg-white/70 dark:bg-black/30 border border-gris-lavanda/30 dark:border-white/10 rounded-xl px-3 py-2 pr-8 text-slate-800 dark:text-slate-200 font-sans text-sm outline-none focus:ring-2 focus:ring-jade/30 transition-all cursor-pointer appearance-none"
        >
          <option value="" disabled>Selecciona un área...</option>
          <option v-for="area in areasCrecimiento" :key="area" :value="area">
            {{ area }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Selector Infancia Media -->
    <div v-for="etapa in etapas" :key="etapa.clave" class="space-y-1.5">
      <label class="text-[10px] font-bold text-jade uppercase">{{ etapa.etiqueta }}</label>
      <div class="relative">
        <select
          v-model="objetivo[etapa.clave]"
          :disabled="!objetivo.area || !objetivosDelArea"
          class="w-full bg-white/70 dark:bg-black/30 border border-gris-lavanda/30 dark:border-white/10 rounded-lg p-2 pr-8 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-jade outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        >
          <option value="" disabled>Selecciona objetivo</option>
          <option
            v-for="(opt, idx) in objetivosDelArea?.[etapa.clave] ?? []"
            :key="etapa.clave + idx"
            :value="opt"
            :title="opt"
          >
            {{ opt }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>