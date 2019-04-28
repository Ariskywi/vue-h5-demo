'use strict'
// weapp npm can not use process ENV ,so build manually

const chalk = require('chalk')
const webpack = require('webpack')

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err
})

const config = require('../config/webpack.dll')

// Create the production build and print the deployment instructions.
function build() {
    console.log('Creating an optimized production build...')

    let compiler = webpack(config)
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages
            if (err) {
                if (!err.message) {
                    return reject(err)
                }
            } else {
                messages = stats.toJson({
                    all: false,
                    warnings: true,
                    errors: true
                })
            }
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1
                }
                return reject(new Error(messages.errors.join('\n\n')))
            }

            const resolveArgs = {
                stats,
                warnings: messages.warnings
            }

            return resolve(resolveArgs)
        })
    })
}

build()
    .then(
        ({ stats, warnings }) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'))
                console.log(warnings.join('\n\n'))
            } else {
                console.log(chalk.green('Compiled successfully.\n'))
            }
        },
        err => {
            console.log(err)
            console.log(chalk.red('Failed to compile.\n'))
            process.exit(1)
        }
    )
    .catch(err => {
        if (err && err.message) {
            console.log(err.message)
        }
        process.exit(1)
    })
