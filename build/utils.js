'use strict'
const path = require('path')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function(_path) {
    const assetsSubDirectory =
        process.env.NODE_ENV === 'production'
            ? config.build.assetsSubDirectory
            : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

// common function to get style loaders
exports.getStyleLoaders = (cssOptions, preProcessor) => {
    const { usePostCSS, extract, ...restOps } = cssOptions
    const loaders = [
        extract
            ? MiniCssExtractPlugin.loader
            : require.resolve('vue-style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: cssOptions.importLoaders || (usePostCSS ? 1 : 0),
                sourceMap: cssOptions.sourceMap
            }
        }
    ]
    if (usePostCSS) {
        loaders.push({
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009'
                        },
                        stage: 3
                    })
                ],
                sourceMap: cssOptions.sourceMap
            }
        })
    }
    if (preProcessor) {
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
