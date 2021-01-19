const { join } = require('path');

const merge = require('webpack-merge');

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

module.exports = merge(shared, {
    mode: 'development',
    devtool: 'cheap-module-source-map',

    devServer: {
        contentBase: join(__dirname, 'dist'),
        writeToDisk: true,
    },
});
