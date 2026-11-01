export const CLAVE_ESTADO = 'scout_estado_ciclo'
export const CLAVE_DIRIGENTES = 'scout_dirigentes'
export const RAMA_DEFAULT = 'lobatos'
export const MIN_FILAS = 3

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

export const generarId = () => Date.now() + Math.floor(Math.random() * 1000)

export const crearEncabezadoBase = () => ({
  distrito: 'Cochabamba',
  grupo: 'Kairos',
  tropa: '',
  cicloNumero: 1,
  fechaInicio: '',
  fechaFin: ''
})

export const crearFilasBase = () => [
  { id: 1, texto: '' },
  { id: 2, texto: '' },
  { id: 3, texto: '' }
]

export const crearEvaluacionBase = () => ({
  cumplePrograma: '',
  cumpleObjetivo: '',
  contribuyeObjetivos: '',
  coherenciaEnfasis: ''
})

export const crearProgramaBase = () => ({
  responsables: [],
  responsablesOtro: '',
  objetivo: '',
  horario: [
    {
      id: 1,
      hora: '15:00',
      duracion: 15,
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

export const storage = {
  leer(clave, porDefecto = null) {
    try {
      const v = localStorage.getItem(clave)
      return v ? JSON.parse(v) : porDefecto
    } catch {
      return porDefecto
    }
  },
  escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {}
  },
  remover(clave) {
    try {
      localStorage.removeItem(clave)
    } catch {}
  }
}

export const generarSabados = (fechaInicio, fechaFin, cronogramaPrevio = []) => {
  if (!fechaInicio || !fechaFin)
    return { error: 'Debes definir las fechas de inicio y fin en el encabezado.' }
  const actual = new Date(`${fechaInicio}T12:00:00`)
  const fin = new Date(`${fechaFin}T12:00:00`)

  if (isNaN(actual) || isNaN(fin)) return { error: 'Una de las fechas ingresadas no es válida.' }
  if (actual > fin) return { error: 'La fecha de fin debe ser posterior a la fecha de inicio.' }

  const semanas = []
  while (actual.getDay() !== 6 && actual <= fin) actual.setDate(actual.getDate() + 1)

  while (actual <= fin) {
    const fecha = `${actual.getDate()}-${actual.getMonth() + 1}-${actual.getFullYear().toString().slice(-2)}`
    const existente = cronogramaPrevio.find((s) => s.fecha === fecha)
    const base = crearProgramaBase()

    semanas.push({
      fecha,
      mes: MESES[actual.getMonth()],
      actividad: existente?.actividad ?? '',
      cancelado: existente?.cancelado ?? false,
      motivoCancelacion: existente?.motivoCancelacion ?? '',
      programa: {
        ...base,
        ...(existente?.programa ?? {}),
        evaluacion: { ...base.evaluacion, ...(existente?.programa?.evaluacion ?? {}) }
      }
    })
    actual.setDate(actual.getDate() + 7)
  }

  if (!semanas.length)
    return { error: 'El rango de fechas seleccionado no contiene ningún sábado.' }
  return { semanas }
}
