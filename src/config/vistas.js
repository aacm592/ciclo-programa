import LandingMenu from '../components/LandingMenu.vue'
import ListaDirigentes from '../components/configuracion/ListaDirigentes.vue'
import PlanificacionCiclo from '../components/modulo-a/PlanificacionCiclo.vue'
import CronogramaGrid from '../components/modulo-b/CronogramaGrid.vue'
import PlanificacionSemanas from '../components/modulo-c/PlanificacionSemanas.vue'
import EvaluacionReunion from '../components/modulo-c/EvaluacionReunion.vue'

/**
 * Cada vista se describe con datos:
 * - component:   componente a renderizar
 * - card:        si va dentro de un GlassCard (con title/subtitle/acciones)
 * - pasaTema:    si el componente recibe la prop `isDarkMode`
 * - wrapperClass: clases del contenedor (solo vistas sin card)
 * - acciones:    botones del header; `run` recibe { store, exportarPDF }
 */
const exportar = {
  label: 'Exportar / Imprimir PDF',
  variant: 'primary',
  run: ({ exportarPDF }) => exportarPDF()
}

export const vistas = {
  landing: {
    component: LandingMenu,
    pasaTema: true
  },

  dirigentes: {
    component: ListaDirigentes,
    wrapperClass: 'max-w-2xl mx-auto'
  },

  evaluacion: {
    component: EvaluacionReunion,
    card: true,
    title: 'Módulo C.2: Evaluación de Reunión',
    subtitle: 'Revisión de objetivos y cumplimiento',
    acciones: [
      { label: 'Atrás', variant: 'ghost', run: ({ store }) => (store.vistaActual = 'moduloB') },
      {
        label: 'Exportar',
        variant: 'primary',
        dropdown: true, // Esto le dice a App.vue que dibuje el menú
        opciones: [
          {
            label: 'Como PDF',
            run: ({ exportarPDF }) => exportarPDF()
          },
          {
            label: 'Como Excel',
            colorClass: 'text-jade dark:text-jade',
            run: ({ store, exportarExcel }) => exportarExcel(store)
          }
        ]
      }
    ]
  },

  moduloA: {
    component: PlanificacionCiclo,
    card: true,
    title: 'Módulo A: Planificación del Ciclo',
    subtitle: 'Definición de objetivos y actividades',
    acciones: [
      {
        label: 'Siguiente: Cronograma',
        variant: 'primary',
        run: ({ store }) => store.generarSemanas()
      }
    ]
  },

  moduloB: {
    component: CronogramaGrid,
    card: true,
    title: 'Módulo B: Cronograma de Actividades',
    subtitle: 'Planificación de reuniones sabatinas',
    acciones: [
      { label: 'Atrás', variant: 'ghost', run: ({ store }) => store.volverModuloA() },
      {
        label: 'Siguiente: Planificar Sábados',
        variant: 'primary',
        run: ({ store }) => store.irAModuloC()
      }
    ]
  },

  moduloC: {
    component: PlanificacionSemanas,
    card: true,
    title: 'Módulo C: Planificación Semanal',
    subtitle: 'Diseño del programa para cada sábado',
    acciones: [
      { label: 'Atrás', variant: 'ghost', run: ({ store }) => (store.vistaActual = 'moduloB') },
      {
        label: 'Exportar',
        variant: 'primary',
        dropdown: true, // Esto le dice a App.vue que dibuje el menú
        opciones: [
          {
            label: 'Como PDF',
            run: ({ exportarPDF }) => exportarPDF()
          },
          {
            label: 'Como Excel',
            colorClass: 'text-jade dark:text-jade',
            run: ({ store, exportarExcel }) => exportarExcel(store)
          }
        ]
      }
    ]
  }
}
