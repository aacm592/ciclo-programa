<script setup>
import { useCicloStore } from './stores/cicloStore'
import GlassCard from './components/common/GlassCard.vue'
import GlassButton from './components/common/GlassButton.vue'
import EncabezadoForm from './components/modulo-a/EncabezadoForm.vue'
import DiagnosticoEnfasis from './components/modulo-a/DiagnosticoEnfasis.vue'
import SeleccionActividades from './components/modulo-a/SeleccionActividades.vue'
import CronogramaGrid from './components/modulo-b/CronogramaGrid.vue'
import PlanificacionSemanas from './components/modulo-c/PlanificacionSemanas.vue'
import { ref, onMounted, watch } from 'vue'
import VistaImpresion from './components/visualizacion/VistaImpresion.vue'
import LandingMenu from './components/LandingMenu.vue'
import ListaDirigentes from './components/configuracion/ListaDirigentes.vue'
import EvaluacionReunion from './components/modulo-c/EvaluacionReunion.vue'
import AppNavbar from './components/AppNavbar.vue'

const store = useCicloStore()

const isDarkMode = ref(false)

onMounted(() => {
  isDarkMode.value = localStorage.getItem('theme') === 'dark'
  if (isDarkMode.value) document.documentElement.classList.add('dark')
})

watch(isDarkMode, (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
})

const exportarPDF = () => {
  if (store.cronograma.length === 0) {
    alert('Primero debes generar el cronograma en el Módulo B antes de exportar el documento.')
    return
  }
  window.print()
}
</script>

<template>
  <div
    class="no-print min-h-screen bg-cover bg-center bg-fixed transition-colors duration-500 p-6 md:p-10"
    :style="
      isDarkMode
        ? { backgroundImage: 'url(./bg-landing.jpeg)' }
        : { backgroundColor: '#f8fafc', backgroundImage: 'url(./bg-light.jpeg)' }
    "
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Cabecera de la Aplicación -->
      <!-- NAVBAR EXTERNALIZADO -->
      <AppNavbar :is-dark-mode="isDarkMode" @toggle-theme="isDarkMode = !isDarkMode" />

      <!-- CONTENEDOR CON TRANSICIÓN SUAVE -->
      <transition name="fade-slide" mode="out-in">
        <div :key="store.vistaActual">
          <!-- VISTA: LANDING PAGE -->
          <LandingMenu v-if="store.vistaActual === 'landing'" :is-dark-mode="isDarkMode" />

          <!-- VISTA: DIRIGENTES -->
          <div v-else-if="store.vistaActual === 'dirigentes'" class="max-w-2xl mx-auto">
            <ListaDirigentes />
          </div>

          <!-- VISTA: EVALUACIÓN -->
          <GlassCard
            v-else-if="store.vistaActual === 'evaluacion'"
            title="Módulo C.2: Evaluación de Reunión"
            subtitle="Revisión de objetivos y cumplimiento"
          >
            <div class="mt-6">
              <EvaluacionReunion />
            </div>
            <template #header-actions>
              <div class="flex gap-3">
                <GlassButton variant="ghost" @click="store.vistaActual = 'landing'"
                  >Volver al Menú</GlassButton
                >
                <GlassButton variant="primary" @click="exportarPDF"
                  >Exportar / Imprimir PDF</GlassButton
                >
              </div>
            </template>
          </GlassCard>

          <!-- VISTA: MÓDULO A -->
          <GlassCard
            v-else-if="store.vistaActual === 'moduloA'"
            title="Módulo A: Planificación del Ciclo"
            subtitle="Definición de objetivos y actividades"
          >
            <div class="space-y-10 mt-6">
              <section><EncabezadoForm /></section>
              <hr class="border-gris-lavanda/20" />
              <section><DiagnosticoEnfasis /></section>
              <hr class="border-gris-lavanda/20" />
              <section><SeleccionActividades /></section>
            </div>

            <template #header-actions>
              <GlassButton variant="primary" @click="store.generarSemanas">
                Siguiente: Cronograma
              </GlassButton>
            </template>
          </GlassCard>

          <!-- VISTA: MÓDULO B -->
          <GlassCard
            v-else-if="store.vistaActual === 'moduloB'"
            title="Módulo B: Cronograma de Actividades"
            subtitle="Planificación de reuniones sabatinas"
          >
            <div class="mt-6">
              <CronogramaGrid />
            </div>

            <template #header-actions>
              <div class="flex gap-3">
                <GlassButton variant="ghost" @click="store.volverModuloA">Atrás</GlassButton>
                <GlassButton variant="primary" @click="store.irAModuloC"
                  >Siguiente: Planificar Sábados</GlassButton
                >
              </div>
            </template>
          </GlassCard>

          <!-- VISTA: MÓDULO C (PROGRAMAS) -->
          <GlassCard
            v-else-if="store.vistaActual === 'moduloC'"
            title="Módulo C: Planificación Semanal"
            subtitle="Diseño del programa para cada sábado"
          >
            <div class="mt-6">
              <PlanificacionSemanas />
            </div>

            <template #header-actions>
              <div class="flex gap-3">
                <GlassButton variant="ghost" @click="store.vistaActual = 'moduloB'"
                  >Atrás</GlassButton
                >
                <GlassButton variant="primary" @click="exportarPDF">
                  Exportar / Imprimir PDF
                </GlassButton>
              </div>
            </template>
          </GlassCard>
        </div>
      </transition>
    </div>
  </div>

  <!-- Vista que solo se procesa para el PDF -->
  <div class="print-only">
    <VistaImpresion />
  </div>
</template>
