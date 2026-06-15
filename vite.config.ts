import type { Target } from 'vite-plugin-static-copy';

import path from 'node:path';

import { Reloader } from 'advanced-extension-reloader-watch-2/reloader';
import appRoot from 'app-root-path';
import chokidar from 'chokidar';
import {
    type LibraryOptions,
    type PluginOption,
    type UserConfig,
    defineConfig,
    loadEnv,
} from 'vite';

import { Dependencies as DependenciesShared } from '@loftyshaky/shared/build/ts/dependencies';
import { Locales } from '@loftyshaky/shared/build/ts/locales';
import { get_shared_dist_path, watch } from '@loftyshaky/shared/build/ts/plugins/watch';
import { generate_shared_config } from '@loftyshaky/shared/build/ts/vite.config';

import { Dependencies } from './build/ts/dependencies';
import { Manifest } from './build/ts/manifest';

const app_root = appRoot.path.replaceAll(path.sep, path.posix.sep);
const dependencies_shared = new DependenciesShared({ app_root });
const manifest = new Manifest();
const locales = new Locales({ app_root, exclude_shared_locales: ['de'] });
const dependencies = new Dependencies();

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const extension_id =
        env.browser === 'firefox' ? 'clear-new-tab@loftyshaky' : 'nnmhbhoglljdlhbllfgkemgenlplalie';
    const reloader = new Reloader({
        port: env.browser === 'firefox' ? 8222 : 7222,
        firefox_advanced_extension_reloader_internal_uuids:
            env.advanced_extension_reloader_firefox_internal_uuids.split(','),
    });

    reloader.watch();

    const dest_path: string = path.posix.join(app_root, 'dist');
    const paths = {
        ts: path.join(app_root, 'src', 'ts'),
        scss: path.join(app_root, 'src', 'scss'),
        themes: path.join(app_root, 'src', 'scss', 'settings', 'themes'),
    };
    const copy_paths: Target[] = [
        {
            src: path.posix.join(app_root, 'src', 'imgs'),
            dest: dest_path,
            rename: { stripBase: true },
        },
    ];

    const shared_config = generate_shared_config({
        mode,
        env,
        app_root,
        dest_path,
        copy_paths,
        callback_build_start: () => {},
        callback_close_bundle: ({ build_error }: { build_error: boolean }) => {
            manifest.generate({
                env,
            });
            void locales.merge();

            dependencies_shared.add_missing_dependesies({
                extension_specific_missing_dependencies: dependencies.missing_dependencies,
            });

            if (build_error) {
                reloader.play_error_notification({ extension_id });
            } else {
                reloader.reload({
                    extension_id,
                    play_notifications: true,
                    delay_after_extension_reload: 2000,
                });
            }
        },
    }) as UserConfig & { build: { lib: LibraryOptions } } & { plugins: PluginOption[] };

    shared_config.build.lib.entry = {
        ...(shared_config.build.lib.entry as Record<string, unknown>),
        background: path.join(paths.ts, 'background', 'background.ts'),
        settings: path.join(paths.ts, 'settings', 'settings.ts'),
        offscreen: path.join(paths.ts, 'offscreen', 'offscreen.ts'),
        new_tab: path.join(paths.ts, 'new_tab', 'new_tab.ts'),
        sandbox: path.join(paths.ts, 'sandbox', 'sandbox.ts'),
        preload_color: path.join(paths.ts, 'new_tab', 'preload_color.ts'),
        settings_css: path.join(paths.scss, 'settings', 'index.scss'),
        new_tab_css: path.join(paths.scss, 'new_tab', 'index.scss'),
        sandbox_css: path.join(paths.scss, 'sandbox', 'index.scss'),
        preload: path.join(paths.scss, 'new_tab', 'preload.scss'),
        settings_light_theme: path.join(paths.themes, 'light_theme.scss'),
        settings_dark_theme: path.join(paths.themes, 'dark_theme.scss'),
        settings_very_dark_theme: path.join(paths.themes, 'very_dark_theme.scss'),
        settings_clover_theme: path.join(paths.themes, 'clover_theme.scss'),
        settings_aqua_theme: path.join(paths.themes, 'aqua_theme.scss'),
        settings_lavender_theme: path.join(paths.themes, 'lavender_theme.scss'),
        settings_blaze_theme: path.join(paths.themes, 'blaze_theme.scss'),
        settings_ruby_theme: path.join(paths.themes, 'ruby_theme.scss'),
        global_hidden: path.join(paths.scss, 'settings', 'embed', 'global_hidden.scss'),
    };

    shared_config.plugins = [
        ...shared_config.plugins,
        watch({
            paths_to_watch: [
                get_shared_dist_path({ app_root, env }),
                path.join(app_root, 'build', 'ts'),
                path.join(app_root, 'src', '_locales'),
                path.join(app_root, 'src', 'html'),
                path.join(app_root, 'src', 'icons'),
                path.join(app_root, 'src', 'imgs'),
                path.join(app_root, 'src', 'scss'),
                path.join(app_root, 'src', 'svg'),
            ],
            reload_trigger_file: path.join(paths.ts, 'background', 'background.ts'),
            chokidar,
        }),
    ];

    return shared_config;
});

export default config;
