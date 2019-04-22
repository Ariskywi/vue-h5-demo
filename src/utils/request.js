import axios from 'axios'
import config from './config'
import { Message } from 'element-ui'

// create an axios instance
const instance = axios.create({
    baseURL: config.apiUrl, // api 的 base_url
    timeout: 5000 // instance timeout
})

export const setToken = token => {
    // Alter defaults after instance has been created
    instance.defaults.headers.common['Authorization'] = token
    sessionStorage.setItem('token', token)
}

// instance interceptor
instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        Message({
            message: error,
            type: 'error',
            duration: 5 * 1000
        })
        Promise.reject(error)
    }
)

// response interceptor
instance.interceptors.response.use(
    response => response,
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

const request = params => {
    return instance(params).then(res => res.data)
}

export default request
