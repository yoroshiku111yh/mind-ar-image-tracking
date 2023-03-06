const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const glob = require("glob");

const entries = glob.sync('./app/assets/js/*.js').reduce((_entries, entry) => {
    const entryName = path.parse(entry).name
    _entries[entryName] = {
        import : entry,
        dependOn : 'vendor'
    }
    return _entries
}, {});
entries['vendor'] = ['jquery'];

module.exports = {
    mode: "production",
    entry: entries,
    output: {
        filename: '[name].js',
    },
    optimization: {
        runtimeChunk: 'single'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    target: ['es5','web'],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                    }
                },
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    externals: {
        jquery: 'jQuery',
    }
};
