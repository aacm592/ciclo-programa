<script setup>
import { useCicloStore } from '../../stores/cicloStore'
import IconButton from '../common/IconButton.vue'

const props = defineProps({
  horario: { type: Array, required: true }
})

const store = useCicloStore()

const sumarMinutos = (horaStr, minutos) => {
  if (!horaStr || !horaStr.includes(':')) return ''
  const [h, m] = horaStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''

  const totalMin = (h * 60 + m + (parseInt(minutos) || 0)) % (24 * 60)
  const nuevasHoras = String(Math.floor(totalMin / 60)).padStart(2, '0')
  const nuevosMin = String(totalMin % 60).padStart(2, '0')
  return `${nuevasHoras}:${nuevosMin}`
}

const recalcularHorarios = (indexActual) => {
  for (let i = indexActual; i < props.horario.length - 1; i++) {
    const filaActual = props.horario[i]
    if (filaActual.hora && filaActual.duracion) {
      props.horario[i + 1].hora = sumarMinutos(filaActual.hora, filaActual.duracion)
    }
  }
}

const agregarFila = () => {
  const ultima = props.horario[props.horario.length - 1]
  const proximaHora = ultima && ultima.hora && ultima.duracion 
    ? sumarMinutos(ultima.hora, ultima.duracion) 
    : ''

  props.horario.push({
    id: Date.now(),
    hora: proximaHora,
    duracion: '',
    actividad: '',
    materiales: '',
    responsables: '',
    observaciones: ''
  })
}

// Usamos splice en lugar de filter para no romper la reactividad de la prop en el padre
const eliminarFila = (id) => {
  const index = props.horario.findIndex(h => h.id === id)
  if (index !== -1) {
    props.horario.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-display font-bold text-morado dark:text-slate-200 tracking-wide">
        CRONOGRAMA DE ACTIVIDADES
      </h4>
      <IconButton action="add" @click="agregarFila" />
    </div>

    <div class="overflow-x-auto rounded-xl border border-gris-lavanda/20 dark:border-white/10 bg-white/30 dark:bg-slate-900/40 shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-morado dark:text-slate-200 uppercase bg-white/50 dark:bg-black/40 border-b border-gris-lavanda/20 dark:border-white/10">
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
        <tbody class="divide-y divide-gris-lavanda/10 dark:divide-white/10">
          <tr
            v-for="(fila, index) in horario"
            :key="fila.id"
            class="hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
          >
            <td class="p-1">
              <input
                v-model="fila.hora"
                @input="recalcularHorarios(index)"
                type="time"
                class="w-full bg-transparent border-none p-2 text-xs font-semibold text-morado dark:text-white focus:ring-1 focus:ring-jade rounded cursor-pointer outline-none"
              />
            </td>
            <td class="p-1">
              <div class="flex items-center gap-1">
                <input
                  v-model="fila.duracion"
                  @input="recalcularHorarios(index)"
                  type="number"
                  min="1"
                  placeholder="15"
                  class="w-16 bg-transparent border-none p-2 text-xs font-semibold dark:text-white focus:ring-1 focus:ring-jade rounded text-right outline-none"
                />
                <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium select-none pr-1">min</span>
              </div>
            </td>
            <td class="p-1">
              <input
                v-model="fila.actividad"
                class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded dark:text-white dark:placeholder:text-slate-500 outline-none"
                placeholder="Juego o dinámica..."
              />
            </td>
            <td class="p-1">
              <input
                v-model="fila.materiales"
                class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded dark:text-white dark:placeholder:text-slate-500 outline-none"
                placeholder="Balón, cuerdas..."
              />
            </td>
            <td class="p-1 min-w-[140px]">
              <div v-if="fila.isOtro" class="flex items-center gap-1">
                <input
                  v-model="fila.responsables"
                  type="text"
                  class="w-full bg-white dark:bg-black/40 border border-jade/50 dark:border-jade/30 p-1.5 focus:ring-1 focus:ring-jade rounded text-xs dark:text-white outline-none"
                  placeholder="Nombre..."
                />
                <button
                  type="button"
                  @click="fila.isOtro = false; fila.responsables = ''"
                  class="text-rose-500 hover:text-rose-700 font-bold px-1 outline-none"
                  title="Volver a la lista"
                >
                  ✕
                </button>
              </div>
              <select
                v-else
                v-model="fila.responsables"
                @change="$event.target.value === 'OTRO' && (fila.isOtro = true, fila.responsables = '')"
                class="w-full bg-transparent border-none p-1.5 focus:ring-1 focus:ring-jade rounded text-xs text-slate-700 dark:text-slate-200 cursor-pointer outline-none"
              >
                <option value="" disabled>Elegir...</option>
                <option v-for="dirigente in store.dirigentes" :key="dirigente" :value="dirigente">
                  {{ dirigente }}
                </option>
                <option value="OTRO" class="font-bold">Otro (escribir)...</option>
              </select>
            </td>
            <td class="p-1 align-top">
              <textarea
                v-model="fila.observaciones"
                class="w-full bg-transparent border-none p-2 focus:ring-1 focus:ring-jade rounded resize-y min-h-[38px] text-xs dark:text-white dark:placeholder:text-slate-500 outline-none"
                placeholder="..."
                rows="1"
              ></textarea>
            </td>
            <td class="p-1 text-center">
              <button
                type="button"
                @click="eliminarFila(fila.id)"
                class="text-rose-500 hover:text-rose-700 font-bold px-2 cursor-pointer outline-none"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>