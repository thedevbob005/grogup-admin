import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Bars from './views/Bars.vue'
import Menus from './views/Menus.vue'
import Features from './views/Features.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/bars',
      name: 'bars',
      component: Bars
    },
    {
      path: '/menus',
      name: 'menus',
      component: Menus
    },
    {
      path: '/features',
      name: 'features',
      component: Features
    }
  ]
})
