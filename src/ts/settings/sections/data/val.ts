import { action } from 'mobx';

import { i_data } from '@loftyshaky/shared';
import { o_color, d_inputs, d_color, i_inputs, i_color } from '@loftyshaky/shared/inputs';
import { s_settings } from '@loftyshaky/shared/settings';
import { vars, s_css_vars, s_preload_color, s_theme } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    s_custom_code,
    d_optional_permission_settings,
    d_sections,
    s_browser_theme,
    d_scheduler,
} from 'settings/internal';

export class Val {
    private static i0: Val;

    public static i(): Val {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
                        d_inputs.Val.i().set({
                            val,
                            input,
                        });

                        d_inputs.NestedInput.i().set_parent_disbled_vals({
                            input,
                            sections: d_sections.Main.i().sections as i_inputs.Sections,
                            set_to_all_sections: true,
                        });

                        s_css_vars.Main.i().set();

                        if (d_background_settings.Val.i().allowed_keys.includes(input.name)) {
                            await d_background_settings.Val.i().change({
                                name: input.name,
                                new_val: val,
                            });
                        } else if (
                            d_background_settings.GlobalCheckboxes.i().global_checkboxes.includes(
                                input.name,
                            )
                        ) {
                            d_background_settings.GlobalCheckboxes.i().restore_global_val({
                                name: input.name.replace('_global', ''),
                            });
                        } else if (
                            ['mode', 'slideshow', 'background_change_interval'].includes(input.name)
                        ) {
                            data.settings[input.name] = val;
                            data.settings.background_change_time = new Date().getTime();

                            await ext.send_msg_resp({
                                msg: 'update_settings_background',
                                settings: data.settings,
                                update_instantly: true,
                            });

                            if (input.name === 'mode' && val === 'theme_background') {
                                await s_browser_theme.Main.i().get_theme_background({
                                    theme_id: undefined,
                                    force_theme_redownload: false,
                                });
                            }
                        } else if (input.name !== 'create_solid_color_background') {
                            await ext.send_msg_resp({
                                msg: 'update_settings_background',
                                settings: { [input.name]: val },
                                update_instantly: true,
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
                    val = d_color.Color.i().access({
                        input,
                        i,
                    });
                } else {
                    val = d_inputs.Val.i().access({ input });

                    if (
                        ['background_change_interval', 'video_volume'].includes(input.name) &&
                        n(val)
                    ) {
                        val = +val;
                    }
                }

                if (input.type === 'text') {
                    if (!this.validate_input({ input })) {
                        if (
                            n(val) &&
                            ['transition_duration', 'current_background_id'].includes(input.name)
                        ) {
                            val = +val;
                        }

                        if (input.name === 'current_background_id') {
                            d_backgrounds.CurrentBackground.i().save_current_background_id_from_i();
                        } else if (input.name === 'paste_background') {
                            d_inputs.Val.i().set({
                                val: '',
                                input,
                            });
                        } else {
                            await set_val();
                        }
                    }
                } else if (input.type !== 'color' || i === 'main') {
                    if (input.name === 'mode') {
                        d_sections.Upload.i().set_visibility_of_error_msg({
                            is_visible: false,
                        });
                    }

                    const is_optional_permission_checkbox: boolean = Object.keys(
                        d_optional_permission_settings.Main.i().optional_permission_checkbox_dict,
                    ).includes(input.name);

                    if (is_optional_permission_checkbox) {
                        d_inputs.Val.i().set({
                            val: !val,
                            input,
                        });

                        await d_optional_permission_settings.Main.i().set_permission({
                            name: input.name,
                        });
                    } else {
                        await set_val();
                    }

                    s_settings.Theme.i().change({
                        input,
                        name: val as string,
                        additional_theme_callback: s_theme.Main.i().set,
                    });
                    s_custom_code.CodeMirror.i().change_theme();

                    if (input.name === 'create_solid_color_background') {
                        d_backgrounds.Color.i().create_solid_color_background({
                            color: val as string,
                        });
                    } else if (input.name === 'settings_context') {
                        if (val === 'global') {
                            d_background_settings.SettingsContext.i().react_to_global_selection();
                        } else if (val === 'selected_background') {
                            // eslint-disable-next-line max-len
                            d_background_settings.SettingsContext.i().show_selected_background_alert();
                        }
                    }
                } else if (n(i)) {
                    const { colors } = data.settings;

                    colors[i] = val;

                    s_css_vars.Main.i().set();

                    await ext.send_msg_resp({
                        msg: 'update_settings_background',
                        settings: { colors },
                        update_instantly: true,
                        update_background: true,
                    });
                }

                s_preload_color.Storage.i().set_preload_color();
            }, 'cnt_1288'),
    );

    public validate_input = ({ input }: { input: i_inputs.Input }): boolean =>
        err(() => {
            const val: i_data.Val = d_inputs.Val.i().access({ input });

            if (typeof val === 'string') {
                if (input.name === 'paste_background') {
                    return false;
                }

                if (input.name === 'current_background_id') {
                    return !this.validate_current_background_i({ val });
                }

                if (input.name === 'transition_duration') {
                    return d_inputs.Val.i().validate_input({ input });
                }

                if (input.name === 'year') {
                    return !(
                        (/^2\d{3}$/.test(val) && +val >= new Date().getFullYear()) ||
                        val === ''
                    );
                }

                if (input.name === 'time') {
                    return !(/^(2[0-3]|[0-1][\d]):[0-5][\d]:[0-5][\d]$/.test(val) || val === '');
                }

                return !/^1$|^0$|^(0\.[0-9]{1,2}|1\.00?)$/.test(val);
            }

            return false;
        }, 'cnt_1289');

    public remove_val = ({ input }: { input: i_inputs.Input }): Promise<void> =>
        err_async(async () => {
            if (['year', 'time'].includes(input.name)) {
                await ext.send_msg_resp({
                    msg: 'update_settings_background',
                    settings: { [input.name]: vars.scheduler_none_val },
                    update_instantly: true,
                });

                await d_scheduler.Val.i().set_add_new_task_btn_ability();
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
                await d_background_settings.Val.i().change({ name: input.name, new_val: i });

                s_preload_color.Storage.i().set_preload_color();
            }
        }, 'cnt_1291');

    public remove_color_callback = ({ input }: { input: o_color.Color }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: { [input.name]: '' },
            });
        }, 'cnt_1292');

    public restore_default_palette_callback = ({
        default_colors,
    }: {
        default_colors: i_color.Color[];
    }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: { colors: default_colors },
            });
        }, 'cnt_1293');

    validate_current_background_i = ({ val }: { val: i_data.Val }): boolean =>
        err(() => {
            const i: number = (val as number) - 1;

            return (
                /^(?!0)\d+$/.test(val as string) &&
                (i === 0 || i <= d_backgrounds.Main.i().backgrounds.length - 1)
            );
        }, 'cnt_1294');
}
