// -p in 'scripts': { 'prod': } 'webpack -p in package.json needed to minify css

const path = require('path'),
    webpack = require('webpack'),
    copy_webpack_plugin = require('copy-webpack-plugin'),
    html_webpack_plugin = require('html-webpack-plugin'),
    clean_webpack_plugin = require('clean-webpack-plugin'),
    write_file_webpack_plugin = require('write-file-webpack-plugin'), // needed to create dist folder and its content on npm start after it was deleted by clean_webpack_plugin
    hard_source_webpack_plugin = require('hard-source-webpack-plugin');

module.exports = {
    entry: {
        background: path.join(__dirname, 'src', 'js', 'background', 'background.js'),
        content_script: path.join(__dirname, 'src', 'js', 'content_script', 'content_script.js'),
        options: path.join(__dirname, 'src', 'js', 'options', 'options.js'),
        new_tab: path.join(__dirname, 'src', 'js', 'new_tab', 'new_tab.js')
    },

    output: {
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'

            },

            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top'
                        }
                    },

                    {
                        loader: 'css-loader'
                    }
                ]
            },

            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },

            {
                test: /\.(png|gif|ttf)$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },

    plugins: [
        new copy_webpack_plugin([{
            //> generates the manifest file using the package.json informations t
            from: 'src/manifest.json',

            transform: function (content, path) {
                return Buffer.from(JSON.stringify({
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version,
                    ...JSON.parse(content.toString())
                }))
            },

        },
        //< generates the manifest file using the package.json informations t

        { from: path.join(__dirname, 'src', 'js', 'x.js'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'src', 'css'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'src', '_locales'), to: path.join(__dirname, 'dist', '_locales') },
        { from: path.join(__dirname, 'src', 'mods'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'src', 'icons'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'src', 'images'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'src', 'Roboto-Light.ttf'), to: path.join(__dirname, 'dist') }
        ]),

        new html_webpack_plugin({
            template: path.join(__dirname, 'src', 'html', 'options.html'),
            filename: 'options.html',
            chunks: ['options']
        }),

        new html_webpack_plugin({
            template: path.join(__dirname, 'src', 'html', 'new_tab.html'),
            filename: 'new_tab.html',
            chunks: ['new_tab']
        }),

        new clean_webpack_plugin(['dist']),

        new write_file_webpack_plugin(),

        new hard_source_webpack_plugin()
    ],

    resolve: {
        alias: {
            js: path.join(__dirname, 'src', 'js'),
            options: path.join(__dirname, 'src', 'js', 'options'),
            new_tab: path.join(__dirname, 'src', 'js', 'new_tab'),
            content_script: path.join(__dirname, 'src', 'js', 'content_script'),
            options_components: path.join(__dirname, 'src', 'js', 'options', 'components'),
            new_tab_components: path.join(__dirname, 'src', 'js', 'new_tab', 'components'),
            content_script_components: path.join(__dirname, 'src', 'js', 'content_script', 'components'),
            background: path.join(__dirname, 'src', 'js', 'background'),
            x$: path.join(__dirname, 'src', 'js', 'x.js'),
            vue$: path.join(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm.js'),
            svg: path.join(__dirname, 'src', 'svg'),
            imgs: path.join(__dirname, 'src', 'imgs'),
        },
        extensions: ['.js', '.svg', '.png', '.gif']
    },

    devServer: {
        hot: false
    }
};