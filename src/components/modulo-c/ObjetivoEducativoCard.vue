<script setup>
import { areasCrecimiento, objetivosPorArea } from '../../utils/areasCrecimiento.js'

const props = defineProps({
  objetivo: { type: Object, required: true },
  numero: { type: Number, required: true }
})

const cambiarArea = () => {
  props.objetivo.media = ''
  props.objetivo.tardia = ''
}
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
    <div class="space-y-1.5">
      <label class="text-[10px] font-bold text-jade uppercase">Infancia Media</label>
      <div class="relative">
        <select
          v-model="objetivo.media"
          :disabled="!objetivo.area || !objetivosPorArea[objetivo.area]"
          class="w-full bg-white/70 dark:bg-black/30 border border-gris-lavanda/30 dark:border-white/10 rounded-lg p-2 pr-8 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-jade outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        >
          <option value="" disabled>Selecciona objetivo</option>
          <option
            v-for="(opt, idx) in objetivosPorArea[objetivo.area]?.media"
            :key="'m' + idx"
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

    <!-- Selector Infancia Tardía -->
    <div class="space-y-1.5">
      <label class="text-[10px] font-bold text-jade uppercase">Infancia Tardía</label>
      <div class="relative">
        <select
          v-model="objetivo.tardia"
          :disabled="!objetivo.area || !objetivosPorArea[objetivo.area]"
          class="w-full bg-white/70 dark:bg-black/30 border border-gris-lavanda/30 dark:border-white/10 rounded-lg p-2 pr-8 text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-jade outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        >
          <option value="" disabled>Selecciona objetivo</option>
          <option
            v-for="(opt, idx) in objetivosPorArea[objetivo.area]?.tardia"
            :key="'t' + idx"
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