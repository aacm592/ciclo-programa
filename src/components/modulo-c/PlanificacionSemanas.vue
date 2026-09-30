<script setup>
import { ref, computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassInput from '../common/GlassInput.vue'
import GlassTextarea from '../common/GlassTextarea.vue'
import SelectorResponsables from './SelectorResponsables.vue'
import TablaHorario from './TablaHorario.vue'
import ObjetivoEducativoCard from './ObjetivoEducativoCard.vue'

const store = useCicloStore()
const indiceElegido = ref(0)

// Filtrar solo las reuniones que no han sido canceladas
const reuniones = computed(() => store.reunionesValidas)

// Prevenir errores si se cancela una reunión y el índice queda fuera de rango
const indiceActivo = computed(() =>
  indiceElegido.value < reuniones.value.length ? indiceElegido.value : 0
)

const reunion = computed(() => reuniones.value[indiceActivo.value] ?? null)
</script>

<template>
  <p v-if="reuniones.length === 0" class="semanas__vacio">
    No hay reuniones válidas (todas están canceladas o no hay cronograma).
  </p>

  <div v-else class="semanas">
    <!-- Pestañas de navegación -->
    <nav class="semanas__tabs">
      <button
        v-for="(item, index) in reuniones"
        :key="item.fecha"
        type="button"
        class="semanas__tab"
        :class="{ 'semanas__tab--activa': indiceActivo === index }"
        @click="indiceElegido = index"
      >
        Reunión {{ index + 1 }} ({{ item.fecha }})
      </button>
    </nav>

    <!-- Formularios de la reunión activa -->
    <div class="semanas__reunion" :key="reunion.fecha">
      
      <!-- Cabecera -->
      <div class="semanas__cabecera">
        <SelectorResponsables v-model="reunion.programa.responsables" />
        <GlassInput
          v-model="reunion.programa.objetivo"
          label="Objetivo Principal"
          placeholder="¿Qué queremos lograr hoy?"
        />
      </div>

      <!-- Tabla del Cronograma extraída -->
      <TablaHorario :horario="reunion.programa.horario" />

      <!-- Nota General -->
      <GlassTextarea
        v-model="reunion.programa.nota"
        label="NOTA"
        placeholder="Añadir cualquier nota relevante..."
        :rows="2"
      />

      <!-- Sección de Objetivos Educativos -->
      <section>
        <h4 class="semanas__titulo-objetivos">Contribuye a los siguientes Objetivos Educativos</h4>
        <div class="semanas__objetivos">
          <ObjetivoEducativoCard
            v-for="(objetivo, i) in reunion.programa.objetivosEducativos"
            :key="objetivo.id"
            :objetivo="objetivo"
            :numero="i + 1"
          />
        </div>
      </section>
      
    </div>
  </div>
</template>

<style scoped>
@reference "../../style.css";

.semanas {
  @apply flex flex-col gap-6;
}

.semanas__vacio {
  @apply p-8 text-center font-bold text-rose-500;
}

/* --- Pestañas --- */
.semanas__tabs {
  @apply flex overflow-x-auto gap-2 pb-2 border-b snap-x border-gris-lavanda/30 dark:border-white/10;
}

.semanas__tab {
  @apply whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-bold cursor-pointer snap-start transition-all;
  @apply bg-white/50 text-morado hover:bg-white/80;
  @apply dark:bg-black/30 dark:text-slate-300 dark:hover:bg-black/40;
}

.semanas__tab--activa {
  @apply bg-jade text-white shadow-md hover:bg-jade dark:bg-jade dark:text-white dark:hover:bg-jade;
}

/* --- Contenido de la reunión --- */
.semanas__reunion {
  @apply flex flex-col gap-8;
  animation: aparecer 0.3s ease-in-out;
}

@keyframes aparecer {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.semanas__cabecera {
  @apply bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl transition-colors;
}

.semanas__titulo-objetivos {
  @apply mb-3 font-display text-sm font-bold uppercase tracking-wide text-morado dark:text-slate-200;
}

.semanas__objetivos {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}
</style>