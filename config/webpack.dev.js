'use strict'

const path = require('path')
const utils = require('../build/utils')
const env = require('../config/dev.env')
const webpack = require('webpack')
const merge = require('webpack-merge')
const portfinder = require('portfinder')
const baseWebpackConfig = require('./webpack.base')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const manifest = require('../public/manifest_vendor')
const vendor = './static/js/' + manifest.name.replace('_', '.') + '.js'

const devPublicPath = '/'
const assetsSubDirectory = 'static'

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    // cheap-module-eval-source-map is faster for development
    devtool: 'cheap-module-eval-source-map',
    stats: {
        modules: true,
        chunks: true,
        children: false,
        chunkModules: false
    },
    output: {
        chunkFilename: utils.assetsPath('js/[name].js')
    },
    module: {
        rules: [
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
                test: cssRegex,
                exclude: cssModuleRegex,
                use: utils.getStyleLoaders({
                    sourceMap: true,
                    usePx2rem: true,
                    usePostCSS: true
                })
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
                test: cssModuleRegex,
                use: utils.getStyleLoaders({
                    modules: true,
                    sourceMap: true,
                    usePx2rem: true,
                    usePostCSS: true
                })
            },
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        sourceMap: true,
                        usePx2rem: true,
                        usePostCSS: true
                    },
                    'less-loader'
                )
            },
            {
                test: lessModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        modules: true,
                        sourceMap: true,
                        usePx2rem: true,
                        usePostCSS: true
                    },
                    'less-loader'
                )
            },
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
                test: sassRegex,
                exclude: sassModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        indentedSyntax: true,
                        sourceMap: true,
                        usePx2rem: true,
                        usePostCSS: true
                    },
                    'sass-loader'
                )
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
                test: sassModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        modules: true,
                        indentedSyntax: true,
                        sourceMap: true,
                        usePx2rem: true,
                        usePostCSS: true
                    },
                    'sass-loader'
                )
            }
        ]
    },
    plugins: [
        // new webpack.DefinePlugin(utils.getClientEnvironment('/').stringified),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(env)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: 'body',
            filename: 'index.html',
            template: 'build/index.html',
            vendor
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/assets/favicon'),
                to: '',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../public'),
                to: `${assetsSubDirectory}/js`,
                ignore: ['.*']
            }
        ])
    ],
    performance: {
        hints: false
    },
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(devPublicPath, 'index.html')
                }
            ]
        },
        inline: true,
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: 'localhost',
        port: 3000,
        open: true,
        overlay: { warnings: false, errors: true },
        publicPath: devPublicPath,
        proxy: {},
        // quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: false
        }
    }
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = 3000
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
                        ]
                    },
                    onErrors: utils.createNotifierCallback()
                })
            )

            resolve(devWebpackConfig)
        }
    })
})
