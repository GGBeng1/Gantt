import { createApp } from 'vue'
import App from './App.vue'
import Gantt from '@lib/package'
import element from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(element)
app.use(Gantt)
app.mount('#app')
