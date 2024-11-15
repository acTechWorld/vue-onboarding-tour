import './assets/main.css'
import VueOnboardingTour from 'vue-onboarding-tour'
import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)
createApp(App).use(VueOnboardingTour).mount('#app')
