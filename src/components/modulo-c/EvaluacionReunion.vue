<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassTextarea from '../common/GlassTextarea.vue'

const store = useCicloStore()
const reunionActivaIndex = ref(0)
const reunionSeleccionada = ref(null)

onMounted(() => {
  if (store.reunionesValidas.length > 0) {
    // Detectar si hoy es día de reunión para auto-seleccionar la pestaña
    const hoy = new Date()
    const fechaHoyStr = `${hoy.getDate()}-${hoy.getMonth() + 1}-${hoy.getFullYear().toString().slice(-2)}`

    const indexHoy = store.reunionesValidas.findIndex((r) => r.fecha === fechaHoyStr)
    if (indexHoy !== -1) {
      reunionActivaIndex.value = indexHoy
    }

    seleccionarReunion(reunionActivaIndex.value)
  }
})

const seleccionarReunion = (index) => {
  reunionActivaIndex.value = index
  const reunion = store.reunionesValidas[index]

  // Parche de seguridad por si es una reunión vieja sin el objeto evaluación
  if (!reunion.programa.evaluacion) {
    reunion.programa.evaluacion = {
      cumplePrograma: '',
      cumpleObjetivo: '',
      contribuyeObjetivos: '',
      coherenciaEnfasis: ''
    }
  }

  reunionSeleccionada.value = reunion
}

watch(reunionActivaIndex, (newIndex) => {
  seleccionarReunion(newIndex)
})
</script>

<template>
  <div v-if="store.reunionesValidas.length === 0" class="text-center p-8 text-rose-500 font-bold">
    No hay reuniones válidas para evaluar.
  </div>

  <div v-else class="space-y-6">
    <!-- PESTAÑAS DE NAVEGACIÓN -->
    <div class="flex overflow-x-auto gap-2 pb-2 border-b border-gris-lavanda/30 snap-x">
      <button
        v-for="(reunion, index) in store.reunionesValidas"
        :key="reunion.fecha"
        @click="reunionActivaIndex = index"
        :class="[
          'whitespace-nowrap px-4 py-2 rounded-t-lg font-bold text-sm transition-all snap-start',
          reunionActivaIndex === index
            ? 'bg-jade text-white shadow-md'
            : 'bg-white/50 text-morado hover:bg-white/80'
        ]"
      >
        Evaluación {{ index + 1 }} ({{ reunion.fecha }})
      </button>
    </div>

    <!-- CONTENIDO: RESUMEN Y CUESTIONARIO -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" v-if="reunionSeleccionada">
      <!-- COLUMNA IZQUIERDA: RESUMEN COMPACTO -->
      <div
        class="lg:col-span-1 bg-white/40 p-5 rounded-xl border border-white/60 space-y-4 shadow-sm h-fit"
      >
        <h4
          class="font-display font-black text-morado tracking-wide uppercase border-b border-gris-lavanda/20 pb-2"
        >
          Resumen Planificado
        </h4>

        <div class="space-y-2">
          <p class="text-xs font-bold text-jade uppercase">Objetivo Principal:</p>
          <p class="text-sm text-slate-700 italic bg-white/50 p-2 rounded">
            {{ reunionSeleccionada.programa.objetivo || 'Sin objetivo definido' }}
          </p>
        </div>

        <div class="space-y-2 pt-2">
          <p class="text-xs font-bold text-jade uppercase">Cronograma Resumido:</p>
          <ul class="space-y-2">
            <li
              v-for="fila in reunionSeleccionada.programa.horario"
              :key="fila.id"
              class="text-[11px] bg-white/60 p-2 rounded-lg border border-gris-lavanda/20 flex gap-2"
            >
              <span class="font-bold text-morado min-w-[35px]">{{ fila.hora }}</span>
              <div class="flex-1">
                <p class="font-semibold text-slate-800">
                  {{ fila.actividad || 'Actividad sin nombre' }}
                </p>
                <p class="text-[10px] text-slate-500 line-clamp-1">
                  Resp: {{ fila.responsables || 'N/A' }} | {{ fila.duracion }} min
                </p>
              </div>
            </li>
          </ul>
        </div>
        <!-- Objetivos Educativos (NUEVO) -->
        <div class="space-y-2 pt-2 border-t border-gris-lavanda/20 mt-2">
          <p class="text-xs font-bold text-jade uppercase">Objetivos Educativos:</p>
          <div class="space-y-1.5">
            <div
              v-for="(obj, i) in reunionSeleccionada.programa.objetivosEducativos"
              :key="obj.id"
              class="text-[11px] bg-white/60 p-2 rounded-lg border border-gris-lavanda/20"
            >
              <template v-if="obj.area">
                <p class="font-bold text-morado border-b border-gris-lavanda/20 pb-1 mb-1">
                  {{ obj.area }}
                </p>
                <p v-if="obj.media" class="text-[10px] text-slate-700 leading-tight">
                  <span class="font-bold text-jade">Media:</span> {{ obj.media }}
                </p>
                <p v-if="obj.tardia" class="text-[10px] text-slate-700 leading-tight mt-0.5">
                  <span class="font-bold text-jade">Tardía:</span> {{ obj.tardia }}
                </p>
                <p v-if="!obj.media && !obj.tardia" class="text-[10px] text-slate-400 italic">
                  Sin metas específicas
                </p>
              </template>
              <template v-else>
                <p class="text-[10px] text-slate-400 italic">Área {{ i + 1 }} no definida</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: FORMULARIO DE EVALUACIÓN -->
      <div
        class="lg:col-span-2 bg-white/40 p-5 rounded-xl border border-white/60 space-y-5 shadow-sm"
      >
        <h4 class="font-display font-black text-morado tracking-wide uppercase mb-4">
          Cuestionario de Evaluación
        </h4>

        <GlassTextarea
          v-model="reunionSeleccionada.programa.evaluacion.cumplePrograma"
          label="¿Se cumple el programa?"
          placeholder="Justifica si se lograron completar las actividades planificadas..."
          :rows="2"
        />
        <GlassTextarea
          v-model="reunionSeleccionada.programa.evaluacion.cumpleObjetivo"
          label="¿Se cumple el objetivo de la actividad principal?"
          placeholder="Detalla si los jóvenes alcanzaron la meta propuesta..."
          :rows="2"
        />
        <GlassTextarea
          v-model="reunionSeleccionada.programa.evaluacion.contribuyeObjetivos"
          label="¿Se logra contribuir al desarrollo de los objetivos educativos?"
          placeholder="Menciona cómo las áreas de crecimiento se vieron reflejadas..."
          :rows="2"
        />
        <GlassTextarea
          v-model="reunionSeleccionada.programa.evaluacion.coherenciaEnfasis"
          label="¿Las actividades guardaron coherencia con el énfasis?"
          placeholder="Explica la relación entre la reunión y el énfasis del ciclo..."
          :rows="2"
        />
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
