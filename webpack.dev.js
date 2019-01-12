const { join } = require('path');

const merge = require('webpack-merge');
const Write_file_webpack_plugin = require('write-file-webpack-plugin'); // needed to create dist folder and its content on npm dev after it was deleted by Clean_webpack_plugin

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

module.exports = merge(shared, {
    plugins: [
        new Write_file_webpack_plugin(),
    ],

    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: join(__dirname, 'dist'),
    },
});
