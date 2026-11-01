import { MESES, crearProgramaBase } from './cicloModel'

/**
 * Calcula el listado de sábados entre dos fechas y conserva la información de reuniones existentes.
 *
 * @param {string} fechaInicio Fecha en formato YYYY-MM-DD
 * @param {string} fechaFin Fecha en formato YYYY-MM-DD
 * @param {Array} cronogramaPrevio Arreglo de semanas previamente generadas para conservar datos
 * @returns {{ exito: true, semanas: Array } | { exito: false, error: string }}
 */
export const calcularSemanasCronograma = (fechaInicio, fechaFin, cronogramaPrevio = []) => {
  if (!fechaInicio || !fechaFin) {
    return {
      exito: false,
      error: 'Debes definir las fechas de inicio y fin en el encabezado.'
    }
  }

  const fechaActual = new Date(fechaInicio + 'T12:00:00')
  const fechaFinal = new Date(fechaFin + 'T12:00:00')

  if (isNaN(fechaActual.getTime()) || isNaN(fechaFinal.getTime())) {
    return {
      exito: false,
      error: 'Una de las fechas ingresadas no es válida.'
    }
  }

  if (fechaActual > fechaFinal) {
    return {
      exito: false,
      error: 'La fecha de fin debe ser posterior a la fecha de inicio.'
    }
  }

  const nuevosSabados = []

  // Avanzar hasta el primer sábado (día 6 en getDay())
  while (fechaActual.getDay() !== 6 && fechaActual <= fechaFinal) {
    fechaActual.setDate(fechaActual.getDate() + 1)
  }

  // Iterar de sábado en sábado sumando 7 días
  while (fechaActual <= fechaFinal) {
    const dia = fechaActual.getDate()
    const mes = fechaActual.getMonth() + 1
    const anio = fechaActual.getFullYear().toString().slice(-2)

    const fechaFormateada = `${dia}-${mes}-${anio}`
    const nombreMes = MESES[fechaActual.getMonth()]

    // Buscar si ya existía información para este sábado para conservarla
    const existente = cronogramaPrevio.find((s) => s.fecha === fechaFormateada)
    const programaBase = crearProgramaBase()

    nuevosSabados.push({
      fecha: fechaFormateada,
      mes: nombreMes,
      actividad: existente?.actividad ?? '',
      cancelado: existente?.cancelado ?? false,
      motivoCancelacion: existente?.motivoCancelacion ?? '',
      programa: {
        ...programaBase,
        ...(existente?.programa ?? {}),
        evaluacion: {
          ...programaBase.evaluacion,
          ...(existente?.programa?.evaluacion ?? {})
        }
      }
    })

    fechaActual.setDate(fechaActual.getDate() + 7)
  }

  if (nuevosSabados.length === 0) {
    return {
      exito: false,
      error: 'El rango de fechas seleccionado no contiene ningún sábado.'
    }
  }

  return {
    exito: true,
    semanas: nuevosSabados
  }
}
