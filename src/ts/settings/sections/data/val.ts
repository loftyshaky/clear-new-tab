import { action } from 'mobx';

import { i_data, i_color as i_color_shared } from '@loftyshaky/shared/shared';
import { o_color, d_inputs, d_color, i_inputs, i_color } from '@loftyshaky/shared/inputs';
import { d_developer_mode, s_sections } from '@loftyshaky/shared/settings';
import {
    vars,
    d_backgrounds as d_backgrounds_shared,
    d_data,
    s_css_vars,
    s_theme,
} from 'shared_clean/internal';
import { s_preload_color } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_optional_permission_settings,
    d_sections,
    d_scheduler,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {
        this.get_os();
    }

    private os: string = '';

    public get_os = (): Promise<void> =>
        err_async(async () => {
            const platform_info = await we.runtime.getPlatformInfo();

            this.os = platform_info.os;
        }, 'cnt_1286');

    public change = action(
        ({ input, i }: { input: i_inputs.Input; i?: i_color.I }): Promise<void> =>
            err_async(async () => {
                let val: i_data.Val;
                const set_val = (): Promise<void> =>
                    err_async(async () => {
                        d_inputs.Val.set({
                            val,
                            input,
                        });

                        d_inputs.NestedInput.set_parent_disbled_vals({
                            input,
                            sections: d_sections.Sections.sections as i_inputs.Sections,
                            set_to_all_sections: true,
                        });

                        s_css_vars.CssVars.set();

                        if (d_background_settings.Val.allowed_keys.includes(input.name)) {
                            await d_background_settings.Val.change({
                                name: input.name,
                                new_val: val,
                            });
                        } else if (
                            d_background_settings.GlobalCheckboxes.global_checkboxes.includes(
                                input.name,
                            )
                        ) {
                            d_background_settings.GlobalCheckboxes.restore_global_val({
                                name: input.name.replace('_global', ''),
                            });
                        } else if (
                            ['mode', 'slideshow', 'background_change_interval'].includes(input.name)
                        ) {
                            data.settings.prefs[input.name] = val;
                            data.settings.prefs.background_change_time = new Date().getTime();

                            await d_data.Manipulation.send_msg_to_update_settings({
                                settings: data.settings,
                                load_settings: true,
                                update_instantly: true,
                            });

                            if (input.name === 'mode') {
                                if (val === 'theme_background') {
                                    await ext.send_msg_resp({
                                        msg: 'get_theme_background',
                                        force_theme_redownload: false,
                                        triggered_by_load_theme_background_btn: false,
                                    });
                                }
                                if (val === 'multiple_backgrounds') {
                                    // eslint-disable-next-line max-len
                                    d_backgrounds_shared.CurrentBackground.set_future_background_id();
                                }
                            }
                        } else if (input.name !== 'create_solid_color_background') {
                            const is_text_input: boolean = input.type === 'text';

                            await d_data.Manipulation.send_msg_to_update_settings({
                                settings: {
                                    prefs: {
                                        ...data.settings.prefs,
                                        [input.name]: val,
                                    },
                                },
                                update_background: input.name === 'enable_video_repeat', // Whithout this, video in new tab would disappear when you enable video repeat. To reproduce this bug do the following: 1. Remove update_background: input.name === 'enable_video_repeat'. 2. Open options page and disable "Enable the ability to repeat video backgrounds". 2. Open new tab. 3. Enable "Enable the ability to repeat video backgrounds". 4. Go to new tab and observe no video there.
                                update_instantly: !is_text_input,
                                load_settings: !is_text_input,
                            });
                        }

                        if (
                            ['color_type', 'slideshow', 'background_change_interval'].includes(
                                input.name,
                            ) ||
                            (input.name === 'mode' && val !== 'theme_background')
                        ) {
                            // (input.name === 'mode' && val !== 'theme_background') needed to prevent background change animation when selecting theme_background mode. Reproduce: 1. remove val !== 'theme_background' from condition. 2. Select theme_background mode and let theme background install. 3. Select one_background mode. 4. Set any non theme background. 5. Go to opened new tab. 6. Select theme_background mode. 7. Go to opened new tab. Result: change animation is played instead of instant background change.
                            await ext.send_msg_resp({
                                msg: 'get_background',
                                force_change: true,
                                force_update: true,
                                allow_to_start_slideshow_timer: false,
                            });
                        }
                    }, 'cnt_1287');

                if (input.type === 'color' && n(i)) {
                    val = d_color.Color.access({
                        input,
                        i,
                    });
                } else {
                    val = d_inputs.Val.access({ input });

                    if (
                        ['background_change_interval', 'video_volume', 'video_speed'].includes(
                            input.name,
                        ) &&
                        n(val)
                    ) {
                        val = +val;
                    }
                }

                if (input.type === 'text') {
                    if (!d_sections.Validation.validate_input({ input })) {
                        if (
                            n(val) &&
                            [
                                'transition_duration',
                                'current_background_id',
                                'one_backup_file_size_in_bytes',
                                'backgrounds_per_page',
                            ].includes(input.name)
                        ) {
                            val = +val;
                        }

                        if (input.name === 'current_background_id') {
                            d_backgrounds.CurrentBackground.save_current_background_id_from_i();
                        } else if (input.name === 'paste_background') {
                            d_inputs.Val.set({
                                val: '',
                                input,
                            });
                        } else {
                            await set_val();
                        }
                    }
                } else if (input.type !== 'color' || i === 'main') {
                    if (input.name === 'mode') {
                        d_sections.Upload.set_visibility_of_error_msg({
                            is_visible: false,
                        });
                    }

                    const is_optional_permission_checkbox: boolean = Object.keys(
                        d_optional_permission_settings.Permission.optional_permission_checkbox_dict,
                    ).includes(input.name);

                    if (is_optional_permission_checkbox) {
                        d_inputs.Val.set({
                            val: !val,
                            input,
                        });

                        await d_optional_permission_settings.Permission.set({
                            name: input.name,
                        });
                    } else {
                        await set_val();
                    }

                    s_sections.Theme.change({
                        input,
                        name: val as string,
                        additional_theme_callback: s_theme.Theme.set,
                    });

                    if (input.name === 'create_solid_color_background') {
                        d_backgrounds.Color.create_solid_color_background({
                            color: val as string,
                        });
                    } else if (input.name === 'settings_context') {
                        if (val === 'global') {
                            d_background_settings.SettingsContext.react_to_global_selection();
                        } else if (val === 'selected_background') {
                            // eslint-disable-next-line max-len
                            d_background_settings.SettingsContext.show_selected_background_notification();
                        }
                    } else if (input.name === 'enable_video_repeat') {
                        d_background_settings.SettingsContext.react_to_background_selection({
                            background: d_background_settings.SettingsContext.selected_background,
                        });
                    }
                } else if (n(i)) {
                    const { colors } = data.settings.prefs;

                    colors[i] = val;

                    s_css_vars.CssVars.set();

                    await d_data.Manipulation.send_msg_to_update_settings({
                        settings: {
                            prefs: {
                                ...data.settings.prefs,
                                colors,
                            },
                        },
                        load_settings: true,
                        update_instantly: true,
                        update_background: true,
                    });
                }

                s_preload_color.Storage.set_preload_color();
            }, 'cnt_1288'),
    );

    public remove_val = ({ input }: { input: i_inputs.Input }): Promise<void> =>
        err_async(async () => {
            if (['year', 'time'].includes(input.name)) {
                this.change({ input });

                await d_data.Manipulation.send_msg_to_update_settings({
                    settings: {
                        prefs: {
                            ...data.settings.prefs,
                            [input.name]: vars.scheduler_none_val,
                        },
                    },
                    load_settings: true,
                    update_instantly: true,
                });

                await d_scheduler.Val.set_add_new_task_btn_ability();
            }
        }, 'cnt_1290');

    public save_selected_palette_color = ({
        input,
        i,
    }: {
        input: i_inputs.Input;
        i: i_color.I;
    }): Promise<void> =>
        err_async(async () => {
            if (input.name !== 'create_solid_color_background') {
                await d_background_settings.Val.change({ name: input.name, new_val: i });

                s_preload_color.Storage.set_preload_color();
            }
        }, 'cnt_1291');

    public remove_color_callback = ({ input }: { input: o_color.Color }): Promise<void> =>
        err_async(async () => {
            await d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    prefs: {
                        ...data.settings.prefs,
                        [input.name]: '',
                    },
                },
                load_settings: true,
            });
        }, 'cnt_1292');

    public restore_default_palette_callback = ({
        default_colors,
    }: {
        default_colors: i_color_shared.Color[];
    }): Promise<void> =>
        err_async(
            async () =>
                d_data.Manipulation.send_msg_to_update_settings({
                    settings: {
                        prefs: {
                            ...data.settings.prefs,
                            colors: default_colors,
                        },
                    },
                    load_settings: true,
                }),
            'cnt_1293',
        );

    public admin_change_visibility_of_content_save_callback = ({
        bool,
    }: {
        bool: boolean;
    }): Promise<void> =>
        err_async(
            async () =>
                d_data.Manipulation.send_msg_to_update_settings({
                    settings: {
                        prefs: {
                            ...data.settings.prefs,
                            admin_section_content_is_visible: bool,
                        },
                    },
                    update_instantly: false,
                    load_settings: false,
                }),
            'cnt_1470',
        );

    public enable_developer_mode = (): Promise<void> =>
        err_async(async () => {
            d_developer_mode.DeveloperMode.enable({
                save_callback: async () =>
                    d_data.Manipulation.send_msg_to_update_settings({
                        settings: {
                            prefs: {
                                ...data.settings.prefs,
                                developer_mode: data.settings.prefs.developer_mode,
                            },
                        },
                        load_settings: true,
                        update_instantly: true,
                        update_background: true,
                    }),
            });
        }, 'cnt_1210');
}

export const Val = Class.get_instance();
