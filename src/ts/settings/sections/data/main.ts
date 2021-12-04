import { s_utils } from '@loftyshaky/shared';
import { o_inputs, o_color, i_inputs } from '@loftyshaky/shared/inputs';
import { d_settings } from '@loftyshaky/shared/settings';
import { svg } from 'shared/internal';
import { d_backgrounds, d_sections } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private options: i_inputs.Options = {};
    public sections: o_inputs.Section[] | i_inputs.Sections = [];

    public init_options = (): void =>
        err(() => {
            this.options = {
                mode: [
                    new o_inputs.Option({ name: 'theme_background' }),
                    new o_inputs.Option({ name: 'one_background' }),
                    new o_inputs.Option({ name: 'multiple_backgrounds' }),
                    new o_inputs.Option({ name: 'random_solid_color' }),
                ],
                background_change_interval: [
                    new o_inputs.Option({ name: '1_millisecond' }),
                    new o_inputs.Option({ name: '3_seconds' }),
                    new o_inputs.Option({ name: '5_seconds' }),
                    new o_inputs.Option({ name: '10_seconds' }),
                    new o_inputs.Option({ name: '15_seconds' }),
                    new o_inputs.Option({ name: '30_seconds' }),
                    new o_inputs.Option({ name: '1_minute' }),
                    new o_inputs.Option({ name: '5_minutes' }),
                    new o_inputs.Option({ name: '10_minutes' }),
                    new o_inputs.Option({ name: '15_minutes' }),
                    new o_inputs.Option({ name: '30_minutes' }),
                    new o_inputs.Option({ name: '1_hour' }),
                    new o_inputs.Option({ name: '3_hours' }),
                    new o_inputs.Option({ name: '6_hours' }),
                    new o_inputs.Option({ name: '12_hours' }),
                    new o_inputs.Option({ name: '1_day' }),
                    new o_inputs.Option({ name: '2_days' }),
                    new o_inputs.Option({ name: '4_days' }),
                    new o_inputs.Option({ name: '1_week' }),
                    new o_inputs.Option({ name: '2_weeks' }),
                    new o_inputs.Option({ name: '4_weeks' }),
                ],
                background_change_effect: [
                    new o_inputs.Option({ name: 'crossfade' }),
                    new o_inputs.Option({ name: 'slide' }),
                ],
                slide_direction: [
                    new o_inputs.Option({ name: 'random' }),
                    new o_inputs.Option({ name: 'from_right_to_left' }),
                    new o_inputs.Option({ name: 'from_left_to_right' }),
                    new o_inputs.Option({ name: 'from_top_to_bottom' }),
                    new o_inputs.Option({ name: 'from_bottom_to_top' }),
                ],
                settings_type: [
                    new o_inputs.Option({ name: 'global' }),
                    new o_inputs.Option({ name: 'selected_background' }),
                ],
                background_size: [
                    new o_inputs.Option({ name: 'global' }),
                    new o_inputs.Option({ name: 'dont_resize' }),
                    new o_inputs.Option({ name: 'cover_screen' }),
                    new o_inputs.Option({ name: 'cover_browser' }),
                    new o_inputs.Option({ name: 'fit_screen' }),
                    new o_inputs.Option({ name: 'fit_browser' }),
                    new o_inputs.Option({ name: 'stretch_screen' }),
                    new o_inputs.Option({ name: 'stretch_browser' }),
                ],
                background_position: [
                    new o_inputs.Option({ name: 'global' }),
                    new o_inputs.Option({ name: 'center_top' }),
                    new o_inputs.Option({ name: 'center_center' }),
                    new o_inputs.Option({ name: 'center_bottom' }),
                    new o_inputs.Option({ name: 'left_top' }),
                    new o_inputs.Option({ name: 'left_center' }),
                    new o_inputs.Option({ name: 'left_bottom' }),
                    new o_inputs.Option({ name: 'right_top' }),
                    new o_inputs.Option({ name: 'right_center' }),
                    new o_inputs.Option({ name: 'right_bottom' }),
                ],
                background_repeat: [
                    new o_inputs.Option({ name: 'global' }),
                    new o_inputs.Option({ name: 'no_repeat' }),
                    new o_inputs.Option({ name: 'repeat' }),
                    new o_inputs.Option({ name: 'repeat_y' }),
                    new o_inputs.Option({ name: 'repeat_x' }),
                ],
            };
        }, 'cnt_1127');

    public init_sections = (): void =>
        err(() => {
            this.sections = [
                ...[
                    new o_inputs.Section({
                        name: 'background_upload',
                        inputs: [
                            new o_inputs.LinkBtn({
                                name: 'link_to_theme_img',
                                event_callback: () => undefined,
                            }),
                            new o_inputs.Btn({
                                name: 'load_theme_background',
                                event_callback: () => undefined,
                            }),
                            new o_inputs.UploadBox({
                                name: 'upload_background',
                                include_help: true,
                                accept: '.png,.jpg,.jpeg,.gif,.mp4,.webm,.ogv',
                                multiple: true,
                                event_callback: d_backgrounds.Upload.i().upload_with_browse_btn,
                            }),
                            new o_inputs.Text({
                                name: 'paste_background',
                                include_help: true,
                                allow_removing_val: false,
                                text_btns: [
                                    {
                                        name: 'paste_background',
                                        Svg: svg.ContentPaste,
                                        visibility_cond:
                                            d_sections.TextBtns.i()
                                                .decide_paste_background_btn_visibility,
                                        event_callback:
                                            d_backgrounds.Upload.i().upload_with_paste_btn,
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                                paste_callback: d_backgrounds.Upload.i().upload_with_paste_input,
                                warn_state_checker: d_sections.Val.i().validate_input,
                            }),
                            new o_inputs.Checkbox({
                                name: 'download_img_when_link_given',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_color.Color({
                                name: 'create_solid_color_background',
                                include_remove_color_btn: false,
                                include_ok_btn: true,
                                event_callback: d_sections.Val.i().change,
                                select_palette_color_callback:
                                    d_sections.Val.i().save_selected_palette_color,
                                hide_color_help_callback: d_sections.Visibility.i().hide_color_help,
                                remove_color_callback: d_sections.Val.i().remove_color_callback,
                                restore_default_palette_callback:
                                    d_sections.Val.i().restore_default_palette_callback,
                            }),
                        ],
                    }),
                    new o_inputs.Section({
                        name: 'background_settings',
                        inputs: [
                            new o_inputs.Select({
                                name: 'mode',
                                options: this.options,
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'keep_old_themes_backgrounds',
                                visiblity_conds: [
                                    { input_name: 'mode', pass_values: ['theme_background'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Text({
                                name: 'current_background_id',
                                text_type: 'number',
                                visiblity_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_values: ['one_background', 'multiple_backgrounds'],
                                    },
                                ],
                                text_btns: [
                                    {
                                        name: 'set_background_as_current',
                                        Svg: svg.AssistantPhoto,
                                        visibility_cond:
                                            d_sections.TextBtns.i()
                                                .decide_set_background_as_current_btn_visibility,
                                        event_callback:
                                            d_backgrounds.CurrentBackground.i()
                                                .set_selected_background_as_current,
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                                warn_state_checker: d_sections.Val.i().validate_input,
                            }),
                            new o_inputs.Checkbox({
                                name: 'automatically_set_last_uploaded_background_as_current',
                                visiblity_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_values: ['one_background', 'multiple_backgrounds'],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_interval',
                                options: this.options,
                                visiblity_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_values: ['multiple_backgrounds', 'random_solid_color'],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'slideshow',
                                visiblity_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_values: ['multiple_backgrounds', 'random_solid_color'],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_effect',
                                options: this.options,
                                parent: 'slideshow',
                                visiblity_conds: [
                                    { input_name: 'mode', pass_values: ['multiple_backgrounds'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'slide_direction',
                                visiblity_conds: [
                                    { input_name: 'mode', pass_values: ['multiple_backgrounds'] },
                                    {
                                        input_name: 'background_change_effect',
                                        pass_values: ['slide'],
                                    },
                                ],
                                options: this.options,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'shuffle_backgrounds',
                                visiblity_conds: [
                                    { input_name: 'mode', pass_values: ['multiple_backgrounds'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'settings_type',
                                options: this.options,
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_size',
                                options: this.options,
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_position',
                                options: this.options,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_repeat',
                                options: this.options,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_color.Color({
                                name: 'color_of_area_around_background',
                                event_callback: d_sections.Val.i().change,
                                select_palette_color_callback:
                                    d_sections.Val.i().save_selected_palette_color,
                                hide_color_help_callback: d_sections.Visibility.i().hide_color_help,
                                remove_color_callback: d_sections.Val.i().remove_color_callback,
                                restore_default_palette_callback:
                                    d_sections.Val.i().restore_default_palette_callback,
                            }),
                            new o_inputs.Range({
                                name: 'video_volume',
                                max: 1,
                                step: 0.01,
                                event_callback: d_sections.Val.i().change,
                            }),
                        ],
                    }),
                    new o_inputs.Section({
                        name: 'other_settings',
                        inputs: [
                            new o_inputs.Checkbox({
                                name: 'paste_btn_is_visible',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'allow_downloading_img_by_link',
                                event_callback: d_sections.Val.i().change,
                            }),
                        ],
                    }),
                ],
                ...d_settings.Sections.i().make_shared_sections({
                    download_back_up_callback: ext.storage_get,
                    upload_back_up_callback: d_sections.Restore.i().restore_back_up,
                    restore_defaults_callback: () => d_sections.Restore.i().restore_confirm(),
                    input_change_val_callback: d_sections.Val.i().change,
                    restore_inputs: [
                        new o_inputs.Btn({
                            name: 'delete_all_backgrounds',
                            event_callback: () => undefined,
                        }),
                    ],
                }),
                ...[
                    new o_inputs.Section({
                        name: 'links',
                        inputs: [
                            new o_inputs.Link({
                                name: 'privacy_policy',
                                href: 'https://bit.ly/extensions-privacy-policy',
                            }),
                            new o_inputs.Link({
                                name: 'rate',
                                browser: env.browser,
                                force_resolve: true,
                            }),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'clear_new_tab_for_chrome',
                                          browser: 'chrome',
                                      }),
                                      new o_inputs.Link({
                                          name: 'clear_new_tab_for_edge',
                                          browser: 'edge',
                                      }),
                                      new o_inputs.Link({
                                          name: 'clear_new_tab_for_firefox',
                                          browser: 'firefox',
                                      }),
                                  ]),
                            new o_inputs.Link({
                                name: 'facebook_page',
                                href: 'http://bit.ly/browservery',
                            }),
                            new o_inputs.Link({
                                name: 'support_page',
                                href: 'http://bit.ly/browservery-support',
                            }),
                        ],
                    }),
                ],
            ];

            this.sections = s_utils.Main.i().to_object({
                arr: this.sections as o_inputs.Section[],
            });
            this.sections.background_upload.inputs = s_utils.Main.i().to_object({
                arr: this.sections.background_upload.inputs as o_inputs.Section[],
                section: 'background_upload',
            });
            this.sections.background_settings.inputs = s_utils.Main.i().to_object({
                arr: this.sections.background_settings.inputs as o_inputs.Section[],
                section: 'background_settings',
            });
            this.sections.links.inputs = s_utils.Main.i().to_object({
                arr: this.sections.links.inputs as o_inputs.Section[],
                section: 'links',
            });
        }, 'cnt_1128');
}
