import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import VueSafeHTML from 'vue-safe-html'
import '../src/assets/main.css'

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
