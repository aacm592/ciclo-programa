<!-- Modal de selección de rama al crear un ciclo -->
<script setup>
import { RAMAS } from '../../utils/areasCrecimiento'

defineProps({ show: Boolean })
defineEmits(['seleccionar', 'cancelar'])

const estilosRama = {
  lobatos:     'border-amber-400/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:border-amber-400',
  exploradores:'border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:border-blue-400',
  pioneros:    'border-rose-400/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 hover:border-rose-400',
  rovers:      'border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400',
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div class="bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-5">
        <h3 class="text-xl font-bold font-display text-morado dark:text-white text-center tracking-tight">
          ¿A qué rama corresponde este ciclo?
        </h3>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="r in RAMAS" :key="r.id"
            type="button"
            @click="$emit('seleccionar', r.id)"
            :class="[
              'p-3.5 rounded-2xl border font-bold text-sm text-center transition-all cursor-pointer shadow-sm active:scale-[0.98]',
              estilosRama[r.id] || 'border-slate-300 text-slate-700 dark:text-slate-200'
            ]"
          >{{ r.nombre }}</button>
        </div>
        <button
          type="button"
          @click="$emit('cancelar')"
          class="w-full text-center text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 pt-1 cursor-pointer transition-colors"
        >Cancelar</button>
      </div>
    </div>
  </Teleport>
</template>

