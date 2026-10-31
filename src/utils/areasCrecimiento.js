import lobatosRaw from '../data/objetivosEducativosLobatos.txt?raw'
import exploradoresRaw from '../data/objetivosEducativosExploradores.txt?raw'
import pionerosRaw from '../data/objetivosEducativosPioneros.txt?raw'
import roversRaw from '../data/objetivosEducativosRovers.txt?raw'

export const RAMAS = [
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
]

export const areasCrecimiento = [
  'Corporalidad',
  'Creatividad',
  'Carácter',
  'Afectividad',
  'Sociabilidad',
  'Espiritualidad'
]

// Estructura base vacía por cada área
const crearEstructuraAreaVacia = () => {
  const estructura = {}
  areasCrecimiento.forEach((area) => {
    estructura[area] = { media: [], tardia: [] }
  })
  return estructura
}

// Función para parsear texto plano a estructura de objetos
const parsearTextoAObjetivos = (textoPlano) => {
  const areaObj = crearEstructuraAreaVacia()
  const lineas = textoPlano.split(/\r?\n/)

  for (const linea of lineas) {
    const lineaLimpia = linea.trim()
    if (!lineaLimpia || lineaLimpia.startsWith('#')) continue

    const [area, etapa, ...resto] = lineaLimpia.split('|')
    const objetivo = resto.join('|').trim()

    const a = area?.trim()
    const e = etapa?.trim().toLowerCase()

    if (areaObj[a]?.[e]) {
      areaObj[a][e].push(objetivo)
    }
  }

  return areaObj
}

// Consolidar las 4 ramas utilizando sus respectivos archivos de texto
export const objetivosPorRama = {
  lobatos: parsearTextoAObjetivos(lobatosRaw),
  exploradores: parsearTextoAObjetivos(exploradoresRaw),
  pioneros: parsearTextoAObjetivos(pionerosRaw),
  rovers: parsearTextoAObjetivos(roversRaw)
}
