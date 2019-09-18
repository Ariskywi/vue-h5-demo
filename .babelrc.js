module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie <=8']
                },
                // 打开则webpack及node脚本中不能使用import，package的script脚本不再使用babel-node
                modules: false,
                useBuiltIns: 'entry', // usage适用于库,entry适用于应用
                corejs: { version: 3, proposals: true }
            }
        ]
    ],
    plugins: [
        // [
        //     '@babel/transform-runtime',
        //     {
        //         absoluteRuntime: false,
        //         corejs: 3,
        //         regenerator: true
        //     }
        // ],
        [
            'import',
            {
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
            },
            'vant'
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
