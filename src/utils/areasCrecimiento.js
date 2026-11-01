import lobatosRaw from '../data/objetivosEducativosLobatos.txt?raw'
import exploradoresRaw from '../data/objetivosEducativosExploradores.txt?raw'
import pionerosRaw from '../data/objetivosEducativosPioneros.txt?raw'
import roversRaw from '../data/objetivosEducativosRovers.txt?raw'

/**
 * Ramas del Movimiento Scout disponibles en el sistema con sus respectivas etapas de desarrollo.
 * @readonly
 */
export const RAMAS = Object.freeze([
  {
    id: 'lobatos',
    nombre: 'Lobatos',
    etapas: [
      { clave: 'media', etiqueta: 'Cachorros' },
      { clave: 'tardia', etiqueta: 'Lobatos' }
    ]
  },
  {
    id: 'exploradores',
    nombre: 'Exploradores',
    etapas: [
      { clave: 'media', etiqueta: 'Pista' },
      { clave: 'tardia', etiqueta: 'Senda' }
    ]
  },
  {
    id: 'pioneros',
    nombre: 'Pioneros',
    etapas: [
      { clave: 'media', etiqueta: 'Etapa 1' },
      { clave: 'tardia', etiqueta: 'Etapa 2' }
    ]
  },
  {
    id: 'rovers',
    nombre: 'Rovers',
    etapas: [
      { clave: 'media', etiqueta: 'Horquilla' },
      { clave: 'tardia', etiqueta: 'Encuentro' }
    ]
  }
])

/**
 * Las seis áreas de crecimiento scout.
 * @readonly
 */
export const areasCrecimiento = Object.freeze([
  'Corporalidad',
  'Creatividad',
  'Carácter',
  'Afectividad',
  'Sociabilidad',
  'Espiritualidad'
])

/**
 * Crea una estructura base vacía por cada área de crecimiento.
 * @returns {Record<string, { media: string[], tardia: string[] }>}
 */
export const crearEstructuraAreaVacia = () => {
  const estructura = {}
  for (const area of areasCrecimiento) {
    estructura[area] = { media: [], tardia: [] }
  }
  return estructura
}

/**
 * Parsea un archivo de texto plano con formato "Área | Etapa | Objetivo"
 * a una estructura de datos categorizada por área y etapa.
 *
 * @param {string} [textoPlano=''] Contenido crudo del archivo de texto
 * @returns {Record<string, { media: string[], tardia: string[] }>}
 */
export const parsearTextoAObjetivos = (textoPlano = '') => {
  const areaObj = crearEstructuraAreaVacia()
  if (!textoPlano || typeof textoPlano !== 'string') {
    return areaObj
  }

  const lineas = textoPlano.split(/\r?\n/)

  for (const linea of lineas) {
    const lineaLimpia = linea.trim()
    if (!lineaLimpia || lineaLimpia.startsWith('#')) continue

    const partes = lineaLimpia.split('|')
    if (partes.length < 3) continue

    const [areaRaw, etapaRaw, ...resto] = partes
    const objetivo = resto.join('|').trim()
    const area = areaRaw?.trim()
    const etapa = etapaRaw?.trim().toLowerCase()

    if (area && areaObj[area] && (etapa === 'media' || etapa === 'tardia') && objetivo) {
      areaObj[area][etapa].push(objetivo)
    }
  }

  return areaObj
}

/**
 * Busca los metadatos de una rama por su ID único.
 * @param {string} id - Identificador de la rama ('lobatos', 'exploradores', etc.)
 * @returns {object} Metadatos de la rama encontrada o Lobatos por defecto
 */
export const obtenerRamaPorId = (id) => {
  return RAMAS.find((r) => r.id === id) ?? RAMAS[0]
}

/**
 * Consolidación de objetivos educativos para las 4 ramas del escultismo.
 * @readonly
 */
export const objetivosPorRama = Object.freeze({
  lobatos: parsearTextoAObjetivos(lobatosRaw),
  exploradores: parsearTextoAObjetivos(exploradoresRaw),
  pioneros: parsearTextoAObjetivos(pionerosRaw),
  rovers: parsearTextoAObjetivos(roversRaw)
})
