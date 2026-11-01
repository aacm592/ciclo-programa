import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'

const CLAVE_ESTADO = 'scout_estado_ciclo'
const CLAVE_DIRIGENTES = 'scout_dirigentes'
const RAMA_DEFAULT = 'lobatos'
const MIN_FILAS_DIAGNOSTICO = 3

const MESES = Object.freeze([
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE'
])

/**
 * Genera un identificador único seguro para filas y elementos.
 * @returns {number|string}
 */
const generarId = () => Date.now() + Math.floor(Math.random() * 1000)

/**
 * Lee y parsea JSON desde localStorage con manejo seguro de excepciones.
 * @template T
 * @param {string} clave
 * @param {T} porDefecto
 * @returns {T}
 */
const leerStorage = (clave, porDefecto = null) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return porDefecto
  }
  try {
    const crudo = localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : porDefecto
  } catch (error) {
    console.error(`[cicloStore] Error al leer "${clave}" de localStorage:`, error)
    try {
      localStorage.removeItem(clave)
    } catch {
      // ignorar error en removeItem
    }
    return porDefecto
  }
}

/**
 * Escribe un objeto como JSON en localStorage con manejo seguro de excepciones.
 * @param {string} clave
 * @param {unknown} valor
 */
const escribirStorage = (clave, valor) => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch (error) {
    console.error(`[cicloStore] Error al guardar "${clave}" en localStorage:`, error)
  }
}

/**
 * Estructura inicial del encabezado general del ciclo.
 */
export const crearEncabezadoBase = () => ({
  distrito: 'Cochabamba',
  grupo: 'Kairos',
  tropa: '',
  cicloNumero: 1,
  fechaInicio: '',
  fechaFin: ''
})

/**
 * Genera las 3 filas mínimas requeridas para diagnóstico o énfasis.
 */
export const crearFilasBase = () => [
  { id: 1, texto: '' },
  { id: 2, texto: '' },
  { id: 3, texto: '' }
]

/**
 * Estructura inicial para el cuestionario de evaluación de una reunión.
 */
export const crearEvaluacionBase = () => ({
  cumplePrograma: '',
  cumpleObjetivo: '',
  contribuyeObjetivos: '',
  coherenciaEnfasis: ''
})

/**
 * Estructura base completa del Módulo C para una reunión individual.
 */
export const crearProgramaBase = () => ({
  responsables: [],
  responsablesOtro: '',
  objetivo: '',
  horario: [
    {
      id: 1,
      hora: '15:00',
      duracion: 15, // Número entero para compatibilidad con input type="number"
      actividad: 'Formación inicial',
      materiales: '',
      responsables: '',
      observaciones: ''
    }
  ],
  nota: '',
  objetivosEducativos: [
    { id: 1, area: '', media: '', tardia: '' },
    { id: 2, area: '', media: '', tardia: '' },
    { id: 3, area: '', media: '', tardia: '' }
  ],
  evaluacion: crearEvaluacionBase()
})

