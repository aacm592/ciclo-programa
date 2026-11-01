import {
  CLAVE_ESTADO,
  CLAVE_DIRIGENTES,
  RAMA_DEFAULT,
  crearEncabezadoBase,
  crearFilasBase
} from './cicloModel'

/**
 * Lee y parsea JSON desde localStorage con manejo seguro de excepciones.
 * @template T
 * @param {string} clave
 * @param {T} porDefecto
 * @returns {T}
 */
export const leerStorage = (clave, porDefecto = null) => {
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
export const escribirStorage = (clave, valor) => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch (error) {
    console.error(`[cicloStore] Error al guardar "${clave}" en localStorage:`, error)
  }
}

/**
 * Elimina una clave de localStorage con manejo seguro de excepciones.
 * @param {string} clave
 */
export const removerStorage = (clave) => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.removeItem(clave)
  } catch (error) {
    console.error(`[cicloStore] Error al remover "${clave}" de localStorage:`, error)
  }
}

/**
 * Carga e hidrata el estado persistido del ciclo desde localStorage.
 * @returns {object|null}
 */
export const cargarEstadoCiclo = () => {
  const guardado = leerStorage(CLAVE_ESTADO)
  if (!guardado) return null

  return {
    encabezado: guardado.encabezado
      ? { ...crearEncabezadoBase(), ...guardado.encabezado }
      : crearEncabezadoBase(),
    diagnosticos: Array.isArray(guardado.diagnosticos) ? guardado.diagnosticos : crearFilasBase(),
    enfasis: Array.isArray(guardado.enfasis) ? guardado.enfasis : crearFilasBase(),
    juegoDemocratico:
      typeof guardado.juegoDemocratico === 'string' ? guardado.juegoDemocratico : '',
    actividadesSeleccionadas: Array.isArray(guardado.actividadesSeleccionadas)
      ? guardado.actividadesSeleccionadas
      : ['', '', ''],
    cronograma: Array.isArray(guardado.cronograma) ? guardado.cronograma : [],
    rama: guardado.rama || RAMA_DEFAULT
  }
}

/**
 * Carga la lista de dirigentes persistida desde localStorage.
 * @returns {string[]}
 */
export const cargarDirigentes = () => {
  const guardados = leerStorage(CLAVE_DIRIGENTES, [])
  return Array.isArray(guardados) ? guardados : []
}

/**
 * Persiste los datos del ciclo en localStorage.
 * @param {object} datos
 */
export const guardarEstadoCiclo = (datos) => {
  escribirStorage(CLAVE_ESTADO, datos)
}

/**
 * Persiste la lista de dirigentes en localStorage.
 * @param {string[]} dirigentes
 */
export const guardarDirigentes = (dirigentes) => {
  escribirStorage(CLAVE_DIRIGENTES, dirigentes)
}

/**
 * Elimina el ciclo guardado en localStorage.
 */
export const borrarEstadoCiclo = () => {
  removerStorage(CLAVE_ESTADO)
}
