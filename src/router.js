import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import User from './views/nav1/User.vue'
import Password from './views/nav1/Password.vue'
import SensorList from './views/nav2/SensorList.vue'
import Sensor from './views/nav2/Sensor.vue'

Vue.use(Router)

export default new Router({
  base: '/soil/',
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '个人中心',
      iconCls: 'el-icon-message',
      children: [
        { path: '/user', component: User, name: '个人信息' },
        { path: '/password', component: Password, name: '更改密码' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '传感器',
      iconCls: 'fa fa-id-card-o',
      children: [
        { path: '/sensorList', component: SensorList, name: '传感器列表' },
        { path: '/sensor', component: Sensor, name: '传感器信息', hidden: true }
      ]
    }
  ]
})
