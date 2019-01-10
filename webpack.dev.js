const path = require('path');
const merge = require('webpack-merge');

const shared = require(path.join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

module.exports = merge(shared, {
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
});
