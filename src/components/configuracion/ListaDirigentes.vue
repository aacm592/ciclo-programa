<script setup>
import { ref } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'
import GlassCard from '../common/GlassCard.vue'
import GlassInput from '../common/GlassInput.vue'
import GlassButton from '../common/GlassButton.vue'

const store = useCicloStore()
const nuevoDirigente = ref('')

const agregarDirigente = () => {
  if (nuevoDirigente.value.trim() !== '') {
    store.dirigentes.push(nuevoDirigente.value.trim())
    nuevoDirigente.value = ''
  }
}

const eliminarDirigente = (index) => {
  store.dirigentes.splice(index, 1)
}
</script>

<template>
  <GlassCard title="Lista de Dirigentes" subtitle="Administra los responsables de la unidad">
    <div class="mt-4 space-y-6">
      <div class="flex gap-2">
        <div class="flex-1">
          <GlassInput
            v-model="nuevoDirigente"
            placeholder="Nombre del dirigente..."
            @keyup.enter="agregarDirigente"
          />
        </div>
        <GlassButton variant="primary" @click="agregarDirigente">Añadir</GlassButton>
      </div>

      <div v-if="store.dirigentes.length === 0" class="text-center text-slate-500 text-sm py-4">
        No hay dirigentes registrados. Añade uno arriba.
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="(dirigente, index) in store.dirigentes"
          :key="index"
          class="flex justify-between items-center bg-white/50 border border-gris-lavanda/20 p-3 rounded-lg"
        >
          <span class="font-bold text-morado">{{ dirigente }}</span>
          <button
            @click="eliminarDirigente(index)"
            class="text-rose-500 hover:text-rose-700 font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </li>
      </ul>
    </div>
  </GlassCard>
</template>
