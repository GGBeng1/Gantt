import Gantt from './ymEditor/index.vue'
import type { App } from 'vue'

// 定义 install 方法
const install = function (app: App) {
	Gantt.name && app.component(Gantt.name, Gantt)
}

if (window?.Vue) {
	window.Gantt = Gantt
}
export { Gantt, install as default }
