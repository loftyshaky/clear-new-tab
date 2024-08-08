import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public options: i_inputs.Options = {};

    public init = (): void =>
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
                    new o_inputs.Option({ name: 'no_effect' }),
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
}

export const Options = Class.get_instance();
