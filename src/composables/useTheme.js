import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'theme'

export function useTheme() {
  const isDarkMode = ref(false)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  onMounted(() => {
    isDarkMode.value = localStorage.getItem(STORAGE_KEY) === 'dark'
  })

  watch(isDarkMode, (dark) => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  })

  return { isDarkMode, toggleTheme }
}
