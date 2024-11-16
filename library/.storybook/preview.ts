import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import VueSafeHTML from 'vue-safe-html'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '../src/assets/main.css'

library.add(fas)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}
setup((app) => {
  app.use(VueSafeHTML)
})
export default preview
