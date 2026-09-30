<script setup>
import { ref, computed } from 'vue'
import { useCicloStore } from './stores/cicloStore'
import { useTheme } from './composables/useTheme'
import { useExportarPDF } from './composables/useExportarPDF'
import { useExportarExcel } from './composables/useExportarExcel'
import { vistas } from './config/vistas'
import GlassCard from './components/common/GlassCard.vue'
import GlassButton from './components/common/GlassButton.vue'
import AppNavbar from './components/AppNavbar.vue'
import VistaImpresion from './components/visualizacion/VistaImpresion.vue'

const store = useCicloStore()
const { isDarkMode, toggleTheme } = useTheme()
const exportarPDF = useExportarPDF()
const exportarExcel = useExportarExcel()

const menuAbierto = ref(null)
const toggleMenu = (label) => { menuAbierto.value = menuAbierto.value === label ? null : label }

const vista = computed(() => vistas[store.vistaActual] ?? vistas.landing)
const propsVista = computed(() => (vista.value.pasaTema ? { isDarkMode: isDarkMode.value } : {}))

const fondo = computed(() =>
  isDarkMode.value
    ? { backgroundImage: 'url(./bg-landing.jpeg)' }
    : { backgroundColor: '#f8fafc', backgroundImage: 'url(./bg-light.jpeg)' },
)

const ejecutar = (accion) => accion.run({ store, exportarPDF, exportarExcel })
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
                <template v-for="accion in vista.acciones" :key="accion.label">
                  
                  <!-- Botón Estándar -->
                  <GlassButton
                    v-if="!accion.dropdown"
                    :variant="accion.variant"
                    @click="ejecutar(accion)"
                  >
                    {{ accion.label }}
                  </GlassButton>

                  <!-- Botón Desplegable -->
                  <div v-else class="relative">
                    <GlassButton :variant="accion.variant" @click="toggleMenu(accion.label)">
                      {{ accion.label }} ▾
                    </GlassButton>

                    <div
                      v-if="menuAbierto === accion.label"
                      @mouseleave="menuAbierto = null"
                        class="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-lg border border-gris-lavanda/30 dark:border-white/10 z-50 overflow-hidden flex flex-col"                    >
                      <button
                        v-for="opcion in accion.opciones"
                        :key="opcion.label"
                        @click="ejecutar(opcion); menuAbierto = null"
                        class="text-left px-4 py-3 text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border-b last:border-b-0 border-gris-lavanda/10 dark:border-white/5"
                        :class="opcion.colorClass || 'text-morado dark:text-white'"
                      >
                        {{ opcion.label }}
                      </button>
                    </div>
                  </div>

                </template>
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