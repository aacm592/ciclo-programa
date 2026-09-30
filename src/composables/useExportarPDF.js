import { useCicloStore } from '../stores/cicloStore'

export function useExportarPDF() {
  const store = useCicloStore()

  return function exportarPDF() {
    if (store.cronograma.length === 0) {
      alert('Primero debes generar el cronograma en el Módulo B antes de exportar el documento.')
      return
    }
    window.print()
  }
}
