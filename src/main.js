import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

Vue.config.productionTip = false

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://106.15.196.17:8011/v1'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  let user = JSON.parse(localStorage.getItem('user'));
  if (user && (to.path == '/login' || to.path == '/' )) {
    next({ path: '/sensorList' })
  }
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
