import { createApp } from "vue";

import App from "./App.vue";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen , faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

library.add(faPen, faTrash, faPlus)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount("#app");