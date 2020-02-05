'use strict'
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const manifest = require('../public/manifest_vendor')

const assetsSubDirectory = 'static'

function resolve(dir) {
    return path.join(__dirname, '../', dir)
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: true
    }
})

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: './src/main.js',
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    optimization: {
        sideEffects: false,
        splitChunks: {
            chunks: 'all',
            name: true,
            minSize: 0
            // automaticNameDelimiter: '-'
        },
        // Keep the runtime chunk seperated to enable long term caching
        runtimeChunk: 'multiple'
    },
    module: {
        rules: [
            ...[createLintingRule()],
            // keep vue-loader outside of "oneOf"
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        loader: 'babel-loader',
                        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
                        include: [
                            resolve('src'),
                            resolve('test'),
                            resolve('node_modules/webpack-dev-server/client')
                        ],
                        options: {
                            rootMode: 'upward',
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                            // Don't waste time on Gzipping the cache
                            cacheCompression: false
                        }
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: `${assetsSubDirectory}/images/[name].[hash:8].[ext]`
                        }
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: `${assetsSubDirectory}/media/[name].[hash:8].[ext]`
                        }
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: `${assetsSubDirectory}/fonts/[name].[hash:8].[ext]`
                        }
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [
                            /\.vue$/,
                            /\.html$/,
                            /\.(js|jsx)$/,
                            /\.less$/,
                            /\.(scss|sass)$/,
                            /\.css$/,
                            /\.json$/
                        ],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: `${assetsSubDirectory}/files/[name].[hash:8].[ext]`
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest
        }),
        new VueLoaderPlugin(),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProgressPlugin({ profile: false })
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
