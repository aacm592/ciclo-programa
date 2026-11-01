import * as XLSX from 'xlsx'

/**
 * Convierte un array o cadena de responsables a formato de texto legible.
 * @param {string[]|string} [responsables]
 * @returns {string}
 */
const formatearResponsables = (responsables) => {
  if (Array.isArray(responsables)) {
    return responsables.filter(Boolean).join(' - ')
  }
  return typeof responsables === 'string' ? responsables : ''
}

/**
 * Construye la hoja de cálculo del Módulo A (Diagnóstico y Énfasis del ciclo).
 * @param {object} store
 * @returns {import('xlsx').WorkSheet}
 */
const crearHojaModuloA = (store) => {
  const enc = store.encabezado ?? {}
  const cicloNum = enc.cicloNumero ?? enc.numeroCiclo ?? ''

  const filas = [
    ['DIAGNÓSTICO Y ÉNFASIS DEL CICLO DE PROGRAMA'],
    [],
    ['1. DATOS GENERALES DEL CICLO'],
    ['Distrito Scout', enc.distrito || ''],
    ['Grupo Scout', enc.grupo || ''],
    ['Unidad / Rama', enc.tropa || store.rama || ''],
    ['Número de Ciclo', cicloNum],
    ['Fecha de Inicio', enc.fechaInicio || ''],
    ['Fecha de Conclusión', enc.fechaFin || ''],
    [],
    ['2. DIAGNÓSTICO (Problemas detectados en la unidad)']
  ]

  // Diagnósticos
  const diagnosticos = store.diagnosticos || store.diagnostico || []
  diagnosticos.forEach((d, i) => {
    const texto = typeof d === 'string' ? d : d.texto || ''
    filas.push([`2.${i + 1}`, texto])
  })

  // Énfasis
  filas.push([], ['3. ÉNFASIS (Acciones y prioridades educativas)'])
  const enfasis = store.enfasis || []
  enfasis.forEach((e, i) => {
    const texto = typeof e === 'string' ? e : e.texto || ''
    filas.push([`3.${i + 1}`, texto])
  })

  // Actividades seleccionadas y juego democrático
  filas.push([], ['4. SELECCIÓN DE ACTIVIDADES (Juego Democrático)'])
  if (store.juegoDemocratico) {
    filas.push(['Mecánica / Juego', store.juegoDemocratico])
  }

  const actividades = store.actividadesSeleccionadas || store.actividades || []
  actividades.forEach((act, i) => {
    const texto = typeof act === 'string' ? act : act.nombre || ''
    filas.push([`4.${i + 1}`, texto])
  })

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 35 }, { wch: 80 }]
  return ws
}

/**
 * Construye la hoja de cálculo del Módulo B (Cronograma de sábados).
 * @param {Array<object>} cronograma
 * @returns {import('xlsx').WorkSheet}
 */
const crearHojaModuloB = (cronograma = []) => {
  const filas = [
    ['MÓDULO B: CRONOGRAMA GENERAL DE ACTIVIDADES'],
    [],
    ['Fecha', 'Estado', 'Objetivo / Actividad Principal / Motivo de Cancelación']
  ]

  for (const sabado of cronograma) {
    const estado = sabado.cancelado ? 'Cancelada' : 'Activa'
    const detalle = sabado.cancelado
      ? sabado.motivoCancelacion || 'Sin motivo especificado'
      : sabado.actividad || 'Sin actividad asignada'

    filas.push([sabado.fecha || '', estado, detalle])
  }

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 65 }]
  return ws
}

/**
 * Construye una hoja individual para una reunión de sábado activa (Módulo C).
 * @param {object} sabado
 * @param {number} numReunion
 * @returns {import('xlsx').WorkSheet}
 */
