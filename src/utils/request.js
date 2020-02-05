import axios from 'axios'
import config from './config'
import { Notify } from 'vant'

// create an axios instance
const instance = axios.create({
    baseURL: config.apiUrl, // api 的 base_url
    timeout: 5 * 1000 // instance timeout 5000
})

export const setToken = token => {
    // Alter defaults after instance has been created
    instance.defaults.headers.common['Authorization'] = token
    sessionStorage.setItem('token', token)
}

export const removeToken = () => {
    // instance.defaults.headers.common['Authorization'] = null
    sessionStorage.removeItem('token')
}

// instance interceptor
instance.interceptors.request.use(
    config => {
        // 判断请求的类型
        // 如果是post请求就把默认参数拼到data里面
        // 如果是get请求就拼到params里面
        if (config.method === 'post') {
            config.data = {
                ...config.data
            }
        }
        if (config.method === 'get') {
            config.params = {
                ...config.data
            }
        }
        console.log(`%c req: ${config.url}`, 'color:#5161d2', config.data)
        return config
    },
    error => {
        Notify({
            message: error,
            type: 'warning',
            duration: 3 * 1000
        })
        Promise.reject(error)
    }
)

// response interceptor
instance.interceptors.response.use(
    response => {
        console.log(`%c res:`, 'color:#32bd0f', response)
        if (!response.data.success) {
            Notify({
                message: response.data.message,
                type: 'warning',
                duration: 3 * 1000
            })
        }
        return response
    },
    error => {
        Notify({
            message: error.message,
            type: 'warning',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

const request = params => {
    return instance(params).then(res => {
        res = res.data
        return res
    })
}

export default request