export const useCicloStore = defineStore('ciclo', () => {
  // ---------------------------------------------------------------
  // ESTADO REACTIVO
  // ---------------------------------------------------------------
  const vistaActual = ref('landing')
  const rama = ref(RAMA_DEFAULT)
  const encabezado = ref(crearEncabezadoBase())
  const diagnosticos = ref(crearFilasBase())
  const enfasis = ref(crearFilasBase())
  const juegoDemocratico = ref('')
  const actividadesSeleccionadas = ref(['', '', ''])
  const cronograma = ref([])
  const errorGenerarSemanas = ref('')
  const dirigentes = ref([])

  // ---------------------------------------------------------------
  // INICIALIZACIÓN DESDE LOCALSTORAGE
  // ---------------------------------------------------------------
  const estadoGuardado = leerStorage(CLAVE_ESTADO)
  if (estadoGuardado) {
    if (estadoGuardado.encabezado) {
      encabezado.value = { ...crearEncabezadoBase(), ...estadoGuardado.encabezado }
    }
    if (Array.isArray(estadoGuardado.diagnosticos)) {
      diagnosticos.value = estadoGuardado.diagnosticos
    }
    if (Array.isArray(estadoGuardado.enfasis)) {
      enfasis.value = estadoGuardado.enfasis
    }
    if (typeof estadoGuardado.juegoDemocratico === 'string') {
      juegoDemocratico.value = estadoGuardado.juegoDemocratico
    }
    if (Array.isArray(estadoGuardado.actividadesSeleccionadas)) {
      actividadesSeleccionadas.value = estadoGuardado.actividadesSeleccionadas
    }
    if (Array.isArray(estadoGuardado.cronograma)) {
      cronograma.value = estadoGuardado.cronograma
    }
    if (estadoGuardado.rama) {
      rama.value = estadoGuardado.rama
    }
  }

  const dirigentesGuardados = leerStorage(CLAVE_DIRIGENTES, [])
  dirigentes.value = Array.isArray(dirigentesGuardados) ? dirigentesGuardados : []

  // ---------------------------------------------------------------
  // PERSISTENCIA AUTOMÁTICA
  // ---------------------------------------------------------------
  watch(
    [
      encabezado,
      diagnosticos,
      enfasis,
      juegoDemocratico,
      actividadesSeleccionadas,
      cronograma,
      rama
    ],
    () => {
      escribirStorage(CLAVE_ESTADO, {
        encabezado: encabezado.value,
        diagnosticos: diagnosticos.value,
        enfasis: enfasis.value,
        juegoDemocratico: juegoDemocratico.value,
        actividadesSeleccionadas: actividadesSeleccionadas.value,
        cronograma: cronograma.value,
        rama: rama.value
      })
    },
    { deep: true }
  )

  watch(
    dirigentes,
    (nuevosDirigentes) => {
      escribirStorage(CLAVE_DIRIGENTES, nuevosDirigentes)
    },
    { deep: true }
  )

  // Limpiar mensaje de error en cuanto el usuario define ambas fechas
  watch([() => encabezado.value.fechaInicio, () => encabezado.value.fechaFin], ([inicio, fin]) => {
    if (inicio && fin) {
      errorGenerarSemanas.value = ''
    }
  })

  // ---------------------------------------------------------------
  // GETTERS COMPUTADOS
  // ---------------------------------------------------------------
  const tieneDatosGuardados = computed(() => {
    return Boolean(encabezado.value.fechaInicio && encabezado.value.fechaFin)
  })

  // Sábados activos (no cancelados) para el Módulo C y Evaluación
  const reunionesValidas = computed(() => {
    return cronograma.value.filter((s) => !s.cancelado)
  })

  // ---------------------------------------------------------------
  // ACCIONES: DIRIGENTES
  // ---------------------------------------------------------------
  const agregarDirigente = (nombre) => {
    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : ''
    if (nombreLimpio && !dirigentes.value.includes(nombreLimpio)) {
      dirigentes.value.push(nombreLimpio)
      return true
    }
    return false
  }

  const eliminarDirigente = (index) => {
    if (index >= 0 && index < dirigentes.value.length) {
      dirigentes.value.splice(index, 1)
      return true
    }
    return false
  }

  // ---------------------------------------------------------------
  // ACCIONES: DIAGNÓSTICOS Y ÉNFASIS
  // ---------------------------------------------------------------
  const agregarDiagnostico = () => {
    diagnosticos.value.push({ id: generarId(), texto: '' })
  }

  const eliminarDiagnostico = (id) => {
    if (diagnosticos.value.length > MIN_FILAS_DIAGNOSTICO) {
      diagnosticos.value = diagnosticos.value.filter((d) => d.id !== id)
    }
  }

  const agregarEnfasis = () => {
    enfasis.value.push({ id: generarId(), texto: '' })
  }

  const eliminarEnfasis = (id) => {
    if (enfasis.value.length > MIN_FILAS_DIAGNOSTICO) {
      enfasis.value = enfasis.value.filter((e) => e.id !== id)
    }
  }

  // ---------------------------------------------------------------
  // ACCIONES: CRONOGRAMA (MÓDULO B)
  // ---------------------------------------------------------------
  /**
   * Genera el arreglo de sábados comprendidos entre fechaInicio y fechaFin.
   * Conserva el trabajo previo si el usuario edita fechas o vuelve al módulo.
   * @returns {boolean} true si se generó correctamente, false si falló la validación
   */
  const generarSemanas = () => {
    errorGenerarSemanas.value = ''

    if (!encabezado.value.fechaInicio || !encabezado.value.fechaFin) {
      errorGenerarSemanas.value = 'Debes definir las fechas de inicio y fin en el encabezado.'
      return false
    }

    const fechaActual = new Date(encabezado.value.fechaInicio + 'T12:00:00')
    const fechaFinal = new Date(encabezado.value.fechaFin + 'T12:00:00')

    if (isNaN(fechaActual.getTime()) || isNaN(fechaFinal.getTime())) {
      errorGenerarSemanas.value = 'Una de las fechas ingresadas no es válida.'
      return false
    }

    if (fechaActual > fechaFinal) {
      errorGenerarSemanas.value = 'La fecha de fin debe ser posterior a la fecha de inicio.'
      return false
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
      const existente = cronograma.value.find((s) => s.fecha === fechaFormateada)
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
      errorGenerarSemanas.value = 'El rango de fechas seleccionado no contiene ningún sábado.'
      return false
    }

    cronograma.value = nuevosSabados
    vistaActual.value = 'moduloB'
    return true
  }

  // ---------------------------------------------------------------
  // ACCIONES: NAVEGACIÓN
  // ---------------------------------------------------------------
  const irAModuloA = () => {
    vistaActual.value = 'moduloA'
  }
  const volverModuloA = () => {
    vistaActual.value = 'moduloA'
  }
  const irAModuloB = () => {
    vistaActual.value = 'moduloB'
  }
  const irAModuloC = () => {
    vistaActual.value = 'moduloC'
  }
  const irAEvaluacion = () => {
    vistaActual.value = 'evaluacion'
  }
  const irADirigentes = () => {
    vistaActual.value = 'dirigentes'
  }
  const irALanding = () => {
    vistaActual.value = 'landing'
  }

  // ---------------------------------------------------------------
  // ACCIONES: CICLO Y LIMPIEZA
  // ---------------------------------------------------------------
  const limpiarDatos = (forzar = false) => {
    if (
      forzar ||
      confirm('¿Estás seguro de borrar todos los datos? Esto reiniciará el ciclo desde cero.')
    ) {
      encabezado.value = crearEncabezadoBase()
      diagnosticos.value = crearFilasBase()
      enfasis.value = crearFilasBase()
      juegoDemocratico.value = ''
      actividadesSeleccionadas.value = ['', '', '']
      cronograma.value = []
      vistaActual.value = 'moduloA'
      errorGenerarSemanas.value = ''

      nextTick(() => {
        try {
          localStorage.removeItem(CLAVE_ESTADO)
        } catch (error) {
          console.error('[cicloStore] Error al remover estado de localStorage:', error)
        }
      })
    }
  }

  const crearNuevoCiclo = (nuevaRama = RAMA_DEFAULT) => {
    rama.value = nuevaRama
    if (tieneDatosGuardados.value) {
      const confirmacion = confirm(
        `Hay datos guardados de un ciclo de ${encabezado.value.fechaInicio} a ${encabezado.value.fechaFin}. ¿Borrar y crear uno nuevo?`
      )
      if (confirmacion) {
        limpiarDatos(true)
        vistaActual.value = 'moduloA'
      }
    } else {
      vistaActual.value = 'moduloA'
    }
  }

  return {
    // Estado
    rama,
    encabezado,
    diagnosticos,
    enfasis,
    juegoDemocratico,
    actividadesSeleccionadas,
    vistaActual,
    cronograma,
    errorGenerarSemanas,
    dirigentes,

    // Getters
    tieneDatosGuardados,
    reunionesValidas,

    // Acciones de datos
    agregarDirigente,
    eliminarDirigente,
    agregarDiagnostico,
    eliminarDiagnostico,
    agregarEnfasis,
    eliminarEnfasis,
    generarSemanas,
    limpiarDatos,
    crearNuevoCiclo,

    // Acciones de navegación
    irAModuloA,
    volverModuloA,
    irAModuloB,
    irAModuloC,
    irAEvaluacion,
    irADirigentes,
    irALanding
  }
})
