/*!
 * Your Library Name v1.0.0
 * (c) [Year] [Your Name or Organization]
 * Released under the MIT License
 * https://opensource.org/licenses/MIT
 */
import { type App } from 'vue'
import VueOnboardingTour from './components/VueOnboardingTour.vue'
// @ts-ignore
import './assets/main.css'

export type { OnboardingTourProps } from './components/VueOnboardingTour.vue'
// Install function for the plugin system

export {VueOnboardingTour}
export default {
  install(app: App) {
    app.component('VueOnboardingTour', VueOnboardingTour)
  },
}
