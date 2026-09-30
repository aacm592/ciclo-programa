import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'

const CLAVE_ESTADO = 'scout_estado_ciclo'
const CLAVE_DIRIGENTES = 'scout_dirigentes'

// Lectura segura de localStorage: si el JSON está corrupto, lo descarta
const leerStorage = (clave, porDefecto = null) => {
  try {
    const crudo = localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : porDefecto
  } catch (e) {
    console.error(`Error leyendo "${clave}" de localStorage`, e)
    localStorage.removeItem(clave)
    return porDefecto
  }
}

const crearEncabezadoBase = () => ({
  distrito: 'Cochabamba',
  grupo: 'Kairos',
  tropa: '',
  cicloNumero: 1,
  fechaInicio: '',
  fechaFin: ''
})

const crearFilasBase = () => [
  { id: 1, texto: '' },
  { id: 2, texto: '' },
  { id: 3, texto: '' }
]

// Estructura base del Módulo C
const crearProgramaBase = () => ({
  responsables: [],
  responsablesOtro: '',
  objetivo: '',
  horario: [
    {
      id: 1,
      hora: '15:00',
      duracion: '15 min',
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
  // NUEVO: Estructura de evaluación
  evaluacion: {
    cumplePrograma: '',
    cumpleObjetivo: '',
    contribuyeObjetivos: '',
    coherenciaEnfasis: ''
  }
})

export const useCicloStore = defineStore('ciclo', () => {
  // ---------------------------------------------------------------
  // ESTADO (todo declarado ANTES de usarse)
  // ---------------------------------------------------------------

  // Navegación (antes estaba declarada al final: causaba ReferenceError)
  const vistaActual = ref('landing')

  // 1. Encabezado
  const encabezado = ref(crearEncabezadoBase())

  // 2. Diagnóstico y Énfasis (3 elementos mínimos para obligar su llenado)
  const diagnosticos = ref(crearFilasBase())
  const enfasis = ref(crearFilasBase())

  // 3. Selección de Actividades
  const juegoDemocratico = ref('')
  const actividadesSeleccionadas = ref(['', '', '']) // Exactamente 3 actividades

  // Módulo B: cronograma de sábados
  const cronograma = ref([])

  // Último error de generarSemanas (el componente decide cómo mostrarlo)
  const errorGenerarSemanas = ref('')

  // Lista de dirigentes
  const dirigentes = ref([])

  // ---------------------------------------------------------------
  // CARGA DESDE LOCALSTORAGE
  // ---------------------------------------------------------------
  const estado = leerStorage(CLAVE_ESTADO)
  if (estado) {
    encabezado.value = { ...encabezado.value, ...(estado.encabezado ?? {}) }
    diagnosticos.value = estado.diagnosticos ?? diagnosticos.value
    enfasis.value = estado.enfasis ?? enfasis.value
    juegoDemocratico.value = estado.juegoDemocratico ?? juegoDemocratico.value
    actividadesSeleccionadas.value =
      estado.actividadesSeleccionadas ?? actividadesSeleccionadas.value
    cronograma.value = estado.cronograma ?? cronograma.value
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
      vistaActual,
      cronograma
    ],
    () => {
      try {
        localStorage.setItem(
          CLAVE_ESTADO,
          JSON.stringify({
            encabezado: encabezado.value,
            diagnosticos: diagnosticos.value,
            enfasis: enfasis.value,
            juegoDemocratico: juegoDemocratico.value,
            actividadesSeleccionadas: actividadesSeleccionadas.value,
            vistaActual: vistaActual.value,
            cronograma: cronograma.value
          })
        )
      } catch (e) {
        console.error('No se pudo guardar el estado del ciclo', e)
      }
    },
    { deep: true }
  )

  watch(
    dirigentes,
    (nuevoValor) => {
      try {
        localStorage.setItem(CLAVE_DIRIGENTES, JSON.stringify(nuevoValor))
      } catch (e) {
        console.error('No se pudo guardar la lista de dirigentes', e)
      }
    },
    { deep: true }
  )

  // ---------------------------------------------------------------
  // DIAGNÓSTICOS Y ÉNFASIS
  // ---------------------------------------------------------------
  const agregarDiagnostico = () => diagnosticos.value.push({ id: Date.now(), texto: '' })
  const eliminarDiagnostico = (id) => {
    if (diagnosticos.value.length > 3) {
      diagnosticos.value = diagnosticos.value.filter((d) => d.id !== id)
    }
  }

  const agregarEnfasis = () => enfasis.value.push({ id: Date.now(), texto: '' })
  const eliminarEnfasis = (id) => {
    if (enfasis.value.length > 3) {
      enfasis.value = enfasis.value.filter((e) => e.id !== id)
    }
  }

  // ---------------------------------------------------------------
  // MÓDULO B: generar sábados
  // ---------------------------------------------------------------
  // Devuelve true si tuvo éxito. Si falla devuelve false y deja el
  // mensaje en `errorGenerarSemanas` para que el componente lo muestre.
  const generarSemanas = () => {
    errorGenerarSemanas.value = ''

    if (!encabezado.value.fechaInicio || !encabezado.value.fechaFin) {
      errorGenerarSemanas.value = 'Debes definir las fechas de inicio y fin en el encabezado.'
      return false
    }

    // 'T12:00:00' evita desfases de zona horaria
    const fechaActual = new Date(encabezado.value.fechaInicio + 'T12:00:00')
    const fechaFinal = new Date(encabezado.value.fechaFin + 'T12:00:00')

    const meses = [
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
    ]
    const nuevosSabados = []

    // Avanzar hasta el primer sábado (día 6 en JS)
    while (fechaActual.getDay() !== 6 && fechaActual <= fechaFinal) {
      fechaActual.setDate(fechaActual.getDate() + 1)
    }

    // Recorrer sumando 7 días hasta la fecha de fin
    while (fechaActual <= fechaFinal) {
      const dia = fechaActual.getDate()
      const mes = fechaActual.getMonth() + 1
      const anio = fechaActual.getFullYear().toString().slice(-2)

      const fechaFormateada = `${dia}-${mes}-${anio}`
      const nombreMes = meses[fechaActual.getMonth()]

      // Conservar lo escrito si el usuario va atrás y adelante
      const existente = cronograma.value.find((s) => s.fecha === fechaFormateada)

      const programaBase = crearProgramaBase()

      nuevosSabados.push({
        fecha: fechaFormateada,
        mes: nombreMes,
        actividad: existente?.actividad ?? '',
        cancelado: existente?.cancelado ?? false,
        motivoCancelacion: existente?.motivoCancelacion ?? '',
        // Fusionar con la base para tolerar datos guardados de versiones anteriores
        programa: {
          ...programaBase,
          ...(existente?.programa ?? {})
        }
      })

      fechaActual.setDate(fechaActual.getDate() + 7)
    }

    cronograma.value = nuevosSabados
    vistaActual.value = 'moduloB'
    return true
  }

  // ---------------------------------------------------------------
  // NAVEGACIÓN
  // ---------------------------------------------------------------
  const volverModuloA = () => {
    vistaActual.value = 'moduloA'
  }

  const irAModuloC = () => {
    vistaActual.value = 'moduloC'
  }

  // ---------------------------------------------------------------
  // CICLO EN PROGRESO / LIMPIEZA
  // ---------------------------------------------------------------
  const tieneDatosGuardados = computed(() => {
    return encabezado.value.fechaInicio !== '' && encabezado.value.fechaFin !== ''
  })

  const limpiarDatos = (forzar = false) => {
    if (
      forzar ||
      confirm('¿Estás seguro de borrar todos los datos? Esto reiniciará el ciclo desde cero.')
    ) {
      // Restaurar valores por defecto (manteniendo distrito y grupo de Kairos)
      encabezado.value = crearEncabezadoBase()
      diagnosticos.value = crearFilasBase()
      enfasis.value = crearFilasBase()
      juegoDemocratico.value = ''
      actividadesSeleccionadas.value = ['', '', '']
      cronograma.value = []
      vistaActual.value = 'moduloA'

      // Esperar a que el watch se ejecute (y guarde el estado vacío)
      // y recién entonces borrar la clave, para que el removeItem tenga efecto
      nextTick(() => {
        localStorage.removeItem(CLAVE_ESTADO)
      })
    }
  }

  // Botón "Crear programa ciclo"
  const crearNuevoCiclo = () => {
    if (tieneDatosGuardados.value) {
      if (
        confirm(
          `Hay datos guardados de un ciclo de ${encabezado.value.fechaInicio} a ${encabezado.value.fechaFin}. ¿Borrar y crear uno nuevo?`
        )
      ) {
        limpiarDatos(true) // Sin doble confirmación
        vistaActual.value = 'moduloA'
      }
    } else {
      vistaActual.value = 'moduloA'
    }
  }

  // ---------------------------------------------------------------
  // MÓDULO C
  // ---------------------------------------------------------------
  // Filtra los sábados cancelados. El index + 1 será el "N° de Reunión"
  const reunionesValidas = computed(() => {
    return cronograma.value.filter((s) => !s.cancelado)
  })

  return {
    encabezado,
    diagnosticos,
    enfasis,
    agregarDiagnostico,
    eliminarDiagnostico,
    agregarEnfasis,
    eliminarEnfasis,
    juegoDemocratico,
    actividadesSeleccionadas,
    vistaActual,
    cronograma,
    generarSemanas,
    errorGenerarSemanas,
    volverModuloA,
    limpiarDatos,
    reunionesValidas,
    irAModuloC,
    dirigentes,
    tieneDatosGuardados,
    crearNuevoCiclo
  }
})
