import { asyncRoutes, constantRoutes } from '@/router'
import request from '@/utils/request'
// import { getUserInfo } from '@/store/user'

function getPermission(token) {
    return request({
        url: '/api/permission',
        method: 'post',
        params: { token }
    })
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
export function hasPermission(authData, route) {
    if (route.meta && route.meta.authCode) {
        return authData.codes.includes(route.meta.authCode)
    }
    return false
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, authData) {
    const res = []
    routes.forEach(route => {
        if (hasPermission(authData, route)) {
            res.push(route)
            if (route.children) {
                route.children = filterAsyncRoutes(route.children, authData)
            }
        }
    })

    return res
}

function formatAuthData(res, list) {
    list.forEach(item => {
        if (!item.permitId) {
            return
        }
        res.codes.push(item.permitId)
        res.data[item.permitId] = {
            name: item.name,
            value: item.permitId,
            path: item.url
        }

        if (item.subList && item.subList.length) {
            formatAuthData(res, item.subList)
        }
    })
}

const permission = {
    state: {
        routes: [],
        dynamicRoutes: [],
        authData: {}
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.dynamicRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        SET_PERMISSIONS: (state, authData) => {
            state.authData = authData
        }
    },
    actions: {
        // 获取权限信息
        GetPermissions: async function({ commit, state }) {
            const res = await getPermission()
            if (res.success) {
                const authData = {
                    codes: [],
                    data: {}
                }
                // data首层指不同系统,数据结构与subList不同
                formatAuthData(authData, res.data[0].subList)
                commit('SET_PERMISSIONS', { ...authData })
                return { success: res.success, authData }
            } else {
                return new Error('Verification failed, please check your role.')
            }
        },
        GenerateRoutes: function({ commit }, data) {
            const { authData, roles } = data
            let accessedRoutes
            if (roles === 1) {
                accessedRoutes = asyncRoutes
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, authData)
            }
            commit('SET_ROUTES', accessedRoutes)
            return accessedRoutes
        }
    }
}

export default permission
