import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: require('components/List')
  },
  {
    path: '/datapicker',
    component: require('components/PageDatepicker')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
/* eslint-disable no-new */
new Vue({
  template: '<App/>',
  components: { App },
  router
}).$mount('#app')
