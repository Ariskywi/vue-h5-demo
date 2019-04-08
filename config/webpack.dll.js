'use strict'

import path from 'path'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

const vendors = ['vue', 'vuex', 'vue-router', 'lodash', 'axios']
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

module.exports = {
    mode: 'production',
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', 'vue']
    },
    entry: {
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].[chunkhash].js',
        library: '[name]_[chunkhash]'
    },
    optimization: {
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
                sourceMap: shouldUseSourceMap
            })
        ]
    },
    performance: {
        maxAssetSize: 300 * 1024, // 调整244k到300k
        maxEntrypointSize: 300 * 1024
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.DllPlugin({
            // context: __dirname,
            path: path.resolve(__dirname, '../public', 'manifest_[name].json'),
            name: '[name]_[chunkhash]'
        }),
        new webpack.ProgressPlugin({ profile: false })
    ]
}