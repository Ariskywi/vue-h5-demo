module.exports = function(api) {
    const { BABEL_MODULE } = process.env
    const useESModules = BABEL_MODULE !== 'umd'

    api && api.cache(false)

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    // 打开则webpack及node脚本中不能使用import，package的script脚本不再使用babel-node
                    modules: useESModules ? false : 'umd',
                    useBuiltIns: 'usage',
                    corejs: { version: 3, proposals: true }
                }
            ],
            [
                '@vue/babel-preset-jsx',
                {
                    functional: false
                }
            ]
        ],
        plugins: [
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: { version: 3, proposals: true },
                    useESModules
                }
            ],

            [
                'import',
                {
                    libraryName: 'vant',
                    libraryDirectory: 'es',
                    style: true
                },
                'vant'
            ],

            // Stage 2
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-function-sent',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-throw-expressions',

            // Stage 3
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-json-strings',

            '@babel/plugin-proposal-optional-chaining'
        ]
    }
}
