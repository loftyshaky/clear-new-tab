import x from 'x';

const create_option_data_text_val = modifier => x.msg(`option_${modifier}_text`); //< create select text content

export const selects_options = {
    mode: [
        {
            label: create_option_data_text_val('theme'),
            value: 'theme',
        },
        {
            label: create_option_data_text_val('one'),
            value: 'one',
        },
        {
            label: create_option_data_text_val('multiple'),
            value: 'multiple',
        },
        {
            label: create_option_data_text_val('random_solid_color'),
            value: 'random_solid_color',
        },
    ],
    change_interval: [
        {
            label: create_option_data_text_val('1_millisecond'),
            value: '1',
        },
        {
            label: create_option_data_text_val('3_seconds'),
            value: '3000',
        },
        {
            label: create_option_data_text_val('5_seconds'),
            value: '5000',
        },
        {
            label: create_option_data_text_val('10_seconds'),
            value: '10000',
        },
        {
            label: create_option_data_text_val('15_seconds'),
            value: '15000',
        },
        {
            label: create_option_data_text_val('30_seconds'),
            value: '30000',
        },
        {
            label: create_option_data_text_val('1_minute'),
            value: '60000',
        },
        {
            label: create_option_data_text_val('5_minutes'),
            value: '300000',
        },
        {
            label: create_option_data_text_val('10_minutes'),
            value: '600000',
        },
        {
            label: create_option_data_text_val('15_minutes'),
            value: '900000',
        },
        {
            label: create_option_data_text_val('30_minutes'),
            value: '1800000',
        },
        {
            label: create_option_data_text_val('1_hour'),
            value: '3600000',
        },
        {
            label: create_option_data_text_val('3_hours'),
            value: '10800000',
        },
        {
            label: create_option_data_text_val('6_hours'),
            value: '21600000',
        },
        {
            label: create_option_data_text_val('12_hours'),
            value: '43200000',
        },
        {

            label: create_option_data_text_val('1_day'),
            value: '86400000',
        },
        {
            label: create_option_data_text_val('2_days'),
            value: '172800000',
        },
        {
            label: create_option_data_text_val('4_days'),
            value: '345600000',
        },
        {
            label: create_option_data_text_val('1_week'),
            value: '604800000',
        },
        {
            label: create_option_data_text_val('2_weeks'),
            value: '1209600000',
        },
        {
            label: create_option_data_text_val('4_weeks'),
            value: '2419200000',
        },
    ],
    settings_type: [
        {
            label: create_option_data_text_val('global'),
            value: 'global',
            is_settings_type_select: true,
        },
        {
            label: create_option_data_text_val('specific'),
            value: 'specific',
            is_settings_type_select: true,
        },
    ],
    size: [
        {
            label: create_option_data_text_val('global'),
            value: 'global',
            global: true,
        },
        {
            label: create_option_data_text_val('dont_resize'),
            value: 'dont_resize',
        },
        {
            label: create_option_data_text_val('fit_screen'),
            value: 'fit_screen',
        },
        {
            label: create_option_data_text_val('fit_browser'),
            value: 'fit_browser',
        },
        {
            label: create_option_data_text_val('cover_screen'),
            value: 'cover_screen',
        },
        {
            label: create_option_data_text_val('cover_browser'),
            value: 'cover_browser',
        },
        {
            label: create_option_data_text_val('stretch_screen'),
            value: 'stretch_screen',
        },
        {
            label: create_option_data_text_val('stretch_browser'),
            value: 'stretch_browser',
        },
    ],
    position: [
        {
            label: create_option_data_text_val('global'),
            value: 'global',
            global: true,
        },
        {
            label: create_option_data_text_val('center_top'),
            value: 'center top',
        },
        {
            label: create_option_data_text_val('center_center'),
            value: 'center center',
        },
        {
            label: create_option_data_text_val('center_bottom'),
            value: 'center bottom',
        },
        {
            label: create_option_data_text_val('left_top'),
            value: 'left top',
        },
        {
            label: create_option_data_text_val('left_center'),
            value: 'left center',
        },
        {
            label: create_option_data_text_val('left_bottom'),
            value: 'left bottom',
        },
        {
            label: create_option_data_text_val('right_top'),
            value: 'right top',
        },
        {
            label: create_option_data_text_val('right_center'),
            value: 'right center',
        },
        {
            label: create_option_data_text_val('right_bottom'),
            value: 'right bottom',
        },
    ],
    repeat: [
        {
            label: create_option_data_text_val('global'),
            value: 'global',
            global: true,
        },
        {
            label: create_option_data_text_val('repeat'),
            value: 'repeat',
        },
        {
            label: create_option_data_text_val('repeat_y'),
            value: 'repeat-y',
        },
        {
            label: create_option_data_text_val('repeat_x'),
            value: 'repeat-x',
        },
        {
            label: create_option_data_text_val('no_repeat'),
            value: 'no-repeat',
        },
    ],
};
