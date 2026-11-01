import { useCicloStore } from '../stores/cicloStore'

/**
 * Composable que proporciona la función para imprimir o exportar la planificación en PDF
 * mediante el diálogo de impresión nativo del navegador (estilizado vía CSS print-only).
 *
 * @returns {() => boolean} Función exportadora que devuelve true si se abrió el diálogo de impresión
 */
export function useExportarPDF() {
  const store = useCicloStore()

  /**
   * Ejecuta la validación y dispara la impresión del documento.
   * @returns {boolean} true si se inició la impresión, false si hubo error de validación
   */
  return function exportarPDF() {
    if (!store.cronograma || store.cronograma.length === 0) {
      alert('Primero debes generar el cronograma en el Módulo B antes de exportar el documento.')
      return false
    }

    if (typeof window === 'undefined' || typeof window.print !== 'function') {
      console.error('[useExportarPDF] El entorno actual no soporta la función window.print')
      return false
    }

    window.print()
    return true
  }
}