const crearHojaModuloC = (sabado, numReunion) => {
  const prog = sabado.programa || {}
  const responsGral = formatearResponsables(prog.responsables)

  const filas = [
    [`REUNIÓN N° ${numReunion}`],
    ['Fecha:', sabado.fecha || ''],
    ['Responsable(s):', responsGral],
    ['Objetivo Principal:', prog.objetivo || ''],
    ['Nota Relevante:', prog.nota || ''],
    [],
    ['CRONOGRAMA DETALLADO DE LA ACTIVIDAD'],
    ['Hora', 'Duración (min)', 'Actividad', 'Materiales', 'Responsable(s)', 'Observaciones']
  ]

  // Tabla de horarios
  const horario = Array.isArray(prog.horario) ? prog.horario : []
  for (const fila of horario) {
    filas.push([
      fila.hora || '',
      fila.duracion || '',
      fila.actividad || '',
      fila.materiales || '',
      formatearResponsables(fila.responsables),
      fila.observaciones || ''
    ])
  }

  // Objetivos educativos
  filas.push(
    [],
    ['CONTRIBUYE A LOS SIGUIENTES OBJETIVOS EDUCATIVOS'],
    ['Área de Crecimiento', 'Infancia Media', 'Infancia Tardía']
  )

  const objetivos = Array.isArray(prog.objetivosEducativos) ? prog.objetivosEducativos : []
  for (const obj of objetivos) {
    filas.push([obj.area || '', obj.media || '', obj.tardia || ''])
  }

  // Evaluación de la reunión (admite prog.evaluacion o sabado.evaluacion)
  const ev = prog.evaluacion || sabado.evaluacion || {}
  filas.push(
    [],
    ['EVALUACIÓN DE LA REUNIÓN'],
    ['¿Se cumple el programa?', ev.cumplePrograma || ''],
    ['¿Se cumple el objetivo de la actividad principal?', ev.cumpleObjetivo || ''],
    [
      '¿Se logra contribuir al desarrollo de los objetivos educativos?',
      ev.contribuyeObjetivos || ''
    ],
    [
      '¿Las actividades de la reunión guardaron coherencia con el énfasis?',
      ev.coherenciaEnfasis || ''
    ]
  )

  // Datos opcionales de asistencia si están disponibles
  if (ev.asistencia || ev.numAsistentes || ev.varones || ev.mujeres || ev.numDirigentes) {
    filas.push(
      [],
      ['DATOS DE ASISTENCIA'],
      ['Asistencia', ev.asistencia || ''],
      ['Nº de Asistentes', ev.numAsistentes || ''],
      ['Varones', ev.varones || ''],
      ['Mujeres', ev.mujeres || ''],
      ['Asistentes última reunión', ev.asisUltimaReunion || ''],
      ['Nuevos', ev.nuevos || ''],
      ['Nº de Dirigentes', ev.numDirigentes || '']
    )
  }

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 45 }, { wch: 30 }, { wch: 30 }, { wch: 45 }]
  return ws
}

/**
 * Genera el nombre de archivo seguro para el libro de Excel.
 * @param {object} store
 * @returns {string}
 */
const generarNombreArchivo = (store) => {
  const cicloNum = store.encabezado?.cicloNumero ?? store.encabezado?.numeroCiclo ?? 'export'
  const unidad = (store.encabezado?.tropa || store.rama || 'General').replace(
    /[^a-zA-Z0-9_-]/g,
    '_'
  )
  return `Ciclo_KAIROS_${unidad}_Ciclo${cicloNum}.xlsx`
}

/**
 * Composable para la exportación completa del ciclo a un libro de Microsoft Excel (.xlsx).
 * Genera pestañas para el Módulo A, el Módulo B y cada reunión del Módulo C.
 *
 * @returns {(store: object) => boolean} Función exportadora que recibe el store
 */
export function useExportarExcel() {
  return (store) => {
    if (!store?.cronograma || store.cronograma.length === 0) {
      alert('No hay datos en el cronograma para exportar.')
      return false
    }

    try {
      const libro = XLSX.utils.book_new()

      // Hoja 1: Módulo A
      const hojaA = crearHojaModuloA(store)
      XLSX.utils.book_append_sheet(libro, hojaA, 'Módulo A')

      // Hoja 2: Módulo B
      const hojaB = crearHojaModuloB(store.cronograma)
      XLSX.utils.book_append_sheet(libro, hojaB, 'Módulo B')

      // Hojas 3+: Módulo C (una por cada sábado activo)
      let contadorValidas = 0
      store.cronograma.forEach((sabado, index) => {
        if (!sabado.cancelado && sabado.programa) {
          contadorValidas += 1
          const numReunion = sabado.programa.numeroReunion || contadorValidas
          const hojaC = crearHojaModuloC(sabado, numReunion)
          // El nombre de la pestaña en Excel tiene un límite de 31 caracteres
          const nombrePestana = `Reunión ${numReunion}`.slice(0, 31)
          XLSX.utils.book_append_sheet(libro, hojaC, nombrePestana)
        }
      })

      // Guardar y descargar archivo
      const nombreArchivo = generarNombreArchivo(store)
      XLSX.writeFile(libro, nombreArchivo)
      return true
    } catch (error) {
      console.error('[useExportarExcel] Error al generar el archivo Excel:', error)
      alert('Ocurrió un error al generar el archivo Excel. Revisa la consola para más detalles.')
      return false
    }
  }
}
