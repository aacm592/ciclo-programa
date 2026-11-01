/**
 * Constantes y estructuras base para el ciclo de programa scout.
 */

export const CLAVE_ESTADO = 'scout_estado_ciclo'
export const CLAVE_DIRIGENTES = 'scout_dirigentes'
export const RAMA_DEFAULT = 'lobatos'
export const MIN_FILAS_DIAGNOSTICO = 3

export const MESES = Object.freeze([
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
 * @returns {number}
 */
export const generarId = () => Date.now() + Math.floor(Math.random() * 1000)

/**
 * Estructura inicial del encabezado general del ciclo.
 * @returns {{distrito: string, grupo: string, tropa: string, cicloNumero: number, fechaInicio: string, fechaFin: string}}
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
 * @returns {Array<{id: number, texto: string}>}
 */
export const crearFilasBase = () => [
  { id: 1, texto: '' },
  { id: 2, texto: '' },
  { id: 3, texto: '' }
]

/**
 * Estructura inicial para el cuestionario de evaluación de una reunión.
 * @returns {{cumplePrograma: string, cumpleObjetivo: string, contribuyeObjetivos: string, coherenciaEnfasis: string}}
 */
export const crearEvaluacionBase = () => ({
  cumplePrograma: '',
  cumpleObjetivo: '',
  contribuyeObjetivos: '',
  coherenciaEnfasis: ''
})

/**
 * Estructura base completa del Módulo C para una reunión individual.
 * @returns {object}
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
