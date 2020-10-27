// -p in 'scripts': { 'prod': } 'webpack -p in package.json needed to minify css

const { join } = require('path');
const { writeFileSync } = require('fs');

const Html_webpack_plugin = require('html-webpack-plugin');
const Copy_webpack_plugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let browser;

if (process.argv.indexOf('--chrome') > -1) {
    browser = 'chrome';

} else if (process.argv.indexOf('--edge') > -1) {
    browser = 'edge';

} else if (process.argv.indexOf('--firefox') > -1) {
    browser = 'firefox';
}

(() => {
    const manifest = {
        manifest_version: 2,
        version: process.env.npm_package_version,
        name: 'Clear New Tab',
        description: '__MSG_desc__',
        default_locale: 'en',
        icons: {
            16: 'icon16_padded.png',
            48: 'icon48.png',
            128: 'icon128.png',
        },
        browser_action: {
            default_icon: {
                16: 'icon16.png',
                32: 'icon32.png',
                64: 'icon64.png',
                19: 'icon19.png',
            },
        },
        permissions: [
            'storage', // used for storing google analytics client id
            'https://clients2.google.com/*',
            'https://clients2.googleusercontent.com/*',
        ],
        optional_permissions: [
            'clipboardRead',
            '*://*/*',
            'https://www.google-analytics.com/*',
        ],
        background: {
            scripts: [
                'env.js',
                'background.js',
            ],
        },
        chrome_url_overrides: {
            newtab: 'new_tab.html',
        },
        options_ui: {
            page: 'options.html',
            chrome_style: false,
            open_in_tab: true,
        },
        content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
    };

    if (['chrome', 'edge'].includes(browser)) {
        manifest.permissions.push('management');
    }

    if (browser === 'firefox') {
        const cws_match = 'https://chrome.google.com/webstore/*';

        manifest.permissions.push(cws_match);
        manifest.applications = {
            gecko: {
                id: 'clear-new-tab@loftyshaky',
                strict_min_version: '54.0',
            },
        };
        manifest.content_scripts = [
            {
                matches: [
                    cws_match,
                ],
                js: [
                    'env.js',
                    'content_script.js',
                ],
                css: [
                    'content_script.css',
                ],
            },
        ];
    }

    const env = `window.env = { what_browser: '${browser}' }; // eslint-disable-line eol-last`;

    writeFileSync(join(__dirname, 'dist', 'manifest.json'), JSON.stringify(manifest), 'utf-8');
    writeFileSync(join(__dirname, 'dist', 'env.js'), env, 'utf-8');
})();


module.exports = {
    entry: {
        background: join(__dirname, 'src', 'js', 'background', 'background.js'),
        content_script: join(__dirname, 'src', 'js', 'content_script', 'content_script.js'),
        options: join(__dirname, 'src', 'js', 'options', 'options.js'),
        inapp: join(__dirname, 'src', 'js', 'inapp', 'inapp.js'),
        new_tab: join(__dirname, 'src', 'js', 'new_tab', 'new_tab.js'),
    },

    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ],
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
                use: [
                    'svg-inline-loader',
                ],
            },
            {
                test: /\.(png|gif|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                }],
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
            template: join(__dirname, 'src', 'html', 'inapp.html'),
            filename: 'inapp.html',
            chunks: ['inapp'],
        }),

        new Html_webpack_plugin({
            template: join(__dirname, 'src', 'html', 'new_tab.html'),
            filename: 'new_tab.html',
            chunks: ['new_tab'],
        }),

        new Copy_webpack_plugin({
            patterns: [
                { from: join(__dirname, 'src', 'js', 'x.js'), to: join(__dirname, 'dist') },
                { from: join(__dirname, 'src', 'css'), to: join(__dirname, 'dist') },
                { from: join(__dirname, 'src', '_locales'), to: join(__dirname, 'dist', '_locales') },
                { from: join(__dirname, 'src', 'mods'), to: join(__dirname, 'dist') },
                { from: join(__dirname, 'src', 'icons'), to: join(__dirname, 'dist') },
                { from: join(__dirname, 'src', 'images'), to: join(__dirname, 'dist') },
                { from: join(__dirname, 'src', 'Roboto-Light.ttf'), to: join(__dirname, 'dist') },
            ],
        }),

        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json', '!env.js'],
        }),
    ],

    resolve: {
        alias: {
            js: join(__dirname, 'src', 'js'),
            options: join(__dirname, 'src', 'js', 'options'),
            inapp: join(__dirname, 'src', 'js', 'inapp'),
            new_tab: join(__dirname, 'src', 'js', 'new_tab'),
            content_script: join(__dirname, 'src', 'js', 'content_script'),
            background: join(__dirname, 'src', 'js', 'background'),
            lib: join(__dirname, 'src', 'js', 'lib'),
            x$: join(__dirname, 'src', 'js', 'x.js'),
            vue$: join(__dirname, 'node_modules', 'vue', 'dist', 'vue.esm.js'),
            svg: join(__dirname, 'src', 'svg'),
            backgrounds: join(__dirname, 'src', 'backgrounds'),
        },
        extensions: ['.js', '.jsx', '.css', '.svg', '.png', '.gif'],
        fallback: { stream: false },
    },

    devServer: {
        hot: false,
        disableHostCheck: true,
    },
};
