const { join } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

module.exports = merge(shared, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
});
