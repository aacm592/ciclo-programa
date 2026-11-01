<script setup>
import { useCicloStore } from '../../stores/cicloStore'
import GlassInput from '../common/GlassInput.vue'

const store = useCicloStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="space-y-4">
      <GlassInput v-model="store.encabezado.distrito" label="Distrito" />
      <GlassInput v-model="store.encabezado.grupo" label="Grupo" />
      <GlassInput v-model="store.encabezado.tropa" label="Unidad" />
    </div>
    <div class="space-y-4">
      <GlassInput v-model="store.encabezado.cicloNumero" type="number" label="Ciclo N°" />
      <div>
        <div class="grid grid-cols-2 gap-4">
          <GlassInput v-model="store.encabezado.fechaInicio" type="date" label="Fecha Inicio" />
          <GlassInput v-model="store.encabezado.fechaFin" type="date" label="Fecha Fin" />
        </div>
        <!-- Mensaje de error que aparece solo cuando falla la validación al presionar el botón -->
        <p 
          v-if="store.errorGenerarSemanas" 
          class="text-xs font-semibold text-rose-500 mt-1.5 pl-1 animate-fade-in"
        >
          Debes llenar las fechas
        </p>
      </div>
    </div>
  </div>
</template>
