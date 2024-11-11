import type { App } from 'vue'
import VueProductTour from './components/VueProductTour.vue'

// Export component for individual use
export { VueProductTour }

// Install function for the plugin system
export default {
  install(app: App) {
    app.component('VueProductTour', VueProductTour)
  },
}
