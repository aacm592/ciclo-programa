import { ref } from 'vue'
import { useCicloStore } from '../stores/cicloStore'
import { useModalAviso } from './useModalAviso'

/**
 * Lógica del LandingMenu: flujo de creación/edición de ciclo con validaciones.
 */
export function useLandingMenu() {
  const store = useCicloStore()
  const mostrarModalRama = ref(false)
  const { modal, abrirModal, cerrarModal } = useModalAviso()

  const irADirigentes = () => {
    cerrarModal()
    store.vistaActual = 'dirigentes'
  }
  const crearCicloDesdeModal = () => {
    cerrarModal()
    mostrarModalRama.value = true
  }

  const intentarCrearCiclo = () => {
    if (store.dirigentes.length === 0)
      abrirModal(
        'Sin dirigentes registrados',
        'Aún no tienes dirigentes en tu lista, añádelos con el siguiente botón para poder asignarlos en las reuniones.',
        'Añadir dirigentes',
        irADirigentes
      )
    else mostrarModalRama.value = true
  }

  const intentarEditarCiclo = () => {
    if (store.dirigentes.length === 0)
      abrirModal(
        'Sin dirigentes registrados',
        'Aún no tienes dirigentes en tu lista, añádelos con el siguiente botón para poder asignarlos en las reuniones.',
        'Añadir dirigentes',
        irADirigentes
      )
    else if (!store.tieneCicloCreado)
      abrirModal(
        'Sin ciclo creado',
        'Aún no tienes ningún ciclo de programa creado. Crea un nuevo ciclo para comenzar la planificación.',
        'Crear nuevo ciclo',
        crearCicloDesdeModal
      )
    else store.vistaActual = 'moduloA'
  }

  const seleccionarRama = (idRama) => {
    mostrarModalRama.value = false
    store.crearNuevoCiclo(idRama)
  }

  return {
    modal,
    cerrarModal,
    mostrarModalRama,
    intentarCrearCiclo,
    intentarEditarCiclo,
    seleccionarRama
  }
}
