import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import User from './views/nav1/User.vue'
import Password from './views/nav1/Password.vue'
import SensorList from './views/nav2/SensorList.vue'
import Sensor from './views/nav2/Sensor.vue'
import UsersTable from './views/nav3/UsersTable.vue'
import InfoTable from './views/nav4/InfoTable'
import AdminHome from './views/AdminHome.vue'
import HomePage from './views/HomePage.vue'
import SensorPrint from './views/nav2/SensorPrint.vue'
import SensorTable from './views/nav2/SensorTable.vue'
import AddSensor from './views/nav2/AddSensor.vue'
import Backup from './views/nav5/Backup.vue'
import Admin from './views/nav6/Admin.vue'
import AdminPass from './views/nav6/AdminPass.vue'
import AdminHomePage from './views/AdminHomePage.vue'
import AdminTable from './views/nav7/AdminTable.vue'
import AddAdmin from './views/nav7/AddAdmin.vue'
import SuperHome from './views/SuperHome.vue'

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
      path: '/homePage',
      component: HomePage,
      name: '',
      hidden: true
    },
    {
      path: '/adminHomePage',
      component: AdminHomePage,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '个人中心',
      iconCls: 'el-icon-user',
      children: [
        { path: '/user', component: User, name: '个人信息' },
        { path: '/password', component: Password, name: '更改密码' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '测点管理',
      iconCls: 'el-icon-view',
      children: [
        { path: '/sensorTable', component: SensorTable, name: '测点列表' },
        { path: '/sensorList', component: SensorList, name: '实时显示' },
        { path: '/addSensor', component: AddSensor, name: '增加测点' },
        { path: '/sensor', component: Sensor, name: '测点信息', hidden: true },
        { path: '/printSensor', component: SensorPrint, name: '报表打印' }
      ]
    },
    {
      path: '/',
      component: AdminHome,
      name: '用户管理',
      iconCls: 'el-icon-s-custom',
      admin: true,
      children: [
        { path: '/usersTable', component: UsersTable, name: '用户列表', admin: true }
      ]
    },
    {
      path: '/',
      component: AdminHome,
      name: '信息管理',
      iconCls: 'el-icon-edit-outline',
      admin: true,
      children: [
        { path: '/infoTable', component: InfoTable, name: '信息列表', admin: true }
      ]
    },
    {
      path: '/',
      component: AdminHome,
      name: '数据库管理',
      iconCls: 'el-icon-folder',
      admin: true,
      children: [
        { path: '/db_backup', component: Backup, name: '数据库备份', admin: true }
      ]
    },
    {
      path: '/',
      component: AdminHome,
      name: '个人信息',
      iconCls: 'el-icon-user',
      admin: true,
      children: [
        { path: '/admin', component: Admin, name: '个人信息', admin: true },
        { path: '/adminPassword', component: AdminPass, name: '更改密码', admin: true }
      ]
    },
    {
      path: '/',
      component: SuperHome,
      name: '管理员管理',
      iconCls: 'el-icon-user',
      super: true,
      children: [
        { path: '/adminTable', component: AdminTable, name: '管理员列表', super: true },
        { path: '/addAdmin', component: AddAdmin, name: '添加管理员', super: true }
      ]
    }
  ]
})
