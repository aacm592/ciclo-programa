import LandingMenu from '../components/LandingMenu.vue'
import ListaDirigentes from '../components/configuracion/ListaDirigentes.vue'
import PlanificacionCiclo from '../components/modulo-a/PlanificacionCiclo.vue'
import CronogramaGrid from '../components/modulo-b/CronogramaGrid.vue'
import PlanificacionSemanas from '../components/modulo-c/PlanificacionSemanas.vue'
import EvaluacionReunion from '../components/modulo-c/EvaluacionReunion.vue'

/**
 * Identificadores de las vistas del sistema
 * @readonly
 * @enum {string}
 */
export const VISTAS_IDS = Object.freeze({
  LANDING: 'landing',
  DIRIGENTES: 'dirigentes',
  EVALUACION: 'evaluacion',
  MODULO_A: 'moduloA',
  MODULO_B: 'moduloB',
  MODULO_C: 'moduloC'
})

/**
 * Genera la configuración estándar del menú desplegable de exportación (PDF / Excel).
 * @returns {object} Configuración de acción con menú desplegable
 */
const crearAccionExportar = () => ({
  label: 'Exportar',
  variant: 'primary',
  dropdown: true,
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
})

/**
 * Registro declarativo de vistas para el orquestador App.vue.
 * Cada vista define:
 * - component: Componente SFC a renderizar
 * - card: Booleano que indica si se envuelve en GlassCard con encabezado y acciones
 * - pasaTema: Si se le pasa `isDarkMode` como prop
 * - wrapperClass: Clases contenedoras para vistas sin card
 * - title / subtitle: Título y subtítulo del GlassCard
 * - acciones: Lista de botones o dropdowns en el header
 */
export const vistas = Object.freeze({
  [VISTAS_IDS.LANDING]: {
    component: LandingMenu,
    pasaTema: true
  },

  [VISTAS_IDS.DIRIGENTES]: {
    component: ListaDirigentes,
    wrapperClass: 'max-w-2xl mx-auto'
  },

  [VISTAS_IDS.EVALUACION]: {
    component: EvaluacionReunion,
    card: true,
    title: 'Módulo C.2: Evaluación de Reunión',
    subtitle: 'Revisión de objetivos y cumplimiento',
    acciones: [
      {
        label: 'Atrás',
        variant: 'ghost',
        run: ({ store }) =>
          typeof store.irAModuloB === 'function'
            ? store.irAModuloB()
            : (store.vistaActual = VISTAS_IDS.MODULO_B)
      },
      crearAccionExportar()
    ]
  },

  [VISTAS_IDS.MODULO_A]: {
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

  [VISTAS_IDS.MODULO_B]: {
    component: CronogramaGrid,
    card: true,
    title: 'Módulo B: Cronograma de Actividades',
    subtitle: 'Planificación de reuniones sabatinas',
    acciones: [
      {
        label: 'Atrás',
        variant: 'ghost',
        run: ({ store }) => store.volverModuloA()
      },
      {
        label: 'Siguiente: Planificar Sábados',
        variant: 'primary',
        run: ({ store }) => store.irAModuloC()
      }
    ]
  },

  [VISTAS_IDS.MODULO_C]: {
    component: PlanificacionSemanas,
    card: true,
    title: 'Módulo C: Planificación Semanal',
    subtitle: 'Diseño del programa para cada sábado',
    acciones: [
      {
        label: 'Atrás',
        variant: 'ghost',
        run: ({ store }) =>
          typeof store.irAModuloB === 'function'
            ? store.irAModuloB()
            : (store.vistaActual = VISTAS_IDS.MODULO_B)
      },
      crearAccionExportar()
    ]
  }
})
