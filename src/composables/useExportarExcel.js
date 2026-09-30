export function useExportarExcel() {
  return (store) => {
    if (store.cronograma.length === 0) {
      alert('Primero debes generar el cronograma en el Módulo B antes de exportar.')
      return
    }

    const formatearCelda = (texto) => `"${(texto || '').toString().replace(/"/g, '""')}"`
    let csv = 'Mes,Fecha,Hora,Duracion (min),Actividad,Materiales,Responsables,Observaciones\n'

    store.cronograma.forEach(sabado => {
      if (sabado.cancelado) {
        csv += `${formatearCelda(sabado.mes)},${formatearCelda(sabado.fecha)},,,${formatearCelda('CANCELADO: ' + sabado.motivoCancelacion)},,,\n`
      } else {
        sabado.programa.horario.forEach(fila => {
          const responsables = Array.isArray(fila.responsables)
            ? fila.responsables.join(' - ')
            : fila.responsables

          csv += `${formatearCelda(sabado.mes)},${formatearCelda(sabado.fecha)},${formatearCelda(fila.hora)},${formatearCelda(fila.duracion)},${formatearCelda(fila.actividad)},${formatearCelda(fila.materiales)},${formatearCelda(responsables)},${formatearCelda(fila.observaciones)}\n`
        })
      }
    })

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Cronograma_Kairos_${store.encabezado.fechaInicio || 'export'}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}