'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    // NODE_ENV: '"development"',
    BASE_URL: '/',
    proxyTable: [
        {
            context: ['/api/**', '/user/**'],
            bypass: function(req, res, proxyOptions) {
                if (/^\/api\/.*/.test(req.url) || /^\/user\/.*/.test(req.url)) {
                    req.method = 'GET'
                    return '/mock' + req.url + '.json'
                }
            }
        }
    ]
})
