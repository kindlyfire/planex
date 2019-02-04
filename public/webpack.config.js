const path = require('path')
const webpack = require('webpack')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

let config = {
    context: path.resolve(__dirname, 'js'),
    entry: './main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/public/'
    },
    devtool: '',
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        alias: {
            '&': path.resolve(__dirname, 'js')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    cacheBusting: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'js')]
            },
            {
                test: /\.(s)?css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            }
        ]
    },
    plugins: [new VueLoaderPlugin()]
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'eval-source-map'
    }

    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(argv.mode)
            }
        })
    )

    return config
}
