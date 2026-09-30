<script setup>
import { computed } from 'vue'
import { useCicloStore } from './stores/cicloStore'
import { useTheme } from './composables/useTheme'
import { useExportarPDF } from './composables/useExportarPDF'
import { vistas } from './config/vistas'
import GlassCard from './components/common/GlassCard.vue'
import GlassButton from './components/common/GlassButton.vue'
import AppNavbar from './components/AppNavbar.vue'
import VistaImpresion from './components/visualizacion/VistaImpresion.vue'

const store = useCicloStore()
const { isDarkMode, toggleTheme } = useTheme()
const exportarPDF = useExportarPDF()

const vista = computed(() => vistas[store.vistaActual] ?? vistas.landing)
const propsVista = computed(() => (vista.value.pasaTema ? { isDarkMode: isDarkMode.value } : {}))

const fondo = computed(() =>
  isDarkMode.value
    ? { backgroundImage: 'url(./bg-landing.jpeg)' }
    : { backgroundColor: '#f8fafc', backgroundImage: 'url(./bg-light.jpeg)' },
)

const ejecutar = (accion) => accion.run({ store, exportarPDF })
</script>

<template>
  <div
    class="no-print min-h-screen bg-cover bg-center bg-fixed transition-colors duration-500 p-6 md:p-10"
    :style="fondo"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <AppNavbar :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />

      <transition name="fade-slide" mode="out-in">
        <div :key="store.vistaActual">
          <GlassCard v-if="vista.card" :title="vista.title" :subtitle="vista.subtitle">
            <div class="mt-6">
              <component :is="vista.component" />
            </div>

            <template #header-actions>
              <div class="flex gap-3">
                <GlassButton
                  v-for="accion in vista.acciones"
                  :key="accion.label"
                  :variant="accion.variant"
                  @click="ejecutar(accion)"
                >
                  {{ accion.label }}
                </GlassButton>
              </div>
            </template>
          </GlassCard>

          <div v-else :class="vista.wrapperClass">
            <component :is="vista.component" v-bind="propsVista" />
          </div>
        </div>
      </transition>
    </div>
  </div>

  <!-- Solo se procesa para el PDF -->
  <div class="print-only">
    <VistaImpresion />
  </div>
</template>