// src/plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight, faCircle, faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft, faChevronRight, faXmark, faCircle)

export default {
  install(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
  }
}
