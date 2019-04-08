'use strict'
import path from 'path'
import utils from '../build/utils'
import webpack from 'webpack'
import config from '../config'
import merge from 'webpack-merge'
import baseWebpackConfig from './webpack.base'

import TerserPlugin from 'terser-webpack-plugin'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const manifest = require('../public/manifest_vendor')
const vendor = '/static/js/' + manifest.name.replace('_', '.') + '.js'
const env = require('../config/prod.env')

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    // Don't attempt to continue if there are any errors.
    bail: true,
    output: {
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
    },
    optimization: {
        splitChunks: {
            name: false
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true
                    }
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: config.build.productionSourceMap
            })
        ]
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
                    sourceMap: config.build.productionSourceMap,
                    extract: true,
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
                    sourceMap: config.build.productionSourceMap,
                    extract: true,
                    usePostCSS: true
                })
            },
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: utils.getStyleLoaders(
                    {
                        importLoaders: 2,
                        sourceMap: config.build.productionSourceMap,
                        extract: true,
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
                        sourceMap: config.build.productionSourceMap,
                        extract: true,
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
                        sourceMap: config.build.productionSourceMap,
                        extract: true,
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
                        sourceMap: config.build.productionSourceMap,
                        extract: true,
                        usePostCSS: true
                    },
                    'sass-loader'
                )
            }
        ]
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    entry: {
        app2: './src/index.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:8].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'build/index.html',
            inject: 'body',
            vendor,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // // split vendor js into its own file
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks(module) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             module.resource &&
        //             /\.js$/.test(module.resource) &&
        //             module.resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         )
        //     }
        // }),
        // // extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     minChunks: Infinity
        // }),
        // // This instance extracts shared chunks from code splitted chunks and bundles them
        // // in a separate chunk, similar to the vendor chunk
        // // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'app',
        //     async: 'vendor-async',
        //     children: true,
        //     minChunks: 3
        // }),

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
    ]
})

if (config.build.productionGzip) {
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
