const path = require('path');

const appRoot = require('app-root-path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
const { Env } = require('@loftyshaky/shared/js/env');
const { Locales } = require('@loftyshaky/shared/js/locales');
const { shared_config } = require('@loftyshaky/shared/js/webpack.config');
const { TaskScheduler } = require('@loftyshaky/shared/js/task_scheduler');
const { Manifest } = require('./js/manifest');

const reloader = new Reloader({
    port: 7221,
});

reloader.watch();

const task_scheduler = new TaskScheduler();

const app_root = appRoot.path;

const manifest = new Manifest({ app_root });
const env_instance = new Env({ app_root });
const locales = new Locales({ app_root });

const ext_id = 'nnmhbhoglljdlhbllfgkemgenlplalie';

module.exports = (env, argv) => {
    const paths = {
        ts: path.join(app_root, 'src', 'ts'),
        themes: path.join(app_root, 'src', 'scss', 'settings', 'themes'),
    };

    const config = shared_config({
        app_type: 'ext',
        app_root,
        webpack,
        argv,
        env,
        TerserPlugin,
        MiniCssExtractPlugin,
        CssMinimizerPlugin,
        CopyWebpackPlugin,
        copy_patters: [
            {
                from: path.join(app_root, 'src', 'imgs'),
            },
        ],
        enable_anouncement: true,
        callback_begin: () => {
            task_scheduler.unlock_dist({
                package_name: 'Clear New Tab',
                remove_dist: argv.mode === 'production',
            });
        },
        callback_done: (stats) => {
            const env_2 = 'ext';

            manifest.generate({
                test: env.test,
                browser: env.browser,
            });
            env_instance.generate({ browser: env.browser, mode: argv.mode, env: env_2 });
            locales.merge({ env: env_2 });

            const an_error_occured = stats.compilation.errors.length !== 0;

            if (an_error_occured) {
                reloader.play_error_notification();
            } else {
                reloader.reload({
                    ext_id,
                    play_sound: true,
                });
            }
        },
    });

    config.resolve.alias = {
        ...config.resolve.alias,
        ...{
            new_tab: path.join(paths.ts, 'new_tab'),
            sandbox: path.join(paths.ts, 'sandbox'),
        },
    };

    config.entry = {
        ...config.entry,
        ...{
            background: path.join(paths.ts, 'background', 'background.ts'),
            settings: path.join(paths.ts, 'settings', 'settings.ts'),
            new_tab: path.join(paths.ts, 'new_tab', 'new_tab.ts'),
            sandbox: path.join(paths.ts, 'sandbox', 'sandbox.ts'),
            preload_color: path.join(paths.ts, 'new_tab', 'preload_color.ts'),
            settings_css: path.join(app_root, 'src', 'scss', 'settings', 'index.scss'),
            new_tab_css: path.join(app_root, 'src', 'scss', 'new_tab', 'index.scss'),
            sandbox_css: path.join(app_root, 'src', 'scss', 'sandbox', 'index.scss'),
            preload: path.join(app_root, 'src', 'scss', 'new_tab', 'preload.scss'),
            settings_light_theme: path.join(paths.themes, 'light_theme.scss'),
            settings_dark_theme: path.join(paths.themes, 'dark_theme.scss'),
            settings_very_dark_theme: path.join(paths.themes, 'very_dark_theme.scss'),
            settings_lavender_theme: path.join(paths.themes, 'lavender_theme.scss'),
            settings_aqua_theme: path.join(paths.themes, 'aqua_theme.scss'),
            global_hidden: path.join(
                app_root,
                'src',
                'scss',
                'settings',
                'embed',
                'global_hidden.scss',
            ),
        },
    };

    return config;
};
