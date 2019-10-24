import Vue from 'vue'
import router from '.'
import store from '../store'
import { Toast } from 'vant'
import { getToken } from '@/utils/auth' // get token from sessionStorage

const whiteList = ['index', '/login'] // no redirect whitelist

Vue.use(Toast)

router.beforeEach(async (to, from, next) => {
    // 暂时使用token来判定是否已登录,后续可能需要更改为sessionId
    // has token
    if (getToken() || store.getters.token) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            let roles = store.getters.roles
            // 没有用户信息则请求登录信息
            if (!roles) {
                const res = await store.dispatch('GetUserInfo')
                if (res.success) {
                    roles = res.data.roles
                }
            }

            // 无动态路由信息
            if (store.getters.dynamicRoutes.length === 0) {
                // 请求权限
                const res = await store.dispatch('GetPermissions')
                if (res.success) {
                    const { authData } = res
                    const accessRoutes = await store.dispatch('GenerateRoutes', { authData, roles })
                    // 动态添加路由
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                } else {
                    // 请求权限失败,退出
                    await store.dispatch('FedLogOut')
                    Toast.fail(res.errorMsg)
                    next({ path: '/' })
                }
            } else {
                next()
            }
        }
    } else {
        // has no token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        }
    }
})
