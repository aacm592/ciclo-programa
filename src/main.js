import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

/**
 * Inicialización de la aplicación Vue 3 con store global Pinia
 */
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
