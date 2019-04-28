'use strict'

const path = require('path')
const utils = require('../build/utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const env = require('../config/prod.env')
const baseWebpackConfig = require('./webpack.base')

const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const manifest = require('../public/manifest_vendor')

const vendor = '/static/js/' + manifest.name.replace('_', '.') + '.js'

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

function resolve(dir) {
    return path.join(__dirname, '../', dir)
}

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    // Don't attempt to continue if there are any errors.
    bail: true,
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    // entry: {
    //     app2: './src/index.js'
    // },
    output: {
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    optimization: {
        splitChunks: {
            name: false
        },
        sideEffects: true,
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
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(env)
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
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: `${config.dev.assetsSubDirectory}`,
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../public'),
                to: `${config.dev.assetsSubDirectory}/js`,
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
