import * as XLSX from 'xlsx'

export function useExportarExcel() {
  return (store) => {
    if (!store.cronograma || store.cronograma.length === 0) {
      alert('No hay datos en el cronograma para exportar.')
      return
    }

    const wb = XLSX.utils.book_new()

    // ==========================================
    // HOJA 1: MÓDULO A
    // ==========================================
    const dataModA = [
      ['DIAGNÓSTICO Y ÉNFASIS'],
      [],
      ['1. DATOS DEL CICLO'],
      ['Número de Ciclo', store.encabezado?.numeroCiclo || ''],
      ['Fecha de Inicio', store.encabezado?.fechaInicio || ''],
      ['Fecha de Conclusión', store.encabezado?.fechaFin || ''],
      [],
      ['2. DIAGNÓSTICO (Problemas detectados)']
    ]
    // Mapeo dinámico del diagnóstico
    const diagnosticos = store.diagnostico || store.diagnosticos || []
    diagnosticos.forEach((d, i) =>
      dataModA.push([`2.${i + 1}`, typeof d === 'string' ? d : d.texto || ''])
    )

    dataModA.push([], ['3. ÉNFASIS (Qué haremos para solucionar)'])
    const enfasis = store.enfasis || []
    enfasis.forEach((e, i) =>
      dataModA.push([`3.${i + 1}`, typeof e === 'string' ? e : e.texto || ''])
    )

    dataModA.push([], ['4. SELECCIÓN DE ACTIVIDADES (Juego democrático)'])
    const actividades = store.actividadesSeleccionadas || store.actividades || []
    actividades.forEach((act, i) =>
      dataModA.push([`4.${i + 1}`, typeof act === 'string' ? act : act.nombre || ''])
    )

    const wsA = XLSX.utils.aoa_to_sheet(dataModA)
    // Ajustar anchos de columna para lectura fácil
    wsA['!cols'] = [{ wch: 35 }, { wch: 80 }]
    XLSX.utils.book_append_sheet(wb, wsA, 'Módulo A')

    // ==========================================
    // HOJA 2: MÓDULO B
    // ==========================================
    const dataModB = [
      ['MÓDULO B: CRONOGRAMA DE ACTIVIDADES'],
      [],
      ['Fecha', 'Estado', 'Objetivo / Actividad Principal / Motivo']
    ]
    store.cronograma.forEach((sabado) => {
      dataModB.push([
        sabado.fecha,
        sabado.cancelado ? 'Cancelada' : 'Activa',
        sabado.cancelado ? sabado.motivoCancelacion : sabado.actividad
      ])
    })
    const wsB = XLSX.utils.aoa_to_sheet(dataModB)
    wsB['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 60 }]
    XLSX.utils.book_append_sheet(wb, wsB, 'Módulo B')

    // ==========================================
    // HOJAS 3+: MÓDULO C (Una pestaña por reunión)
    // ==========================================
    store.cronograma.forEach((sabado, index) => {
      if (!sabado.cancelado && sabado.programa) {
        // Regla C.2: Respetar el número de reunión ajustable por el usuario, o calcularlo
        const numReunion = sabado.programa.numeroReunion || index + 1

        // Regla C.3: Formatear responsables
        const responsablesGen = Array.isArray(sabado.programa.responsables)
          ? sabado.programa.responsables.join(' - ')
          : sabado.programa.responsables || ''

        const dataModC = [
          [`REUNIÓN N° ${numReunion}`],
          ['Fecha:', sabado.fecha],
          ['Responsable(s):', responsablesGen],
          ['Objetivo Principal:', sabado.programa.objetivo || ''],
          ['Nota Relevante:', sabado.programa.nota || ''],
          [],
          ['CRONOGRAMA DE LA ACTIVIDAD'],
          ['Hora', 'Duración (min)', 'Actividad', 'Materiales', 'Responsable(s)', 'Observaciones']
        ]

        // Regla C.5: Horario
        if (sabado.programa.horario) {
          sabado.programa.horario.forEach((fila) => {
            dataModC.push([
              fila.hora,
              fila.duracion,
              fila.actividad,
              fila.materiales,
              Array.isArray(fila.responsables) ? fila.responsables.join(' - ') : fila.responsables,
              fila.observaciones
            ])
          })
        }

        // Regla C.7: Objetivos Educativos
        dataModC.push(
          [],
          ['CONTRIBUYE A LOS SIGUIENTES OBJETIVOS EDUCATIVOS'],
          ['Área de Crecimiento', 'Infancia Media', 'Infancia Tardía']
        )
        if (sabado.programa.objetivosEducativos) {
          sabado.programa.objetivosEducativos.forEach((obj) => {
            dataModC.push([obj.area || '', obj.media || '', obj.tardia || ''])
          })
        }

        // Regla C.8: Asistencia
        const ev = sabado.evaluacion || {}
        dataModC.push(
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

        // Regla C.9: Evaluación
        dataModC.push(
          [],
          ['EVALUACIÓN DE LA REUNIÓN'],
          ['¿Se cumple el programa?', ev.cumplePrograma || ''],
          ['¿Se cumple el objetivo de la actividad principal?', ev.cumpleObjetivo || ''],
          [
            '¿Se logra contribuir el desarrollo de los objetivos educativos?',
            ev.contribuyeObjetivos || ''
          ],
          [
            '¿Las actividades de la reunión guardaron coherencia con el énfasis?',
            ev.coherenciaEnfasis || ''
          ]
        )

        const wsC = XLSX.utils.aoa_to_sheet(dataModC)

        // Ajustar anchos de columnas del Módulo C
        wsC['!cols'] = [
          { wch: 35 }, // Hora / Titulos
          { wch: 15 }, // Duración
          { wch: 40 }, // Actividad
          { wch: 25 }, // Materiales
          { wch: 25 }, // Responsables
          { wch: 40 } // Observaciones
        ]

        XLSX.utils.book_append_sheet(wb, wsC, `Reunión ${numReunion}`)
      }
    })

    // ==========================================
    // DESCARGAR ARCHIVO
    // ==========================================
    XLSX.writeFile(wb, `Ciclo_KAIROS_${store.encabezado?.numeroCiclo || 'export'}.xlsx`)
  }
}
