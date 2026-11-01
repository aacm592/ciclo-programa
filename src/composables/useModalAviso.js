import { reactive } from 'vue'

/**
 * Composable para el modal de aviso unificado (sin dirigentes / sin ciclo).
 * Devuelve el estado reactivo y helpers para abrir/cerrar el modal.
 */
export function useModalAviso() {
  const modal = reactive({ show: false, titulo: '', texto: '', btnLabel: '', btnHandler: null })
  const cerrarModal = () => {
    modal.show = false
  }
  const abrirModal = (titulo, texto, btnLabel, btnHandler) =>
    Object.assign(modal, { show: true, titulo, texto, btnLabel, btnHandler })
  return { modal, abrirModal, cerrarModal }
}
