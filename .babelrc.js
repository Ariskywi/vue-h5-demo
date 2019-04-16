module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie <=8']
                },
                // modules: false,
                useBuiltIns: 'entry',
                corejs: { version: 3, proposals: true }
            }
        ]
    ],
    plugins: [
        [
            '@babel/transform-runtime',
            {
                absoluteRuntime: false,
                corejs: 3,
                regenerator: true
            }
        ],
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-syntax-dynamic-import',
        '@vue/babel-plugin-transform-vue-jsx',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ]
    ]
}
