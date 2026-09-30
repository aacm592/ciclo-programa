<script setup>
import { computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassTextarea from '../common/GlassTextarea.vue'

const store = useCicloStore()

// Un Map conserva el orden de inserción, así los meses quedan en orden cronológico
const mesesAgrupados = computed(() => {
  const grupos = new Map()
  for (const sabado of store.cronograma) {
    if (!grupos.has(sabado.mes)) grupos.set(sabado.mes, [])
    grupos.get(sabado.mes).push(sabado)
  }
  return [...grupos].map(([mes, sabados]) => ({ mes, sabados }))
})

const alternarCancelacion = (sabado) => {
  sabado.cancelado = !sabado.cancelado
}
</script>

<template>
  <div class="cronograma">
    <section v-for="grupo in mesesAgrupados" :key="grupo.mes" class="cronograma__mes">
      <h3 class="cronograma__mes-titulo">{{ grupo.mes }}</h3>

      <article
        v-for="sabado in grupo.sabados"
        :key="sabado.fecha"
        class="sabado"
        :class="{ 'sabado--cancelado': sabado.cancelado }"
      >
        <header class="sabado__cabecera">
          <p class="sabado__fecha">{{ sabado.fecha }}</p>
          <button type="button" class="sabado__toggle" @click="alternarCancelacion(sabado)">
            {{ sabado.cancelado ? 'Restaurar' : 'Cancelar reunión' }}
          </button>
        </header>

        <GlassTextarea
          v-if="!sabado.cancelado"
          v-model="sabado.actividad"
          placeholder="Actividad / Objetivo..."
          :rows="3"
        />

        <div v-else class="sabado__motivo">
          <span class="sabado__motivo-label">Sin Actividad</span>
          <input
            v-model="sabado.motivoCancelacion"
            type="text"
            placeholder="Motivo (ej. Campamento, feriado...)"
            class="sabado__motivo-input"
          />
        </div>
      </article>
    </section>
  </div>
</template>

<style>
/* Da acceso a los tokens (jade, morado...) y a la variante dark: de Tailwind */
@reference "../../style.css";

/* --- Contenedor: una columna por mes --- */
.cronograma {
  @apply flex items-start gap-6 overflow-x-auto pb-6 snap-x;
}

.cronograma__mes {
  @apply flex flex-col gap-3 flex-1 shrink-0 snap-start min-w-[280px] max-w-[300px];
}

.cronograma__mes-titulo {
  @apply font-display font-bold uppercase tracking-wide pb-2;
  @apply text-morado border-b-2 border-jade dark:text-white;
}

/* --- Tarjeta de cada sábado --- */
.sabado {
  @apply rounded-xl p-3 border shadow-sm transition-all duration-300;
  @apply bg-white/50 border-gris-lavanda/20 dark:bg-black/30 dark:border-white/10;
}

.sabado--cancelado {
  @apply bg-slate-100/60 border-slate-300/60 dark:bg-black/20 dark:border-white/10;
}

.sabado__cabecera {
  @apply flex justify-between items-center mb-3;
}

.sabado__fecha {
  @apply text-xs font-bold text-jade;
}

.sabado--cancelado .sabado__fecha {
  @apply text-slate-400 line-through;
}

.sabado__toggle {
  @apply text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition-colors;
  @apply bg-gris-lavanda/10 text-gris-lavanda hover:bg-gris-lavanda/20;
}

.sabado--cancelado .sabado__toggle {
  @apply bg-slate-200 text-slate-600 hover:bg-slate-300;
  @apply dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20;
}

/* --- Estado cancelado: motivo --- */
.sabado__motivo {
  @apply flex flex-col gap-1.5 pt-1 pb-2;
}

.sabado__motivo-label {
  @apply text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400;
}

.sabado__motivo-input {
  @apply w-full text-sm rounded-lg px-3 py-2 border border-slate-300 transition-all;
  @apply bg-white/60 text-slate-700 placeholder:text-slate-400;
  @apply focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50;
  @apply dark:bg-black/30 dark:text-slate-100;
}
</style>