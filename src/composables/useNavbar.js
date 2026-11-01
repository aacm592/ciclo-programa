import { computed } from 'vue'
import { useCicloStore } from '../stores/cicloStore'
import { useModalAviso } from './useModalAviso'

export const BOTONES_NAV = [
  { label: 'Editar Ciclo', vista: 'moduloA', idx: 0 },
  { label: 'Evaluar Reunión', vista: 'evaluacion', idx: 1 },
  { label: 'Dirigentes', vista: 'dirigentes', idx: 2 }
]

/**
 * Lógica del AppNavbar: navegación guardada con validaciones de acceso.
 */
export function useNavbar() {
  const store = useCicloStore()
  const { modal, abrirModal, cerrarModal } = useModalAviso()

  const irADirigentes = () => {
    cerrarModal()
    store.vistaActual = 'dirigentes'
  }
  const irACrearCiclo = () => {
    cerrarModal()
    store.vistaActual = 'landing'
  }

  const navegarA = (idVista) => {
    // Permitir siempre ir a landing o a la gestión de dirigentes
    if (idVista === 'landing' || idVista === 'dirigentes') {
      store.vistaActual = idVista
      return
    }
    // Si intenta ir a algún módulo de planificación sin dirigentes registrados
    if (store.dirigentes.length === 0) {
      abrirModal(
        'Sin dirigentes registrados',
        'Aún no tienes dirigentes en tu lista, añádelos con el siguiente botón para poder acceder a los módulos de planificación.',
        'Añadir dirigentes',
        irADirigentes
      )
      return
    }
    // Si intenta acceder a planificación sin que haya un ciclo creado
    if (!store.tieneCicloCreado) {
      abrirModal(
        'Sin ciclo creado',
        'Aún no tienes ningún ciclo de programa creado. Debes crear un nuevo ciclo antes de acceder a la planificación.',
        'Ir a crear ciclo',
        irACrearCiclo
      )
      return
    }
    store.vistaActual = idVista
  }

  const activeIndex = computed(() => {
    if (['moduloA', 'moduloB', 'moduloC'].includes(store.vistaActual)) return 0
    if (store.vistaActual === 'evaluacion') return 1
    if (store.vistaActual === 'dirigentes') return 2
    return -1
  })

  return { modal, cerrarModal, navegarA, activeIndex }
}
