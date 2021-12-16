import { action } from 'mobx';

import { i_data } from '@loftyshaky/shared';
import { o_color, d_inputs, d_color, i_inputs, i_color } from '@loftyshaky/shared/inputs';
import { s_settings } from '@loftyshaky/shared/settings';
import { s_css_vars, s_theme } from 'shared/internal';
import { d_background_settings, d_backgrounds, d_sections } from 'settings/internal';

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
        }, 'cnt_1136');

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
                        } else if (input.name !== 'create_solid_color_background') {
                            await ext.send_msg_resp({
                                msg: 'update_settings',
                                settings: { [input.name]: val },
                                rerun_actions: true,
                            });
                        }
                    }, 'cnt_1137');

                if (input.type === 'color' && n(i)) {
                    val = d_color.Color.i().access({
                        input,
                        i,
                    });
                } else {
                    val = d_inputs.Val.i().access({ input });
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
                    await set_val();

                    s_settings.Theme.i().change({
                        input,
                        name: val as string,
                        additional_theme_callback: s_theme.Main.i().set,
                    });

                    if (input.name === 'create_solid_color_background') {
                        d_backgrounds.Color.i().create_solid_color_background({
                            color: val as string,
                        });
                    } else if (input.name === 'settings_type') {
                        if (val === 'global') {
                            d_background_settings.SettingsType.i().react_to_global_selection();
                        }
                    }
                } else if (n(i)) {
                    const { colors } = data.settings;

                    colors[i] = val;

                    s_css_vars.Main.i().set();

                    await ext.send_msg_resp({
                        msg: 'update_settings',
                        settings: { colors },
                        rerun_actions: true,
                    });
                }
            }, 'cnt_1138'),
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

                return !/^1$|^0$|^(0\.[0-9]{1,2}|1\.00?)$/.test(val);
            }

            return false;
        }, 'cnt_1141');

    public remove_val = ({ input }: { input: i_inputs.Input }): Promise<void> =>
        err_async(async () => {
            this.change({ input });
        }, 'cnt_1142');

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
            }
        }, 'cnt_1143');

    public remove_color_callback = ({ input }: { input: o_color.Color }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_settings',
                settings: { [input.name]: '' },
                rerun_actions: true,
            });
        }, 'cnt_1144');

    public restore_default_palette_callback = ({
        default_colors,
    }: {
        default_colors: i_color.Color[];
    }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_settings',
                settings: { colors: default_colors },
                rerun_actions: true,
            });
        }, 'cnt_1145');

    validate_current_background_i = ({ val }: { val: i_data.Val }): boolean =>
        err(() => {
            const i: number = (val as number) - 1;

            return (
                /^(?!0)\d+$/.test(val as string) &&
                (i === 0 || i <= d_backgrounds.Main.i().backgrounds.length - 1)
            );
        }, 'cnt_99999');
}
