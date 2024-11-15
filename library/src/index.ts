import type { App } from 'vue'
import VueOnboardingTour from './components/VueOnboardingTour.vue'
import FontAwesomePlugin from '@/plugins/fontawesome'
import VueSafeHTML from 'vue-safe-html'
import './assets/main.css'


// Install function for the plugin system
export default {
  install(app: App) {
    app.use(FontAwesomePlugin)
    app.use(VueSafeHTML)
    app.component('VueOnboardingTour', VueOnboardingTour)
  },
}
