'use strict'
const path = require('path')
const config = require('../config')
const pxtorem = require('postcss-pxtorem')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')

const pxtoremOpts = {
    rootValue: 37.5,
    unitPrecision: 5, // 最小精度，小数点位数
    propList: ['*', '!font*', '!line-height'], // !不匹配属性（这里是字体相关属性不转换）
    selectorBlackList: [],
    minPixelValue: 2 // 替换的最小像素值
}

exports.assetsPath = function(_path) {
    const assetsSubDirectory =
        process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

// common function to get style loaders
exports.getStyleLoaders = (cssOptions, preProcessor) => {
    const { usePostCSS, extract, usePx2rem, ...restOps } = cssOptions
    const loaders = [
        extract ? MiniCssExtractPlugin.loader : require.resolve('vue-style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: cssOptions.importLoaders || (usePostCSS ? 1 : 0),
                sourceMap: cssOptions.sourceMap
            }
        }
    ]
    if (usePostCSS) {
        const plugins = [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3
            })
        ]
        if (usePx2rem) {
            plugins.push(pxtorem(pxtoremOpts))
        }
        loaders.push({
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => plugins,
                sourceMap: cssOptions.sourceMap
            }
        })
    }
    if (preProcessor === 'sass-loader') {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                data: '@import "~@/assets/css/scssConf.scss";',
                sourceMap: cssOptions.sourceMap
            }
        })
    } else if (preProcessor) {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: cssOptions.sourceMap
            }
        })
    }
    return loaders
}

exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}

exports.getClientEnvironment = function(publicUrl) {
    const raw = Object.keys(process.env).reduce(
        (env, key) => {
            env[key] = process.env[key]
            return env
        },
        {
            // Useful for determining whether we’re running in production mode.
            // Most importantly, it switches React into the correct mode.
            NODE_ENV: process.env.NODE_ENV || 'development',
            // Useful for resolving the correct path to static assets in `public`.
            // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
            // This should only be used as an escape hatch. Normally you would put
            // images into the `src` and `import` them in code to get their paths.
            PUBLIC_URL: publicUrl
        }
    )
    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key])
            return env
        }, {})
    }

    return { raw, stringified }
}
