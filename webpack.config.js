const path = require('path');

const appRoot = require('app-root-path').path;
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
const { Env } = require('@loftyshaky/shared/js/ext/env');
const { Locales } = require('@loftyshaky/shared/js/ext/locales');
const { shared_config } = require('@loftyshaky/shared/js/ext/webpack.config');
const { TaskScheduler } = require('@loftyshaky/shared/js/task_scheduler');
const { Manifest } = require('./js/manifest');

const reloader = new Reloader({
    port: 7221,
});

reloader.watch();

const task_scheduler = new TaskScheduler();

const app_root = appRoot;

const manifest = new Manifest({ app_root });
const env_instance = new Env({ app_root });
const locales = new Locales({ app_root });

const ext_id = 'nnmhbhoglljdlhbllfgkemgenlplalie';
let first_reload_completed = false;

module.exports = (env, argv) => {
    const paths = {
        ts: path.join(app_root, 'src', 'ts'),
        themes: path.join(app_root, 'src', 'scss', 'settings', 'themes'),
    };

    const config = shared_config({
        app_root,
        webpack,
        argv,
        env,
        MiniCssExtractPlugin,
        CssMinimizerPlugin,
        CopyWebpackPlugin,
        copy_patters: [
            {
                from: path.join(app_root, 'src', 'imgs'),
            },
        ],
        callback_begin: () => {
            task_scheduler.unlock_dist({
                package_name: 'Clear New Tab',
                remove_dist: argv.mode === 'production',
            });
        },
        callback_done: (stats) => {
            manifest.generate({
                test: env.test,
                browser: env.browser,
            });
            env_instance.generate({ browser: env.browser, mode: argv.mode });
            locales.merge();

            const an_error_occured = stats.compilation.errors.length !== 0;

            if (an_error_occured) {
                reloader.play_error_notification();
            } else if (first_reload_completed) {
                reloader.reload({
                    ext_id,
                    hard: false,
                    play_sound: true,
                    after_reload_delay: 1000,
                    hard_paths: [
                        `_locales${path.sep}`,
                        `shared${path.sep}`,
                        `background${path.sep}`,
                    ],
                });
            } else {
                reloader.reload({
                    ext_id,
                    hard: true,
                    play_sound: true,
                    after_reload_delay: 1000,
                });

                first_reload_completed = true;
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
            announcement: path.join(paths.ts, 'announcement', 'announcement.ts'),
            background: path.join(paths.ts, 'background', 'background.ts'),
            settings: path.join(paths.ts, 'settings', 'settings.ts'),
            new_tab: path.join(paths.ts, 'new_tab', 'new_tab.ts'),
            sandbox: path.join(paths.ts, 'sandbox', 'sandbox.ts'),
            preload_color: path.join(paths.ts, 'new_tab', 'preload_color.ts'),
            announcement_css: path.join(
                app_root,
                'node_modules',
                '@loftyshaky',
                'shared',
                'scss',
                'announcement',
                'index.scss',
            ),
            settings_css: path.join(app_root, 'src', 'scss', 'settings', 'index.scss'),
            new_tab_css: path.join(app_root, 'src', 'scss', 'new_tab', 'index.scss'),
            sandbox_css: path.join(app_root, 'src', 'scss', 'sandbox', 'index.scss'),
            preload: path.join(app_root, 'src', 'scss', 'new_tab', 'preload.scss'),
            settings_light_theme: path.join(paths.themes, 'light_theme.scss'),
            settings_dark_theme: path.join(paths.themes, 'dark_theme.scss'),
            settings_very_dark_theme: path.join(paths.themes, 'very_dark_theme.scss'),
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
