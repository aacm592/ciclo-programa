import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import {
  RAMA_DEFAULT,
  MIN_FILAS_DIAGNOSTICO,
  generarId,
  crearEncabezadoBase,
  crearFilasBase,
  crearEvaluacionBase,
  crearProgramaBase
} from './cicloModel'
import {
  cargarEstadoCiclo,
  cargarDirigentes,
  guardarEstadoCiclo,
  guardarDirigentes,
  borrarEstadoCiclo
} from './cicloStorage'
import { calcularSemanasCronograma } from './cicloCronograma'

// Re-exportar estructuras base para retrocompatibilidad
export { crearEncabezadoBase, crearFilasBase, crearEvaluacionBase, crearProgramaBase }

export const useCicloStore = defineStore('ciclo', () => {
  // ---------------------------------------------------------------
  // ESTADO REACTIVO E INICIALIZACIÓN
  // ---------------------------------------------------------------
  const estadoInicial = cargarEstadoCiclo()

  const vistaActual = ref('landing')
  const rama = ref(estadoInicial?.rama ?? RAMA_DEFAULT)
  const encabezado = ref(estadoInicial?.encabezado ?? crearEncabezadoBase())
  const diagnosticos = ref(estadoInicial?.diagnosticos ?? crearFilasBase())
  const enfasis = ref(estadoInicial?.enfasis ?? crearFilasBase())
  const juegoDemocratico = ref(estadoInicial?.juegoDemocratico ?? '')
  const actividadesSeleccionadas = ref(estadoInicial?.actividadesSeleccionadas ?? ['', '', ''])
  const cronograma = ref(estadoInicial?.cronograma ?? [])
  const errorGenerarSemanas = ref('')
  const dirigentes = ref(cargarDirigentes())

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
      guardarEstadoCiclo({
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
      guardarDirigentes(nuevosDirigentes)
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
  const generarSemanas = () => {
    errorGenerarSemanas.value = ''

    const resultado = calcularSemanasCronograma(
      encabezado.value.fechaInicio,
      encabezado.value.fechaFin,
      cronograma.value
    )

    if (!resultado.exito) {
      errorGenerarSemanas.value = resultado.error
      return false
    }

    cronograma.value = resultado.semanas
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
        borrarEstadoCiclo()
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
