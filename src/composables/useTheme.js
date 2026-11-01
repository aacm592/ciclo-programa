import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

/**
 * Determina el tema inicial de forma síncrona para evitar parpadeos visuales (FOUC).
 * Prioridad: 1. Preferencia guardada en localStorage, 2. Preferencia del sistema operativo.
 * @returns {boolean} true si debe activarse el modo oscuro
 */
const resolverTemaInicial = () => {
  if (typeof window === 'undefined') return false

  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (guardado !== null) {
      return guardado === 'dark'
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  } catch (error) {
    console.warn('[useTheme] No se pudo leer localStorage:', error)
    return false
  }
}

/**
 * Aplica o remueve la clase 'dark' en el elemento raíz del DOM.
 * @param {boolean} dark
 */
const aplicarClaseDom = (dark) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }
}

/**
 * Guarda la preferencia en localStorage de forma segura.
 * @param {boolean} dark
 */
const persistirTema = (dark) => {
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch (error) {
    console.warn('[useTheme] No se pudo persistir en localStorage:', error)
  }
}

// Estado singleton compartido en todo el ciclo de vida de la aplicación
const isDarkMode = ref(resolverTemaInicial())

// Aplicar clase inmediatamente al cargar el módulo
aplicarClaseDom(isDarkMode.value)

// Sincronizar cambios en DOM y localStorage
watch(isDarkMode, (dark) => {
  aplicarClaseDom(dark)
  persistirTema(dark)
})

/**
 * Composable para la gestión reactiva del tema claro / oscuro (Dark Mode).
 * @returns {{
 *   isDarkMode: import('vue').Ref<boolean>,
 *   toggleTheme: () => void,
 *   setTheme: (dark: boolean) => void
 * }}
 */
export function useTheme() {
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setTheme = (dark) => {
    isDarkMode.value = Boolean(dark)
  }

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  }
}
