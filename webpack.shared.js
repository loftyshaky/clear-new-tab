// -p in 'scripts': { 'prod': } 'webpack -p in package.json needed to minify css

const { join } = require('path');

const Html_webpack_plugin = require('html-webpack-plugin');
const Copy_webpack_plugin = require('copy-webpack-plugin');
const Clean_webpack_plugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        background: join(__dirname, 'src', 'js', 'background', 'background.js'),
        content_script: join(__dirname, 'src', 'js', 'content_script', 'content_script.js'),
        options: join(__dirname, 'src', 'js', 'options', 'options.js'),
        new_tab: join(__dirname, 'src', 'js', 'new_tab', 'new_tab.js'),
    },

    output: {
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top',
                        },
                    },

                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.(png|gif|ttf)$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },

    plugins: [
        new Html_webpack_plugin({
            template: join(__dirname, 'src', 'html', 'options.html'),
            filename: 'options.html',
            chunks: ['options'],
        }),

        new Html_webpack_plugin({
            template: join(__dirname, 'src', 'html', 'new_tab.html'),
            filename: 'new_tab.html',
            chunks: ['new_tab'],
        }),

        new Copy_webpack_plugin([{
            //> generates the manifest file using the package.json informations
            from: process.argv.indexOf('--firefox') > -1 ? 'src/manifest_firefox/manifest.json' : 'src/manifest_chrome/manifest.json',

            transform(content) {
                return Buffer.from(JSON.stringify({
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version,
                    ...JSON.parse(content.toString()),
                }));
            },

        },
        //< generates the manifest file using the package.json informations

        { from: join(__dirname, 'src', 'js', 'x.js'), to: join(__dirname, 'dist') },
        { from: join(__dirname, 'src', 'css'), to: join(__dirname, 'dist') },
        { from: join(__dirname, 'src', '_locales'), to: join(__dirname, 'dist', '_locales') },
        { from: join(__dirname, 'src', 'mods'), to: join(__dirname, 'dist') },
        { from: join(__dirname, 'src', 'icons'), to: join(__dirname, 'dist') },
        { from: join(__dirname, 'src', 'images'), to: join(__dirname, 'dist') },
        { from: join(__dirname, 'src', 'Roboto-Light.ttf'), to: join(__dirname, 'dist') },
        ]),

        new Clean_webpack_plugin(['dist']),
    ],

    resolve: {
        alias: {
            js: join(__dirname, 'src', 'js'),
            options: join(__dirname, 'src', 'js', 'options'),
            new_tab: join(__dirname, 'src', 'js', 'new_tab'),
            content_script: join(__dirname, 'src', 'js', 'content_script'),
            background: join(__dirname, 'src', 'js', 'background'),
            x$: join(__dirname, 'src', 'js', 'x.js'),
            vue$: join(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm.js'),
            svg: join(__dirname, 'src', 'svg'),
            backgrounds: join(__dirname, 'src', 'backgrounds'),
        },
        extensions: ['.js', '.jsx', '.css', '.svg', '.png', '.gif'],
    },

    devServer: {
        hot: false,
        disableHostCheck: true,
    },
};
