import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

Vue.config.productionTip = false

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:9003'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('Authorization')
  let aToken = sessionStorage.getItem('Authorization')
  if ((token && token !== '') && (to.path === '/login' || to.path === '/')) {
    next({ path: '/homePage' })
  }
  if ((!token && !aToken) && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('Authorization')
  let aToken = sessionStorage.getItem('Authorization')
  if (token) {
    config.headers.common['Authorization'] = 'Bearer ' + token
  } else if (aToken) {
    config.headers.common['Authorization'] = 'Bearer ' + aToken
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  if (response.data.code === 403) {
    localStorage.removeItem('Authorization')
    sessionStorage.removeItem('Authorization')
    router.replace({
      path: '/login'
    })
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
