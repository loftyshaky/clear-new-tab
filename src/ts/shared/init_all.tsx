import React from 'react';
import ReactDOM from 'react-dom/client';

import '@loftyshaky/shared/ext';
import {
    c_crash_handler,
    c_error,
    c_loading_screen,
    d_loading_screen,
    s_tab_index,
    s_theme as s_theme_shared,
    s_title,
} from '@loftyshaky/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { s_css_vars, s_suffix, s_theme } from 'shared/internal';

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare let __webpack_public_path__: string;

export class InitAll {
    private static i0: InitAll;

    public static i(): InitAll {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private announcement_root: HTMLDivElement | undefined = undefined;
    private settings_root: HTMLDivElement | undefined = undefined;
    private new_tab_root: HTMLDivElement | undefined = undefined;

    public init = (): Promise<void> =>
        new Promise((reslove) => {
            err_async(async () => {
                const on_loading_screen_render = (): void =>
                    err(() => {
                        const loading_screen_root_el = s<HTMLDivElement>(
                            `.${new s_suffix.Main('loading_screen').result}`,
                        );

                        if (n(loading_screen_root_el) && n(loading_screen_root_el.shadowRoot)) {
                            const loading_screen_css = x.css(
                                'loading_screen',
                                loading_screen_root_el.shadowRoot,
                            );

                            if (n(loading_screen_css)) {
                                x.bind(loading_screen_css, 'load', (): void =>
                                    err(() => {
                                        if (page === 'settings') {
                                            s_theme_shared.Main.i().set({
                                                name: data.settings.options_page_theme,
                                                additional_theme_callback: s_theme.Main.i().set,
                                            });
                                        }

                                        d_loading_screen.Main.i().show();

                                        reslove();
                                    }, 'cnt_1350'),
                                );
                            }
                        }
                    }, 'cnt_1351');

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                __webpack_public_path__ = we.runtime.getURL('');

                s_title.Main.i().set();

                s_css_vars.Main.i().set();

                const error_root: ShadowRoot = this.create_root({ prefix: 'error' }) as ShadowRoot;
                let loading_screen_root: ShadowRoot | undefined;

                if (page !== 'new_tab') {
                    loading_screen_root = this.create_root({
                        prefix: 'loading_screen',
                    }) as ShadowRoot;
                }

                if (page === 'announcement') {
                    this.announcement_root = this.create_root({
                        prefix: 'announcement',
                        shadow_root: false,
                    }) as HTMLDivElement;
                } else if (page === 'settings') {
                    this.settings_root = this.create_root({
                        prefix: 'settings',
                        shadow_root: false,
                    }) as HTMLDivElement;
                } else if (page === 'new_tab') {
                    this.new_tab_root = this.create_root({
                        prefix: 'new_tab',
                        shadow_root: false,
                    }) as HTMLDivElement;
                }

                ReactDOM.createRoot(error_root).render(
                    <c_error.Body
                        app_id={s_suffix.app_id}
                        on_render={(): void =>
                            err(() => {
                                if (page === 'new_tab') {
                                    reslove();
                                } else if (n(loading_screen_root)) {
                                    ReactDOM.createRoot(loading_screen_root).render(
                                        <c_crash_handler.Body>
                                            <c_loading_screen.Body
                                                app_id={s_suffix.app_id}
                                                on_render={(): void => {
                                                    on_loading_screen_render();
                                                }}
                                            />
                                        </c_crash_handler.Body>,
                                    );
                                }
                            }, 'cnt_1372')
                        }
                    />,
                );
            }, 'cnt_1352');
        });

    private create_root = ({
        prefix,
        shadow_root = true,
    }: {
        prefix: string;
        shadow_root?: boolean;
    }): HTMLDivElement | ShadowRoot | undefined =>
        err(() => {
            const root = x.create(
                'div',
                x.cls([new s_suffix.Main('root').result, new s_suffix.Main(prefix).result]),
            );

            x.append(document.body, root);

            if (shadow_root) {
                return root.attachShadow({ mode: 'open' });
            }

            return root;
        }, 'cnt_1353');

    public render_announcement = (): Promise<void> =>
        err_async(async () => {
            const { Body } = await import('announcement/components/body');

            const on_css_load = (): Promise<void> =>
                err_async(async () => {
                    d_loading_screen.Main.i().hide({ app_id: s_suffix.app_id });
                }, 'cnt_1354');

            if (n(this.announcement_root)) {
                ReactDOM.createRoot(this.announcement_root).render(
                    <c_crash_handler.Body>
                        <Body
                            on_render={(): void =>
                                err(() => {
                                    const announcement_css = x.css(
                                        'announcement_css',
                                        document.head,
                                    );

                                    s_theme_shared.Main.i().set({
                                        name: data.settings.options_page_theme,
                                        additional_theme_callback: s_theme.Main.i().set,
                                    });

                                    if (n(announcement_css)) {
                                        x.bind(announcement_css, 'load', on_css_load);
                                    }
                                }, 'cnt_1355')
                            }
                        />
                    </c_crash_handler.Body>,
                );
            }
        }, 'cnt_1356');

    public render_settings = (): Promise<void> =>
        err_async(async () => {
            const { Body } = await import('settings/components/body');
            const on_css_load = (): Promise<void> =>
                err_async(async () => {
                    const {
                        s_custom_code,
                        d_install_help,
                        d_scheduler,
                        d_sections,
                        s_theme: s_theme_settings,
                        s_virtualized_list,
                    } = await import('settings/internal');

                    s_theme_settings.CodeMirrorTheme.i().set_up_change_theme_reaction();
                    s_custom_code.CodeMirror.i().init_all();

                    d_install_help.Visibility.i().bind_hide();
                    await d_inputs.InputWidth.i().calculate_for_all_sections({
                        sections: d_sections.Main.i().sections as i_inputs.Sections,
                        all_sections_inputs_equal_width: true,
                    });
                    d_sections.Width.i().set();
                    d_scheduler.Position.i().set_left();
                    await d_scheduler.Val.i().set_add_new_task_btn_ability();

                    s_tab_index.Main.i().bind_set_input_type_f();

                    d_loading_screen.Main.i().hide({ app_id: s_suffix.app_id });

                    await x.delay(300);

                    s_virtualized_list.VirtualizedList.i().set_bottom_scroll_position({
                        virtualized_list_type: 'backgrounds',
                    });
                }, 'cnt_1357');

            if (n(this.settings_root)) {
                ReactDOM.createRoot(this.settings_root).render(
                    <c_crash_handler.Body>
                        <Body
                            on_render={(): void =>
                                err(() => {
                                    const settings_css = x.css('settings_css', document.head);

                                    s_theme_shared.Main.i().set({
                                        name: data.settings.options_page_theme,
                                        additional_theme_callback: s_theme.Main.i().set,
                                    });

                                    if (n(settings_css)) {
                                        x.bind(settings_css, 'load', on_css_load);
                                    }
                                }, 'cnt_1358')
                            }
                        />
                    </c_crash_handler.Body>,
                );
            }
        }, 'cnt_1359');

    public render_new_tab = (): Promise<void> =>
        err_async(async () => {
            const { Body } = await import('new_tab/components/body');

            const on_css_load = (): Promise<void> =>
                err_async(async () => {
                    d_inputs.InputWidth.i().set_max_width();

                    d_loading_screen.Main.i().hide({ app_id: s_suffix.app_id });

                    s_tab_index.Main.i().bind_set_input_type_f();
                }, 'cnt_1360');

            if (n(this.new_tab_root)) {
                ReactDOM.createRoot(this.new_tab_root).render(
                    <c_crash_handler.Body>
                        <Body
                            on_render={(): void =>
                                err(() => {
                                    const new_tab_css = x.css('new_tab_css', document.head);

                                    if (n(new_tab_css)) {
                                        x.bind(new_tab_css, 'load', on_css_load);
                                    }
                                }, 'cnt_1361')
                            }
                        />
                    </c_crash_handler.Body>,
                );
            }
        }, 'cnt_1362');
}
