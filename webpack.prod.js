const path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    shared = require(path.join(__dirname, 'webpack.shared.js'));

module.exports = merge(shared, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});