import Vue from 'vue'
import Router from 'vue-router'
import { loadView } from '../utils'
// import HelloWorld from '@/components/HelloWorld'
// const HelloWorld = () => import(/* webpackChunkName: "HelloWorld" */ `@/components/HelloWorld`)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      // component: HelloWorld
      component: loadView('HelloWorld')
    }
  ]
})
