import { createApp } from 'vue'
import App from './App.vue'
import Gantt from '@lib/package'
const app = createApp(App)
app.use(Gantt)
app.mount('#app')
