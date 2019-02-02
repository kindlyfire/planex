const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    context: path.resolve('./js'),
    entry: './main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/public/'
    },
    devtool: 'eval-source-map',
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
                include: [path.resolve('js')]
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
