import { getToken } from '@/utils/auth'
import request, { setToken } from '@/utils/request'

export function login(username, password) {
    const data = {
        username,
        password
    }
    return request({
        url: '/api/login',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/api/logout',
        method: 'post'
    })
}

export function getUserInfo() {
    return request({
        url: '/api/user/info',
        method: 'post'
    })
}

const user = {
    state: {
        user: '',
        status: '',
        token: getToken(),
        name: '',
        avatar: '',
        roles: null,
        setting: {}
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername: async function({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const res = await login(username, userInfo.password)
            if (res.success) {
                const data = res.data
                commit('SET_TOKEN', data.token)
                setToken(data.token)
            } else {
                return new Error('请求失败')
            }
        },

        // 获取用户信息
        GetUserInfo: async function({ commit, state }) {
            const res = await getUserInfo()
            if (res.success) {
                const data = res.data
                commit('SET_ROLES', data.roles)
                commit('SET_NAME', data.name)
                commit('SET_AVATAR', data.avatar)
                return res
            } else {
                return new Error('Verification failed, please login again.')
            }
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        commit('SET_TOKEN', '')
                        commit('SET_ROLES', [])
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        // 动态修改权限
        ChangeRoles({ commit, dispatch }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                getUserInfo(role).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.roles)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
                    resolve()
                })
            })
        }
    }
}

export default user
