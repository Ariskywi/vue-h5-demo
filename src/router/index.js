import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
// import Layout from '@/views/layout/Layout'

Vue.use(Router)

export const constantRoutes = [
    {
        path: '',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'home',
        meta: {
            authCode: 'C21001'
        },
        component: () => import(/* webpackChunkName: "Index" */ '@/views/home/index')
    },
    {
        path: '/404',
        component: () => import(/* webpackChunkName: "Page404" */ '@/views/errorPage/404'),
        hidden: true
    }
]

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.BASE_URL,
    routes: constantRoutes
})

export const asyncRoutes = [{ path: '*', redirect: '/404', hidden: true }]
