import React from 'react';
import { render } from 'react-dom';

import '@loftyshaky/shared/ext';
import {
    c_crash_handler,
    c_error,
    c_loading_screen,
    d_loading_screen,
    s_tab_index,
    s_theme as s_theme_shared,
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

    public init = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            __webpack_public_path__ = we.runtime.getURL('');

            this.set_page_title();

            s_css_vars.Main.i().set();

            const error_root: ShadowRoot = this.create_root({ prefix: 'error' }) as ShadowRoot;
            const loading_screen_root: ShadowRoot = this.create_root({
                prefix: 'loading_screen',
            }) as ShadowRoot;
            let settings_root: HTMLDivElement;
            let new_tab_root: HTMLDivElement;

            if (page === 'settings') {
                settings_root = this.create_root({
                    prefix: 'settings',
                    shadow_root: false,
                }) as HTMLDivElement;
            } else if (page === 'new_tab') {
                new_tab_root = this.create_root({
                    prefix: 'new_tab',
                    shadow_root: false,
                }) as HTMLDivElement;
            }

            const render_settings = (): Promise<void> =>
                err_async(async () => {
                    const { Body } = await import('settings/components/body');
                    const on_render = (): Promise<void> =>
                        err_async(async () => {
                            const { d_sections } = await import('settings/internal');

                            await d_inputs.InputWidth.i().calculate_for_all_sections({
                                sections: d_sections.Main.i().sections as i_inputs.Sections,
                                all_sections_inputs_equal_width: true,
                            });
                            d_sections.Width.i().set();

                            d_loading_screen.Main.i().hide();

                            s_tab_index.Main.i().bind_set_input_type_f();
                        }, 'cnt_1148');

                    render(
                        <c_crash_handler.Body>
                            <Body />
                        </c_crash_handler.Body>,
                        settings_root,
                        (): void =>
                            err(() => {
                                const settings_css = x.css('settings_css', document.head);

                                s_theme_shared.Main.i().set({
                                    name: data.settings.options_page_theme,
                                    additional_theme_callback: s_theme.Main.i().set,
                                });

                                if (n(settings_css)) {
                                    x.bind(settings_css, 'load', on_render);
                                }
                            }, 'cnt_1149'),
                    );
                }, 'cnt_1150');

            const render_new_tab = (): Promise<void> =>
                err_async(async () => {
                    const { Body } = await import('new_tab/components/body');
                    const on_render = (): Promise<void> =>
                        err_async(async () => {
                            const { d_background } = await import('new_tab/internal');
                            d_inputs.InputWidth.i().set_max_width();

                            d_loading_screen.Main.i().hide();

                            s_tab_index.Main.i().bind_set_input_type_f();

                            d_background.Main.i().change_background_autorun();
                        }, 'cnt_1148');

                    render(
                        <c_crash_handler.Body>
                            <Body />
                        </c_crash_handler.Body>,
                        new_tab_root,
                        (): void =>
                            err(() => {
                                const new_tab_css = x.css('new_tab_css', document.head);

                                s_theme.Main.i().set({
                                    name: data.settings.options_page_theme,
                                });

                                if (n(new_tab_css)) {
                                    x.bind(new_tab_css, 'load', on_render);
                                }
                            }, 'cnt_1149'),
                    );
                }, 'cnt_1150');

            render(<c_error.Body app_id={s_suffix.app_id} />, error_root, (): void => {
                render(
                    <c_crash_handler.Body>
                        <c_loading_screen.Body />
                    </c_crash_handler.Body>,
                    loading_screen_root,
                    (): void =>
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
                                            d_loading_screen.Main.i().show();

                                            if (page === 'settings') {
                                                render_settings();
                                            } else if (page === 'new_tab') {
                                                render_new_tab();
                                            }
                                        }, 'cnt_1158'),
                                    );
                                }
                            }
                        }, 'cnt_1159'),
                );
            });
        }, 'cnt_1160');

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
        }, 'cnt_1161');

    private set_page_title = (): void =>
        err(() => {
            const title_el = s<HTMLTitleElement>('title');

            if (n(title_el)) {
                title_el.textContent = ext.msg(`${page}_title_text`);
            }
        }, 'cnt_1162');
}
