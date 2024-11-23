/*!
 * Your Library Name v1.0.0
 * (c) [Year] [Your Name or Organization]
 * Released under the MIT License
 * https://opensource.org/licenses/MIT
 */
import type { App } from 'vue'
import VueOnboardingTour from './components/VueOnboardingTour.vue'
// @ts-ignore
import VueSafeHTML from 'vue-safe-html'
import './assets/main.css'


// Install function for the plugin system
export default {
  install(app: App) {
    app.use(VueSafeHTML)
    app.component('VueOnboardingTour', VueOnboardingTour)
  },
}
