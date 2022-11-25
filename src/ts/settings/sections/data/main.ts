import { s_utils } from '@loftyshaky/shared';
import { o_inputs, o_color, i_inputs } from '@loftyshaky/shared/inputs';
import { d_settings } from '@loftyshaky/shared/settings';
import { svg } from 'shared/internal';
import {
    d_backgrounds,
    d_sections,
    s_browser_theme,
    d_custom_code,
    d_scheduler,
    s_custom_code,
    s_theme,
} from 'settings/internal';

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
                    new o_inputs.Option({ name: 'scheduled' }),
                ],
                color_type: [
                    new o_inputs.Option({ name: 'all' }),
                    new o_inputs.Option({ name: 'pastel' }),
                ],
                background_change_interval: [
                    new o_inputs.Option({ name: '1_millisecond', val: 1 }),
                    new o_inputs.Option({ name: '3_seconds', val: 3000 }),
                    new o_inputs.Option({ name: '5_seconds', val: 5000 }),
                    new o_inputs.Option({ name: '10_seconds', val: 10000 }),
                    new o_inputs.Option({ name: '15_seconds', val: 15000 }),
                    new o_inputs.Option({ name: '30_seconds', val: 30000 }),
                    new o_inputs.Option({ name: '1_minute', val: 60000 }),
                    new o_inputs.Option({ name: '5_minutes', val: 300000 }),
                    new o_inputs.Option({ name: '10_minutes', val: 600000 }),
                    new o_inputs.Option({ name: '15_minutes', val: 900000 }),
                    new o_inputs.Option({ name: '30_minutes', val: 1800000 }),
                    new o_inputs.Option({ name: '1_hour', val: 3600000 }),
                    new o_inputs.Option({ name: '3_hours', val: 10800000 }),
                    new o_inputs.Option({ name: '6_hours', val: 21600000 }),
                    new o_inputs.Option({ name: '12_hours', val: 43200000 }),
                    new o_inputs.Option({ name: '1_day', val: 86400000 }),
                    new o_inputs.Option({ name: '2_days', val: 172800000 }),
                    new o_inputs.Option({ name: '4_days', val: 345600000 }),
                    new o_inputs.Option({ name: '1_week', val: 604800000 }),
                    new o_inputs.Option({ name: '2_weeks', val: 1209600000 }),
                    new o_inputs.Option({ name: '4_weeks', val: 2419200000 }),
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
                settings_context: [
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
                    new o_inputs.Option({ name: 'top' }),
                    new o_inputs.Option({ name: 'center' }),
                    new o_inputs.Option({ name: 'bottom' }),
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
                home_btn_position: [
                    new o_inputs.Option({ name: 'left_top' }),
                    new o_inputs.Option({ name: 'left_bottom' }),
                    new o_inputs.Option({ name: 'right_top' }),
                    new o_inputs.Option({ name: 'right_bottom' }),
                ],
            };
        }, 'cnt_1268');

    public init_sections = (): void =>
        err(() => {
            this.sections = [
                ...[
                    new o_inputs.Section({
                        name: 'background_upload',
                        inputs: [
                            new o_inputs.LinkBtn({
                                name: 'link_to_theme_img',
                                event_callback: s_theme.LinkToImage.i().open,
                            }),
                            new o_inputs.Btn({
                                name: 'load_theme_background',
                                event_callback: (): void => {
                                    s_browser_theme.Main.i().get_theme_background({
                                        theme_id: undefined,
                                        force_theme_redownload: true,
                                        triggered_by_load_theme_background_btn: true,
                                    });
                                },
                                is_enabled_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['theme_background'],
                                    },
                                ],
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
                                is_cut: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_color.Color({
                                name: 'create_solid_color_background',
                                include_remove_color_btn: false,
                                include_ok_btn: true,
                                val_accessor: 'ui.create_solid_color_background',
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
                                alt_help_msg: ext.msg(`mode_${env.browser}_help_text`),
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Btn({
                                name: 'open_scheduler',
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['scheduled'],
                                    },
                                ],
                                event_callback: () => {
                                    d_scheduler.Visibility.i().change({
                                        is_visible: true,
                                    });
                                },
                            }),
                            new o_inputs.Select({
                                name: 'color_type',
                                options: this.options,
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['random_solid_color'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'keep_old_theme_backgrounds',
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['theme_background'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Text({
                                name: 'current_background_id',
                                text_type: 'number',
                                allow_removing_val: false,
                                val_accessor: 'ui.current_background_i',
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'one_background',
                                            'multiple_backgrounds',
                                            'scheduled',
                                        ],
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
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['one_background', 'multiple_backgrounds'],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_interval',
                                options: this.options,
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['multiple_backgrounds', 'random_solid_color'],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'slideshow',
                                include_help: true,
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'multiple_backgrounds',
                                            'random_solid_color',
                                            'scheduled',
                                        ],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_effect',
                                options: this.options,
                                parent: 'slideshow',
                                is_enabled_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'multiple_backgrounds',
                                            'random_solid_color',
                                            'scheduled',
                                        ],
                                    },
                                ],
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'multiple_backgrounds',
                                            'random_solid_color',
                                            'scheduled',
                                        ],
                                    },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'slide_direction',
                                is_enabled_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'multiple_backgrounds',
                                            'random_solid_color',
                                            'scheduled',
                                        ],
                                    },
                                    {
                                        input_name: 'background_change_effect',
                                        pass_vals: ['slide'],
                                    },
                                ],
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: [
                                            'multiple_backgrounds',
                                            'random_solid_color',
                                            'scheduled',
                                        ],
                                    },
                                ],
                                options: this.options,
                                parent: 'slideshow',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'shuffle_backgrounds',
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['multiple_backgrounds'] },
                                ],
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Hr({
                                name: 'hr_1',
                            }),
                            new o_inputs.Select({
                                name: 'settings_context',
                                options: this.options,
                                include_help: true,
                                val_accessor: 'ui.settings_context',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_size',
                                options: this.options,
                                include_help: true,
                                val_accessor: 'ui.background_size',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_position',
                                options: this.options,
                                include_help: true,
                                val_accessor: 'ui.background_position',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'background_repeat',
                                options: this.options,
                                include_help: true,
                                val_accessor: 'ui.background_repeat',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Group({
                                name: 'color_of_area_around_background_group',
                                include_help: true,
                                event_callback: () => undefined,
                                inputs: [
                                    new o_color.Color({
                                        name: 'color_of_area_around_background',
                                        val_accessor: 'ui.color_of_area_around_background',
                                        event_callback: d_sections.Val.i().change,
                                        select_palette_color_callback:
                                            d_sections.Val.i().save_selected_palette_color,
                                        hide_color_help_callback:
                                            d_sections.Visibility.i().hide_color_help,
                                        remove_color_callback:
                                            d_sections.Val.i().remove_color_callback,
                                        restore_default_palette_callback:
                                            d_sections.Val.i().restore_default_palette_callback,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'color_of_area_around_background_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.color_of_area_around_background_global',
                                        event_callback: d_sections.Val.i().change,
                                    }),
                                ],
                            }),
                            new o_inputs.Group({
                                name: 'video_speed_group',
                                include_help: true,
                                event_callback: () => undefined,
                                inputs: [
                                    new o_inputs.Text({
                                        name: 'video_speed',
                                        text_type: 'number',
                                        allow_removing_val: false,
                                        val_accessor: 'ui.video_speed',
                                        event_callback: d_sections.Val.i().change,
                                        warn_state_checker: d_sections.Val.i().validate_input,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'video_speed_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.video_speed_global',
                                        event_callback: d_sections.Val.i().change,
                                    }),
                                ],
                            }),
                            new o_inputs.Group({
                                name: 'video_volume_group',
                                event_callback: () => undefined,
                                inputs: [
                                    new o_inputs.Range({
                                        name: 'video_volume',
                                        val_accessor: 'ui.video_volume',
                                        max: 1,
                                        step: 0.01,
                                        event_callback: d_sections.Val.i().change,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'video_volume_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.video_volume_global',
                                        event_callback: d_sections.Val.i().change,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new o_inputs.Section({
                        name: 'other_settings',
                        inputs: [
                            d_settings.Sections.i().get_shared_input({
                                input_change_val_callback: d_sections.Val.i().change,
                            }).options_page_theme,
                            new o_inputs.Checkbox({
                                name: 'home_btn_is_visible',
                                include_help: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Select({
                                name: 'home_btn_position',
                                parent: 'home_btn_is_visible',
                                options: this.options,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'paste_btn_is_visible',
                                val_accessor: 'ui.paste_btn_is_visible',
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'allow_downloading_img_by_link',
                                val_accessor: 'ui.allow_downloading_img_by_link',
                                is_cut: true,
                                event_callback: d_sections.Val.i().change,
                            }),
                            new o_inputs.Btn({
                                name: 'custom_code',
                                event_callback: () =>
                                    d_custom_code.Visibility.i().change({ is_visible: true }),
                            }),
                        ],
                    }),
                ],
                ...d_settings.Sections.i().make_shared_sections({
                    download_back_up_callback: d_sections.Restore.i().download_back_up,
                    download_back_up_final_callback: () => undefined,
                    upload_back_up_callback: d_sections.Restore.i().restore_back_up,
                    restore_defaults_callback: () => d_sections.Restore.i().restore_confirm(),
                    input_change_val_callback: d_sections.Val.i().change,
                    restore_inputs: [
                        new o_inputs.Btn({
                            name: 'delete_all_backgrounds',
                            event_callback:
                                d_backgrounds.BackgroundDeletion.i().delete_all_backgrounds,
                        }),
                        new o_inputs.Btn({
                            name: 'delete_all_tasks',
                            event_callback: d_scheduler.TaskDeletion.i().delete_all_tasks_confirm,
                        }),
                        new o_inputs.Btn({
                            name: 'delete_custom_code',
                            event_callback: s_custom_code.Db.i().delete_custom_code,
                        }),
                    ],
                    admin_inputs: [
                        new o_inputs.Checkbox({
                            name: 'enable_video_repeat',
                            event_callback: d_sections.Val.i().change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'always_use_alarms_api_to_change_background_in_slideshow_mode',
                            event_callback: d_sections.Val.i().change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'show_item_developer_info_in_tooltip',
                            event_callback: d_sections.Val.i().change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'update_database_when_dnd_item',
                            event_callback: d_sections.Val.i().change,
                        }),
                    ],
                    include_back_up_help: true,
                    back_up_help_msg: ext.msg('back_up_help_text'),
                    download_backup: false,
                    allow_multiple_file_backup_upload: true,
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
                            ...(env.browser === 'firefox'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'empty_new_tab_page',
                                          href: ext.msg(
                                              `empty_new_tab_page_for_${env.browser}_link_href`,
                                          ),
                                      }),
                                  ]),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'theme_path',
                                          href: 'http://bit.ly/theme-path',
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
            this.sections.back_up.inputs = s_utils.Main.i().to_object({
                arr: this.sections.back_up.inputs as o_inputs.Section[],
            });
            this.sections.restore.inputs = s_utils.Main.i().to_object({
                arr: this.sections.restore.inputs as o_inputs.Section[],
            });
            this.sections.admin.inputs = s_utils.Main.i().to_object({
                arr: this.sections.admin.inputs as o_inputs.Section[],
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
        }, 'cnt_1269');
}
