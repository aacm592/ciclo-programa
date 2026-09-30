<script setup>
import { ref, computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassInput from '../common/GlassInput.vue'
import GlassTextarea from '../common/GlassTextarea.vue'
import IconButton from '../common/IconButton.vue'
import { areasCrecimiento, objetivosPorArea } from '../../utils/areasCrecimiento.js'

const store = useCicloStore()

// Controla qué reunión estamos editando
const reunionActivaIndex = ref(0)
const mostrarDropdownResponsables = ref(false)

// Se recalcula automáticamente cada vez que cambien las reuniones o el índice
const reunionSeleccionada = computed(() => {
  return store.reunionesValidas[reunionActivaIndex.value] || store.reunionesValidas[0] || null
})
const agregarFilaHorario = () => {
  if (!reunionSeleccionada.value) return
  const filas = reunionSeleccionada.value.programa.horario
  const ultima = filas[filas.length - 1]
  const proximaHora =
    ultima && ultima.hora && ultima.duracion ? sumarMinutos(ultima.hora, ultima.duracion) : ''

  filas.push({
    id: Date.now(),
    hora: proximaHora,
    duracion: '',
    actividad: '',
    materiales: '',
    responsables: '',
    observaciones: ''
  })
}

const eliminarFilaHorario = (id) => {
  if (!reunionSeleccionada.value) return
  reunionSeleccionada.value.programa.horario = reunionSeleccionada.value.programa.horario.filter(
    (h) => h.id !== id
  )
}

// Suma minutos a una hora dada en formato HH:MM
const sumarMinutos = (horaStr, minutos) => {
  if (!horaStr || !horaStr.includes(':')) return ''
  const [h, m] = horaStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''

  const totalMin = (h * 60 + m + (parseInt(minutos) || 0)) % (24 * 60)
  const nuevasHoras = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const nuevosMin = String(totalMin % 60).padStart(2, '0')
  return `${nuevasHoras}:${nuevosMin}`
}

// Recalcula la hora de inicio de las siguientes filas
const recalcularHorarios = (indexActual) => {
  if (!reunionSeleccionada.value) return
  const filas = reunionSeleccionada.value.programa.horario
  for (let i = indexActual; i < filas.length - 1; i++) {
    const filaActual = filas[i]
    if (filaActual.hora && filaActual.duracion) {
      filas[i + 1].hora = sumarMinutos(filaActual.hora, filaActual.duracion)
    }
  }
}
</script>

<template>
  <div v-if="store.reunionesValidas.length === 0" class="text-center p-8 text-rose-500 font-bold">
    No hay reuniones válidas (todas están canceladas o no hay cronograma).
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
        Reunión {{ index + 1 }} ({{ reunion.fecha }})
      </button>
    </div>

    <!-- FORMULARIO DE LA REUNIÓN ACTIVA -->
    <div class="space-y-8 animate-fade-in" v-if="reunionSeleccionada">
      <!-- Cabecera de la Reunión -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/40 p-4 rounded-xl border border-white/60"
      >
        <!-- Selector de Responsables Múltiples -->
        <!-- Selector de Responsables Múltiples (Solo dirigentes existentes) -->
        <!-- Selector de Responsables Múltiples (Dropdown con Checkboxes) -->
        <div class="flex flex-col gap-1.5 w-full relative">
          <label class="text-xs font-display font-bold text-morado uppercase tracking-wider">
            Responsable(s) de la Actividad
          </label>

          <!-- Botón que activa el dropdown -->
          <button
            @click="mostrarDropdownResponsables = !mostrarDropdownResponsables"
            class="w-full glass-input rounded-xl px-3 py-2 text-left text-slate-800 font-sans text-sm outline-none focus:ring-2 focus:ring-jade/30 transition-all cursor-pointer bg-white/70 flex justify-between items-center"
          >
            <span class="truncate pr-4 font-semibold text-jade">
              {{
                reunionSeleccionada.programa.responsables.length > 0
                  ? reunionSeleccionada.programa.responsables.join(', ')
                  : 'Selecciona dirigente(s)...'
              }}
            </span>
            <svg
              class="w-4 h-4 text-slate-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <!-- Menú desplegable flotante con checkboxes -->
          <div
            v-if="mostrarDropdownResponsables"
            class="dropdown-responsables absolute top-[65px] left-0 w-full bg-white/95 backdrop-blur-md border border-gris-lavanda/30 rounded-xl shadow-lg z-50 p-3 max-h-60 overflow-y-auto animate-fade-in"
          >
            <div
              class="flex justify-between items-center mb-2 pb-2 border-b border-gris-lavanda/20"
            >
              <span class="text-xs font-bold text-morado uppercase tracking-wide"
                >Elegir responsables:</span
              >
              <button
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
                class="flex items-center gap-2 cursor-pointer hover:bg-jade/10 p-1.5 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  :value="dirigente"
                  v-model="reunionSeleccionada.programa.responsables"
                  class="w-4 h-4 text-jade rounded focus:ring-jade/50 border-gray-300 cursor-pointer"
                />
                <span class="text-sm text-slate-700 font-medium select-none">{{ dirigente }}</span>
              </label>
              <span v-if="store.dirigentes.length === 0" class="text-xs text-slate-500 italic"
                >Sin dirigentes. Añádelos en el menú principal.</span
              >
            </div>
          </div>
        </div>

        <GlassInput
          v-model="reunionSeleccionada.programa.objetivo"
          label="Objetivo Principal"
          placeholder="¿Qué queremos lograr hoy?"
        />
      </div>

      <!-- Cronograma del Día -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-display font-bold text-morado tracking-wide">
            CRONOGRAMA DE ACTIVIDADES
          </h4>
          <IconButton action="add" @click="agregarFilaHorario" />
        </div>

        <div class="overflow-x-auto rounded-xl border border-gris-lavanda/20 bg-white/30">
          <table class="w-full text-sm text-left">
            <thead
              class="text-xs text-morado uppercase bg-white/50 border-b border-gris-lavanda/20"
            >
              <tr>
                <th class="px-3 py-2 w-24">Hora</th>
                <th class="px-3 py-2 w-24">Dur.</th>
                <th class="px-3 py-2 min-w-[200px]">Actividad</th>
                <th class="px-3 py-2">Materiales</th>
                <th class="px-3 py-2">Responsables</th>
                <th class="px-3 py-2">Observaciones</th>
                <th class="px-3 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gris-lavanda/10">
              <tr
                v-for="(fila, index) in reunionSeleccionada.programa.horario"
                :key="fila.id"
                class="hover:bg-white/40 transition-colors"
              >
                <!-- Hora: editable con cálculo hacia adelante si se altera manualmente -->
                <td class="p-1">
                  <input
                    v-model="fila.hora"
                    @input="recalcularHorarios(index)"
                    type="time"
                    class="w-full bg-transparent border-none p-2 text-xs font-semibold text-morado focus:ring-1 focus:ring-jade rounded cursor-pointer"
                  />
                </td>
                <!-- Duración: ingresada solo como número en minutos -->
                <td class="p-1">
                  <div class="flex items-center gap-1">
                    <input
                      v-model="fila.duracion"
                      @input="recalcularHorarios(index)"
                      type="number"
                      min="1"
                      placeholder="15"
                      class="w-16 bg-transparent border-none p-2 text-xs font-semibold focus:ring-1 focus:ring-jade rounded text-right"
                    />
                    <span class="text-[11px] text-slate-500 font-medium select-none pr-1">min</span>
                  </div>
                </td>
                <td class="p-1">
                  <input
                    v-model="fila.actividad"
                    class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded"
                    placeholder="Juego o dinámica..."
                  />
                </td>
                <td class="p-1">
                  <input
                    v-model="fila.materiales"
                    class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded"
                    placeholder="Balón, cuerdas..."
                  />
                </td>
                <td class="p-1 min-w-[140px]">
                  <!-- Modo "Otro": Input de texto -->
                  <div v-if="fila.isOtro" class="flex items-center gap-1">
                    <input
                      v-model="fila.responsables"
                      type="text"
                      class="w-full bg-white border border-jade/50 p-1.5 focus:ring-1 focus:ring-jade rounded text-xs"
                      placeholder="Nombre..."
                    />
                    <button
                      @click="
                        fila.isOtro = false;
                        fila.responsables = ''
                      "
                      class="text-rose-500 hover:text-rose-700 font-bold px-1"
                      title="Volver a la lista"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- Modo Normal: Combobox -->
                  <select
                    v-else
                    v-model="fila.responsables"
                    @change="
                      if ($event.target.value === 'OTRO') {
                        fila.isOtro = true;
                        fila.responsables = ''
                      }
                    "
                    class="w-full bg-transparent border-none p-1.5 focus:ring-1 focus:ring-jade rounded text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="" disabled>Elegir...</option>
                    <option
                      v-for="dirigente in store.dirigentes"
                      :key="dirigente"
                      :value="dirigente"
                    >
                      {{ dirigente }}
                    </option>
                    <option value="OTRO" class="font-bold">Otro (escribir)...</option>
                  </select>
                </td>
                <td class="p-1 align-top">
                  <textarea
                    v-model="fila.observaciones"
                    class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded resize-y min-h-[38px] text-xs"
                    placeholder="..."
                    rows="1"
                  ></textarea>
                </td>
                <td class="p-1 text-center">
                  <button
                    @click="eliminarFilaHorario(fila.id)"
                    class="text-rose-500 hover:text-rose-700 font-bold px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nota General -->
      <GlassTextarea
        v-model="reunionSeleccionada.programa.nota"
        label="NOTA"
        placeholder="Añadir cualquier nota relevante..."
        :rows="2"
      />

      <!-- Objetivos Educativos -->
      <div>
        <h4 class="font-display font-bold text-morado tracking-wide mb-3 uppercase text-sm">
          Contribuye a los siguientes Objetivos Educativos
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(obj, i) in reunionSeleccionada.programa.objetivosEducativos"
            :key="obj.id"
            class="bg-white/40 p-4 rounded-xl border border-white/60 space-y-4"
          >
            <!-- Selector de Área -->
            <div class="flex flex-col gap-1.5 w-full">
              <label class="text-xs font-display font-bold text-morado uppercase tracking-wider">
                Área {{ i + 1 }}
              </label>
              <div class="relative">
                <select
                  v-model="obj.area"
                  @change="
                    obj.media = '';
                    obj.tardia = ''
                  "
                  class="w-full glass-input rounded-xl px-3 py-2 pr-8 text-slate-800 font-sans text-sm outline-none focus:ring-2 focus:ring-jade/30 transition-all cursor-pointer appearance-none bg-white/70"
                >
                  <option value="" disabled>Selecciona un área...</option>
                  <option v-for="area in areasCrecimiento" :key="area" :value="area">
                    {{ area }}
                  </option>
                </select>
                <!-- Icono de flecha -->
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Selector Infancia Media -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-jade uppercase">Infancia Media</label>
              <div class="relative">
                <select
                  v-model="obj.media"
                  :disabled="!obj.area || !objetivosPorArea[obj.area]"
                  class="w-full bg-white/70 border border-gris-lavanda/30 rounded-lg p-2 pr-8 text-xs text-slate-700 focus:ring-2 focus:ring-jade outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona objetivo</option>
                  <option
                    v-for="(opt, idx) in objetivosPorArea[obj.area]?.media"
                    :key="'m' + idx"
                    :value="opt"
                    :title="opt"
                  >
                    {{ opt }}
                  </option>
                </select>
                <!-- Icono de flecha -->
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Selector Infancia Tardía -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-jade uppercase">Infancia Tardía</label>
              <div class="relative">
                <select
                  v-model="obj.tardia"
                  :disabled="!obj.area || !objetivosPorArea[obj.area]"
                  class="w-full bg-white/70 border border-gris-lavanda/30 rounded-lg p-2 pr-8 text-xs text-slate-700 focus:ring-2 focus:ring-jade outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona objetivo</option>
                  <option
                    v-for="(opt, idx) in objetivosPorArea[obj.area]?.tardia"
                    :key="'t' + idx"
                    :value="opt"
                    :title="opt"
                  >
                    {{ opt }}
                  </option>
                </select>
                <!-- Icono de flecha -->
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
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
