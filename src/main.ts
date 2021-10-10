import { createApp } from 'vue'
import 'virtual:windi.css'
import 'virtual:windi-devtools'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
