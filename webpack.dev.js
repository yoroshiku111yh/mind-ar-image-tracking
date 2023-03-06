const path = require('path')
const webpack = require('webpack');
const glob = require("glob");

const entriesJs = glob.sync('./app/assets/js/*.js').reduce((_entries, entry) => {
    const entryName = path.parse(entry).name
    _entries[entryName] = {
        import: entry,
        dependOn: 'vendor'
    }
    return _entries
}, {});
entriesJs['vendor'] = ['jquery'];

module.exports = {
    mode: "development",
    devtool: 'eval',
    entry: { ...entriesJs },
    output: {
        filename: '[name].js',
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
            },
            {
                test: /\.(jpe?g|png)$/i,
                type: "asset",
            },
        ],
    },
    target: ['es5', 'web'],
    optimization: {
        runtimeChunk: 'single',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    externals: {
        jquery: 'jQuery',
    },
};