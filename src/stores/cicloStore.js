import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import {
  CLAVE_ESTADO,
  CLAVE_DIRIGENTES,
  RAMA_DEFAULT,
  MIN_FILAS,
  generarId,
  crearEncabezadoBase,
  crearFilasBase,
  crearEvaluacionBase,
  crearProgramaBase,
  storage,
  generarSabados
} from './cicloUtils'

export { crearEncabezadoBase, crearFilasBase, crearEvaluacionBase, crearProgramaBase }

export const useCicloStore = defineStore('ciclo', () => {
  const guardado = storage.leer(CLAVE_ESTADO) || {}

  // Estado reactivo
  const vistaActual = ref('landing')
  const rama = ref(guardado.rama || RAMA_DEFAULT)
  const encabezado = ref({ ...crearEncabezadoBase(), ...(guardado.encabezado || {}) })
  const diagnosticos = ref(guardado.diagnosticos || crearFilasBase())
  const enfasis = ref(guardado.enfasis || crearFilasBase())
  const juegoDemocratico = ref(guardado.juegoDemocratico || '')
  const actividadesSeleccionadas = ref(guardado.actividadesSeleccionadas || ['', '', ''])
  const cronograma = ref(guardado.cronograma || [])
  const errorGenerarSemanas = ref('')
  const dirigentes = ref(storage.leer(CLAVE_DIRIGENTES, []))

  // Persistencia automática
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
    () =>
      storage.escribir(CLAVE_ESTADO, {
        encabezado: encabezado.value,
        diagnosticos: diagnosticos.value,
        enfasis: enfasis.value,
        juegoDemocratico: juegoDemocratico.value,
        actividadesSeleccionadas: actividadesSeleccionadas.value,
        cronograma: cronograma.value,
        rama: rama.value
      }),
    { deep: true }
  )

  watch(dirigentes, (val) => storage.escribir(CLAVE_DIRIGENTES, val), { deep: true })

  watch([() => encabezado.value.fechaInicio, () => encabezado.value.fechaFin], ([inicio, fin]) => {
    if (inicio && fin) errorGenerarSemanas.value = ''
  })

  // Getters
  const tieneDatosGuardados = computed(() =>
    Boolean(encabezado.value.fechaInicio && encabezado.value.fechaFin)
  )
  const reunionesValidas = computed(() => cronograma.value.filter((s) => !s.cancelado))

  // Acciones: Colecciones
  const agregarDirigente = (nombre) => {
    const n = typeof nombre === 'string' ? nombre.trim() : ''
    if (n && !dirigentes.value.includes(n)) {
      dirigentes.value.push(n)
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

  const agregarFila = (refLista) => refLista.value.push({ id: generarId(), texto: '' })
  const eliminarFila = (refLista, id) => {
    if (refLista.value.length > MIN_FILAS) {
      refLista.value = refLista.value.filter((item) => item.id !== id)
    }
  }

  // Acciones: Cronograma y ciclo
  const generarSemanas = () => {
    errorGenerarSemanas.value = ''
    const { semanas, error } = generarSabados(
      encabezado.value.fechaInicio,
      encabezado.value.fechaFin,
      cronograma.value
    )
    if (error) {
      errorGenerarSemanas.value = error
      return false
    }
    cronograma.value = semanas
    vistaActual.value = 'moduloB'
    return true
  }

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
      nextTick(() => storage.remover(CLAVE_ESTADO))
    }
  }

  const crearNuevoCiclo = (nuevaRama = RAMA_DEFAULT) => {
    rama.value = nuevaRama
    if (tieneDatosGuardados.value) {
      if (
        confirm(
          `Hay datos guardados de un ciclo de ${encabezado.value.fechaInicio} a ${encabezado.value.fechaFin}. ¿Borrar y crear uno nuevo?`
        )
      ) {
        limpiarDatos(true)
      }
    }
    vistaActual.value = 'moduloA'
  }

  // Navegación
  const nav = (vista) => () => {
    vistaActual.value = vista
  }

  return {
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
    tieneDatosGuardados,
    reunionesValidas,
    agregarDirigente,
    eliminarDirigente,
    agregarDiagnostico: () => agregarFila(diagnosticos),
    eliminarDiagnostico: (id) => eliminarFila(diagnosticos, id),
    agregarEnfasis: () => agregarFila(enfasis),
    eliminarEnfasis: (id) => eliminarFila(enfasis, id),
    generarSemanas,
    limpiarDatos,
    crearNuevoCiclo,
    irAModuloA: nav('moduloA'),
    volverModuloA: nav('moduloA'),
    irAModuloB: nav('moduloB'),
    irAModuloC: nav('moduloC'),
    irAEvaluacion: nav('evaluacion'),
    irADirigentes: nav('dirigentes'),
    irALanding: nav('landing')
  }
})
