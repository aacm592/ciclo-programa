<script setup>
import { useCicloStore } from '../../stores/cicloStore'
import GlassTextarea from '../common/GlassTextarea.vue'
import GlassInput from '../common/GlassInput.vue'

const store = useCicloStore()
</script>

<template>
  <div class="space-y-6">
    <GlassTextarea
      v-model="store.juegoDemocratico"
      label="Juego Democrático"
      placeholder="Describe la metodología utilizada para seleccionar las actividades..."
      :rows="4"
    />

    <div>
      <h4 class="font-display font-bold text-morado tracking-wide mb-4 uppercase text-xs">
        Actividades Seleccionadas
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassInput
          v-for="n in 3"
          :key="n"
          v-model="store.actividadesSeleccionadas[n - 1]"
          :placeholder="`Actividad ganadora ${n}`"
        />
      </div>
    </div>
  </div>
</template>
