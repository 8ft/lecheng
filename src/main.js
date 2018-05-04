import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config/routes'

import App from './App.vue'
import Utils from './utils/index'
import Fastclick from 'fastclick'
import Components from './components/index'

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: routes
})

Vue.$router=router;
Vue.use(Utils);
Vue.use(Components);

Fastclick.attach(document.body);

if (isLecheng) {
  let appConfig = require('./config/platform/appConfig');
  appConfig(Vue, router);
} else if (/MicroMessenger/.test(navigator.userAgent)) {
  let wxConfig = require('./config/platform/wxConfig');
  wxConfig(Vue, router);
}

const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')

window.eventBus = new Vue();











