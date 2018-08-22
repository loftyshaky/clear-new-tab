const path = require('path'),
    merge = require('webpack-merge'),
    shared = require(path.join(__dirname, 'webpack.shared.js'));

module.exports = merge(shared, {
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
});