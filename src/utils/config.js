// mock配置
const mockConfig = {
    url: ''
}
// 开发环境配置
const devProtocol = 'http://'
const devHost = '10.10.200.50'
const devPort = 80
const devConfig = {
    host: devHost,
    port: devPort,
    url: `${devProtocol}${devHost}:${devPort}`,
    apiUrl: `${devProtocol}${devHost}:${devPort}/mock/80`
}

// 生产环境配置
const proProtocol = 'http://'
const staticHost = 'www.bhfae.com'

const apiProtocol = 'https://'
const apiHost = 'test.bhfae.com'
const apiPort = 80

const proConfig = {
    host: apiHost,
    port: apiPort,
    url: `${proProtocol}${staticHost}`,
    apiUrl: `${apiProtocol}${apiHost}`
}

let config = mockConfig

if (process.env.NODE_ENV === 'development') {
    config = devConfig
}
if (process.env.NODE_ENV === 'production') {
    config = proConfig
}

// 主题颜色
export const globalStyles = {
    textColor: 'rgb(26, 183, 234)',
    themeColor: 'rgb(48, 65, 86)'
}
// 框选颜色
export const rectStyles = {
    fillStyle: 'rgba(193, 255, 252, 0.35)',
    strokeStyle: 'rgba(0, 72, 181, 0.95)',
    lineWidth: 1,
    lineJoin: 'miter'
}

export default config
