import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { plugin } from "vue-function-api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/base.css";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";

Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(plugin);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
