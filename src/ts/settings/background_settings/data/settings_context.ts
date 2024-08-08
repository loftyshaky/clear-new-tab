import { makeObservable, action } from 'mobx';

import { i_db } from 'shared_clean/internal';
import {
    d_background_settings,
    s_background_settings,
    d_backgrounds,
    d_sections,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            react_to_global_selection: action,
            react_to_background_selection: action,
            show_selected_background_notification: action,
        });
    }

    public selected_background: i_db.Background | undefined;

    public react_to_global_selection = (): void =>
        err(() => {
            data.ui.settings_context = 'global';

            data.ui.background_size = data.settings.background_size;
            data.ui.background_position = data.settings.background_position;
            data.ui.background_repeat = data.settings.background_repeat;
            data.ui.color_of_area_around_background = data.settings.color_of_area_around_background;
            data.ui.video_speed = data.settings.video_speed;
            data.ui.video_volume = data.settings.video_volume;

            const sections = d_sections.Sections.sections as any;

            this.reset_is_enabled_state({ val: true });

            // eslint-disable-next-line max-len
            sections.background_settings.inputs.color_of_area_around_background_group.inputs[1].is_enabled =
                false;
            sections.background_settings.inputs.video_speed_group.inputs[1].is_enabled = false;
            sections.background_settings.inputs.video_volume_group.inputs[1].is_enabled = false;

            d_background_settings.GlobalCheckboxes.set_ui_vals();

            s_background_settings.GlobalOptions.hide();

            d_backgrounds.CurrentBackground.deselect();
        }, 'cnt_1084');

    public react_to_background_selection = ({
        background,
    }: {
        background: i_db.Background | undefined;
    }): void =>
        err(() => {
            if (n(background)) {
                data.ui.settings_context = 'selected_background';

                this.selected_background = background;

                const sections = d_sections.Sections.sections as any;
                const is_img: boolean =
                    background.type === 'img_link' || background.type.includes('img');
                const is_video: boolean = background.type.includes('video');
                const is_color: boolean = background.type.includes('color');

                this.reset_is_enabled_state({ val: true });

                if (is_img || is_video) {
                    data.ui.background_size = (background as i_db.FileBackground).background_size;
                    data.ui.background_position = (
                        background as i_db.FileBackground
                    ).background_position;
                    data.ui.background_repeat = (
                        background as i_db.FileBackground
                    ).background_repeat;
                    data.ui.color_of_area_around_background =
                        (background as i_db.FileBackground).color_of_area_around_background ===
                        'global'
                            ? data.settings.color_of_area_around_background
                            : (background as i_db.FileBackground).color_of_area_around_background;
                }

                if (is_img) {
                    sections.background_settings.inputs.video_speed_group.is_enabled = false;
                    sections.background_settings.inputs.video_volume_group.is_enabled = false;
                }

                if (is_video) {
                    data.ui.video_speed =
                        (background as i_db.FileBackground).video_speed === 'global'
                            ? data.settings.video_speed
                            : (background as i_db.FileBackground).video_speed;

                    data.ui.video_volume =
                        (background as i_db.FileBackground).video_volume === 'global'
                            ? data.settings.video_volume
                            : (background as i_db.FileBackground).video_volume;

                    sections.background_settings.inputs.background_repeat.is_enabled =
                        !!data.settings.enable_video_repeat;
                    sections.background_settings.inputs.video_speed_group.is_enabled = true;
                    sections.background_settings.inputs.video_volume_group.is_enabled = true;
                }

                if (is_color) {
                    this.reset_is_enabled_state({ val: false });
                }

                d_background_settings.GlobalCheckboxes.set_ui_vals();
                s_background_settings.GlobalOptions.show();
            }
        }, 'cnt_1085');

    private reset_is_enabled_state = ({ val }: { val: boolean }): void =>
        err(() => {
            const sections = d_sections.Sections.sections as any;

            sections.background_settings.inputs.background_repeat.is_enabled = val;
            sections.background_settings.inputs.background_size.is_enabled = val;
            sections.background_settings.inputs.background_position.is_enabled = val;

            if (val) {
                // eslint-disable-next-line max-len
                sections.background_settings.inputs.color_of_area_around_background_group.inputs[0].is_enabled =
                    val;
                // eslint-disable-next-line max-len
                sections.background_settings.inputs.color_of_area_around_background_group.inputs[1].is_enabled =
                    val;
                sections.background_settings.inputs.video_speed_group.inputs[0].is_enabled = val;
                sections.background_settings.inputs.video_speed_group.inputs[1].is_enabled = val;
                sections.background_settings.inputs.video_volume_group.inputs[0].is_enabled = val;
                sections.background_settings.inputs.video_volume_group.inputs[1].is_enabled = val;
            } else {
                // eslint-disable-next-line max-len
                sections.background_settings.inputs.color_of_area_around_background_group.inputs[0].is_enabled =
                    true;
                // eslint-disable-next-line max-len
                sections.background_settings.inputs.color_of_area_around_background_group.inputs[1].is_enabled =
                    true;
                sections.background_settings.inputs.video_speed_group.inputs[0].is_enabled = true;
                sections.background_settings.inputs.video_speed_group.inputs[1].is_enabled = true;
                sections.background_settings.inputs.video_volume_group.inputs[0].is_enabled = true;
                sections.background_settings.inputs.video_volume_group.inputs[1].is_enabled = true;
            }

            sections.background_settings.inputs.video_speed_group.is_enabled = val;
            sections.background_settings.inputs.video_volume_group.is_enabled = val;
            sections.background_settings.inputs.color_of_area_around_background_group.is_enabled =
                val;
        }, 'cnt_1086');

    public show_selected_background_notification = (): void =>
        err(() => {
            data.ui.settings_context = 'global';

            show_notification({
                error_msg_key: 'select_background_notification',
                hide_delay: 8000,
            });
        }, 'cnt_1087');
}

export const SettingsContext = Class.get_instance();
