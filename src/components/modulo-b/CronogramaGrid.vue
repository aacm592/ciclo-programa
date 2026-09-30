<script setup>
import { computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassTextarea from '../common/GlassTextarea.vue'

const store = useCicloStore()

// Agrupamos en un ARRAY en lugar de un Objeto para garantizar estrictamente el orden cronológico
const mesesAgrupados = computed(() => {
  const grupos = []
  store.cronograma.forEach((sabado) => {
    let grupo = grupos.find((g) => g.mes === sabado.mes)
    if (!grupo) {
      grupo = { mes: sabado.mes, sabados: [] }
      grupos.push(grupo)
    }
    grupo.sabados.push(sabado)
  })
  return grupos
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex overflow-x-auto gap-6 pb-6 items-start snap-x">
      <!-- Iteramos sobre el grupo directamente -->
      <div
        v-for="grupo in mesesAgrupados"
        :key="grupo.mes"
        class="flex flex-col gap-3 min-w-[280px] max-w-[300px] flex-1 shrink-0 snap-start"
      >
        <!-- Cabecera del Mes -->
        <h3
          class="font-display font-bold text-morado tracking-wide uppercase border-b-2 border-jade pb-2"
        >
          {{ grupo.mes }}
        </h3>

        <!-- Tarjetas por cada Sábado -->
        <div
          v-for="sabado in grupo.sabados"
          :key="sabado.fecha"
          :class="[
            'rounded-xl p-3 border shadow-sm transition-all duration-300',
            sabado.cancelado
              ? 'bg-slate-100/60 border-slate-300/60'
              : 'bg-white/50 border-gris-lavanda/20'
          ]"
        >
          <div class="flex justify-between items-center mb-3">
            <p
              :class="[
                'text-xs font-bold',
                sabado.cancelado ? 'text-slate-400 line-through' : 'text-jade'
              ]"
            >
              {{ sabado.fecha }}
            </p>
            <button
              @click="sabado.cancelado = !sabado.cancelado"
              :class="[
                'text-[10px] font-bold px-2 py-1 rounded-md transition-colors cursor-pointer',
                sabado.cancelado
                  ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  : 'bg-gris-lavanda/10 text-gris-lavanda hover:bg-gris-lavanda/20'
              ]"
            >
              {{ sabado.cancelado ? 'Restaurar' : 'Cancelar reunión' }}
            </button>
          </div>

          <!-- Vista Activa -->
          <template v-if="!sabado.cancelado">
            <GlassTextarea
              v-model="sabado.actividad"
              placeholder="Actividad / Objetivo..."
              :rows="3"
            />
          </template>

          <!-- Vista Cancelada -->
          <template v-else>
            <div class="flex flex-col gap-1.5 pt-1 pb-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Sin Actividad
              </span>
              <input
                v-model="sabado.motivoCancelacion"
                type="text"
                placeholder="Motivo (ej. Campamento, feriado...)"
                class="w-full text-sm bg-white/60 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
