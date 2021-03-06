const webpack = require('webpack');
const path = require('path');
const OfflinePlugin = require('offline-plugin');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    context: `${__dirname}/src`,
    target: 'web',
    devtool: debug ? 'inline-sourcemap' : 'cheap-module-source-map',
    entry: {
        bundle: './entry.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy'],
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: 'style-loader',
                        options: {
                            minimize: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            Actions: path.resolve(__dirname, './src/actions/'),
            Components: path.resolve(__dirname, './src/components/'),
            Containers: path.resolve(__dirname, './src/containers/'),
            Constants: path.resolve(__dirname, './src/constants.js'),
            Reducers: path.resolve(__dirname, './src/reducers/'),
            Sass: path.resolve(__dirname, './src/sass/'),
        },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../'),
    },
    plugins: (debug ? [] : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(debug ? undefined : 'production'),
            },
        }),
    ]).concat([
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
        }),
    ]).concat(debug ? [] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
        }),
    ]).concat([
        new OfflinePlugin({
            ServiceWorker: {
                events: true,
            },
            AppCache: {
                events: true,
            },
            externals: [
                'index.html',

                // cache fonts
                'https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:300',
                'https://fonts.gstatic.com/s/yanonekaffeesatz/v8/We_iSDqttE3etzfdfhuPRbHVephy08vG3A_n649omsL3rGVtsTkPsbDajuO5ueQw.woff',
                'https://fonts.googleapis.com/css?family=Roboto',
                'https://fonts.gstatic.com/s/roboto/v15/CrYjSnGjrRCn0pd9VQsnFOvvDin1pK8aKteLpeZ5c0A.woff',

                // cache icons
                'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
                'https://code.ionicframework.com/ionicons/2.0.1/fonts/ionicons.ttf?v=2.0.1',
                'https://code.ionicframework.com/ionicons/2.0.1/fonts/ionicons.woff?v=2.0.1',
                'https://code.ionicframework.com/ionicons/2.0.1/fonts/ionicons.eot?v=2.0.1',
            ],
        }),
    ]),
};
