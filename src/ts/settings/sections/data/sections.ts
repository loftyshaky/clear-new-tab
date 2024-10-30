import { d_offers, s_utils } from '@loftyshaky/shared/shared';
import { o_inputs, o_color, i_inputs } from '@loftyshaky/shared/inputs';
import { d_sections as d_sections_loftyshaky } from '@loftyshaky/shared/settings';
import { svg } from 'shared/internal';
import {
    d_backgrounds,
    d_sections,
    d_custom_code,
    s_optional_permissions,
    d_scheduler,
    s_custom_code,
    s_theme,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    public sections: o_inputs.Section[] | i_inputs.Sections = [];

    public init = (): void =>
        err(() => {
            this.sections = [
                ...[
                    new o_inputs.Section({
                        name: 'background_upload',
                        inputs: [
                            new o_inputs.LinkBtn({
                                name: 'link_to_theme_img',
                                event_callback: s_theme.LinkToImage.open,
                            }),
                            new o_inputs.Btn({
                                name: 'load_theme_background',
                                event_callback: (): void => {
                                    ext.send_msg({
                                        msg: 'get_theme_background',
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
                                event_callback: d_backgrounds.Upload.upload_with_browse_btn,
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
                                            d_sections.TextBtns
                                                .decide_paste_background_btn_visibility,
                                        event_callback: d_backgrounds.Upload.upload_with_paste_btn,
                                    },
                                ],
                                event_callback: d_sections.Val.change,
                                paste_callback: d_backgrounds.Upload.upload_with_paste_input,
                                warn_state_checker: d_sections.Validation.validate_input,
                            }),
                            new o_inputs.Checkbox({
                                name: 'download_img_when_link_given',
                                is_cut: true,
                                event_callback: d_sections.Val.change,
                            }),
                            new o_color.Color({
                                name: 'create_solid_color_background',
                                include_remove_color_btn: false,
                                include_ok_btn: true,
                                val_accessor: 'ui.create_solid_color_background',
                                event_callback: d_sections.Val.change,
                                select_palette_color_callback:
                                    d_sections.Val.save_selected_palette_color,
                                hide_color_help_callback: d_sections.Visibility.hide_color_help,
                                remove_color_callback: d_sections.Val.remove_color_callback,
                                restore_default_palette_callback:
                                    d_sections.Val.restore_default_palette_callback,
                            }),
                        ],
                    }),
                    ...(d_offers.Offers.found_offers_for_current_locale()
                        ? [
                              new o_inputs.Section({
                                  name: 'offers',
                                  include_offers: true,
                                  offer_banner_type: 'vertical',
                                  inputs: [],
                              }),
                          ]
                        : []),
                    new o_inputs.Section({
                        name: 'background_settings',
                        inputs: [
                            new o_inputs.Select({
                                name: 'mode',
                                options: d_sections.Options.options,
                                include_help: true,
                                alt_help_msg: ext.msg(`mode_${env.browser}_help_text`),
                                event_callback: d_sections.Val.change,
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
                                    d_scheduler.Visibility.change({
                                        is_visible: true,
                                    });
                                },
                            }),
                            new o_inputs.Select({
                                name: 'color_type',
                                options: d_sections.Options.options,
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['random_solid_color'] },
                                ],
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'keep_old_theme_backgrounds',
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['theme_background'] },
                                ],
                                event_callback: d_sections.Val.change,
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
                                            d_sections.TextBtns
                                                .decide_set_background_as_current_btn_visibility,
                                        event_callback:
                                            d_backgrounds.CurrentBackground
                                                .set_selected_background_as_current,
                                    },
                                ],
                                event_callback: d_sections.Val.change,
                                warn_state_checker: d_sections.Validation.validate_input,
                            }),
                            new o_inputs.Checkbox({
                                name: 'automatically_set_last_uploaded_background_as_current',
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['one_background', 'multiple_backgrounds'],
                                    },
                                ],
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_interval',
                                options: d_sections.Options.options,
                                is_visible_conds: [
                                    {
                                        input_name: 'mode',
                                        pass_vals: ['multiple_backgrounds', 'random_solid_color'],
                                    },
                                ],
                                event_callback: d_sections.Val.change,
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
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'background_change_effect',
                                options: d_sections.Options.options,
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
                                event_callback: d_sections.Val.change,
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
                                options: d_sections.Options.options,
                                parent: 'slideshow',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'shuffle_backgrounds',
                                is_visible_conds: [
                                    { input_name: 'mode', pass_vals: ['multiple_backgrounds'] },
                                ],
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Hr({
                                name: 'hr_1',
                            }),
                            new o_inputs.Select({
                                name: 'settings_context',
                                options: d_sections.Options.options,
                                include_help: true,
                                val_accessor: 'ui.settings_context',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'background_size',
                                options: d_sections.Options.options,
                                include_help: true,
                                val_accessor: 'ui.background_size',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'background_position',
                                options: d_sections.Options.options,
                                include_help: true,
                                val_accessor: 'ui.background_position',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'background_repeat',
                                options: d_sections.Options.options,
                                include_help: true,
                                val_accessor: 'ui.background_repeat',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Group({
                                name: 'color_of_area_around_background_group',
                                include_help: true,
                                event_callback: () => undefined,
                                inputs: [
                                    new o_color.Color({
                                        name: 'color_of_area_around_background',
                                        val_accessor: 'ui.color_of_area_around_background',
                                        event_callback: d_sections.Val.change,
                                        select_palette_color_callback:
                                            d_sections.Val.save_selected_palette_color,
                                        hide_color_help_callback:
                                            d_sections.Visibility.hide_color_help,
                                        remove_color_callback: d_sections.Val.remove_color_callback,
                                        restore_default_palette_callback:
                                            d_sections.Val.restore_default_palette_callback,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'color_of_area_around_background_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.color_of_area_around_background_global',
                                        event_callback: d_sections.Val.change,
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
                                        event_callback: d_sections.Val.change,
                                        warn_state_checker: d_sections.Validation.validate_input,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'video_speed_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.video_speed_global',
                                        event_callback: d_sections.Val.change,
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
                                        event_callback: d_sections.Val.change,
                                    }),
                                    new o_inputs.Checkbox({
                                        name: 'video_volume_global',
                                        alt_msg: ext.msg('global_option_text'),
                                        val_accessor: 'ui.video_volume_global',
                                        event_callback: d_sections.Val.change,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new o_inputs.Section({
                        name: 'other_settings',
                        inputs: [
                            d_sections_loftyshaky.Sections.get_shared_input({
                                input_change_val_callback: d_sections.Val.change,
                            }).options_page_theme,
                            new o_inputs.Checkbox({
                                name: 'home_btn_is_visible',
                                include_help: true,
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Select({
                                name: 'home_btn_position',
                                parent: 'home_btn_is_visible',
                                options: d_sections.Options.options,
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'paste_btn_is_visible',
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Checkbox({
                                name: 'allow_downloading_img_by_link',
                                val_accessor: 'ui.allow_downloading_img_by_link',
                                is_cut: true,
                                event_callback: d_sections.Val.change,
                            }),
                            new o_inputs.Btn({
                                name: 'custom_code',
                                event_callback: () =>
                                    d_custom_code.Visibility.change({ is_visible: true }),
                            }),
                        ],
                    }),
                ],
                new o_inputs.Section({
                    name: 'permissions',
                    inputs: [
                        new o_inputs.Checkbox({
                            name: 'clipboard_read_permission',
                            alt_msg: ext.msg(`clipboard_read_permission_${env.browser}_label_text`),
                            event_callback:
                                s_optional_permissions.Permissions.change_clipboard_read_permission,
                        }),
                    ],
                }),
                ...d_sections_loftyshaky.Sections.make_shared_sections({
                    download_back_up_callback: d_sections.Restore.download_back_up,
                    download_back_up_final_callback: () => undefined,
                    upload_back_up_callback: d_sections.Restore.restore_back_up,
                    restore_defaults_callback: () => d_sections.Restore.restore_confirm(),
                    input_change_val_callback: d_sections.Val.change,
                    back_up_inputs: [
                        new o_inputs.Text({
                            name: 'one_backup_file_size_in_bytes',
                            text_type: 'number',
                            allow_removing_val: false,
                            include_help: true,
                            event_callback: d_sections.Val.change,
                            warn_state_checker: d_sections.Validation.validate_input,
                        }),
                    ],
                    restore_inputs: [
                        new o_inputs.Btn({
                            name: 'delete_all_backgrounds',
                            event_callback: d_backgrounds.BackgroundDeletion.delete_all_backgrounds,
                        }),
                        new o_inputs.Btn({
                            name: 'delete_all_tasks',
                            event_callback: d_scheduler.TaskDeletion.delete_all_tasks_confirm,
                        }),
                        new o_inputs.Btn({
                            name: 'delete_custom_code',
                            event_callback: s_custom_code.Db.delete_custom_code,
                        }),
                    ],
                    admin_inputs: [
                        new o_inputs.Text({
                            name: 'backgrounds_per_page',
                            text_type: 'number',
                            allow_removing_val: false,
                            event_callback: d_sections.Val.change,
                            warn_state_checker: d_sections.Validation.validate_input,
                        }),
                        new o_inputs.Checkbox({
                            name: 'enable_video_repeat',
                            event_callback: d_sections.Val.change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'always_use_alarms_api_to_change_background_in_slideshow_mode',
                            event_callback: d_sections.Val.change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'show_item_developer_info_in_tooltip',
                            event_callback: d_sections.Val.change,
                        }),
                        new o_inputs.Checkbox({
                            name: 'update_database_when_dnd_item',
                            event_callback: d_sections.Val.change,
                        }),
                    ],
                    include_back_up_help: true,
                    restore_help_msg: ext.msg('restore_help_text'),
                    download_backup: false,
                    allow_multiple_file_backup_upload: true,
                    admin_content_is_hideable: true,
                    admin_change_visibility_of_content_save_callback:
                        d_sections.Val.admin_change_visibility_of_content_save_callback,
                }),
                ...[
                    new o_inputs.Section({
                        name: 'links',
                        inputs: [
                            new o_inputs.Link({
                                name: 'privacy_policy',
                                href: ext.msg('privacy_policy_link_href'),
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
                                          name: 'clear_new_tabi1i',
                                          browser: 'chrome',
                                      }),
                                      new o_inputs.Link({
                                          name: 'clear_new_tabi2i',
                                          browser: 'edge',
                                      }),
                                      new o_inputs.Link({
                                          name: 'clear_new_tabi3i',
                                          browser: 'firefox',
                                      }),
                                  ]),
                            new o_inputs.Link({
                                name: 'github',
                            }),
                            ...(env.browser === 'firefox'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'empty_new_tab_page',
                                          href: ext.msg(
                                              `offer_empty_new_tab_page_${env.browser}_link_href`,
                                          ),
                                      }),
                                  ]),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'theme_path',
                                          href: ext.msg('theme_path_link_href'),
                                      }),
                                  ]),
                            new o_inputs.Link({
                                name: 'facebook_page',
                                href: ext.msg('facebook_page_link_href'),
                            }),
                            new o_inputs.Link({
                                name: 'support_page',
                                href: ext.msg('support_page_link_href'),
                            }),
                            ...(env.browser === 'edge'
                                ? []
                                : [
                                      new o_inputs.Link({
                                          name: 'dependencies',
                                          href: ext.msg('dependencies_link_href'),
                                      }),
                                  ]),
                        ],
                    }),
                ],
            ];

            this.sections = s_utils.Utils.to_object({
                arr: this.sections as o_inputs.Section[],
            });
            this.sections.restore.inputs = s_utils.Utils.to_object({
                arr: this.sections.restore.inputs as o_inputs.Section[],
            });
            this.sections.admin.inputs = s_utils.Utils.to_object({
                arr: this.sections.admin.inputs as o_inputs.Section[],
            });
            this.sections.background_upload.inputs = s_utils.Utils.to_object({
                arr: this.sections.background_upload.inputs as o_inputs.Section[],
                section: 'background_upload',
            });
            this.sections.background_settings.inputs = s_utils.Utils.to_object({
                arr: this.sections.background_settings.inputs as o_inputs.Section[],
                section: 'background_settings',
            });
            this.sections.links.inputs = s_utils.Utils.to_object({
                arr: this.sections.links.inputs as o_inputs.Section[],
                section: 'links',
            });
        }, 'cnt_1269');
}

export const Sections = Class.get_instance();
