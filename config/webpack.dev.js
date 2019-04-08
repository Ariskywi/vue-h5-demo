'use strict'
const utils = require('../build/utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const config = require('../config')
const portfinder = require('portfinder')
const baseWebpackConfig = require('./webpack.base')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const manifest = require('../public/manifest_vendor')
const vendor = '/static/js/' + manifest.name.replace('_', '.') + '.js'

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    stats: { modules: true, chunks: true, children: false },
    output: {
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: 'static/js/[name].chunk.js'
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
                    importLoaders: 1,
                    sourceMap: config.dev.cssSourceMap,
                    usePostCSS: true
                })
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
                test: cssModuleRegex,
                use: utils.getStyleLoaders({
                    importLoaders: 1,
                    modules: true,
                    sourceMap: config.dev.cssSourceMap,
                    usePostCSS: true
                })
            },
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        sourceMap: config.dev.cssSourceMap,
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
                        sourceMap: config.dev.cssSourceMap,
                        usePostCSS: true
                    },
                    'less-loader'
                )
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // Chains the sass-loader with the css-loader and the style-loader
            // to immediately apply all styles to the DOM.
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
                test: sassRegex,
                exclude: sassModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        indentedSyntax: true,
                        sourceMap: config.dev.cssSourceMap,
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
                        sourceMap: config.dev.cssSourceMap,
                        usePostCSS: true
                    },
                    'sass-loader'
                )
            }
        ]
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(
                        config.dev.assetsPublicPath,
                        'index.html'
                    )
                }
            ]
        },
        inline: true,
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        // quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        // HMR shows correct file names in console on update.
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            inject: 'body',
            filename: 'index.html',
            template: 'build/index.html',
            vendor
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../public'),
                to: config.dev.assetsSubDirectory + '/js',
                ignore: ['.*']
            }
        ])
    ],
    performance: {
        hints: false
    }
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
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
                            `Your application is running here: http://${
                                devWebpackConfig.devServer.host
                            }:${port}`
                        ]
                    },
                    onErrors: config.dev.notifyOnErrors
                        ? utils.createNotifierCallback()
                        : undefined
                })
            )

            resolve(devWebpackConfig)
        }
    })
})
