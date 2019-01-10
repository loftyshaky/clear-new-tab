//> create select text content t

//^

import x from 'x';

//> create select text content t
const create_option_data_text_val = modifier => x.message(`option_${modifier}_text`);
//< create select text content t

export const selects_options = {
    mode: [
        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('theme'),
            storage: 'mode',
            val: 'theme',
        },
        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('one'),
            storage: 'mode',
            val: 'one',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('multiple'),
            storage: 'mode',
            val: 'multiple',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('random_solid_color'),
            storage: 'mode',
            val: 'random_solid_color',
        },
    ],

    change_interval: [
        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('1_millisecond'),
            storage: 'change_interval',
            val: '1',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('3_seconds'),
            storage: 'change_interval',
            val: '3000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('5_seconds'),
            storage: 'change_interval',
            val: '5000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('10_seconds'),
            storage: 'change_interval',
            val: '10000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('15_seconds'),
            storage: 'change_interval',
            val: '15000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('30_seconds'),
            storage: 'change_interval',
            val: '30000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('1_minute'),
            storage: 'change_interval',
            val: '60000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('5_minutes'),
            storage: 'change_interval',
            val: '300000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('10_minutes'),
            storage: 'change_interval',
            val: '600000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('15_minutes'),
            storage: 'change_interval',
            val: '900000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('30_minutes'),
            storage: 'change_interval',
            val: '1800000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('1_hour'),
            storage: 'change_interval',
            val: '3600000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('3_hours'),
            storage: 'change_interval',
            val: '10800000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('6_hours'),
            storage: 'change_interval',
            val: '21600000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('12_hours'),
            storage: 'change_interval',
            val: '43200000',
        },

        {
            key: x.unique_id(),

            global: false,
            text: create_option_data_text_val('1_day'),
            storage: 'change_interval',
            val: '86400000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('2_days'),
            storage: 'change_interval',
            val: '172800000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('4_days'),
            storage: 'change_interval',
            val: '345600000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('1_week'),
            storage: 'change_interval',
            val: '604800000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('2_weeks'),
            storage: 'change_interval',
            val: '1209600000',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('4_weeks'),
            storage: 'change_interval',
            val: '2419200000',
        },
    ],

    settings_type: [
        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('global'),
            storage: 'settings_type',
            val: 'global',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('specific'),
            storage: 'settings_type',
            val: 'specific',
        },
    ],

    size: [
        {
            key: x.unique_id(),
            global: true,
            text: create_option_data_text_val('global'),
            storage: 'size',
            val: 'global',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('dont_resize'),
            storage: 'size',
            val: 'dont_resize',
        },


        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('fit_screen'),
            storage: 'size',
            val: 'fit_screen',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('fit_browser'),
            storage: 'size',
            val: 'fit_browser',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('cover_screen'),
            storage: 'size',
            val: 'cover_screen',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('cover_browser'),
            storage: 'size',
            val: 'cover_browser',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('stretch_screen'),
            storage: 'size',
            val: 'stretch_screen',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('stretch_browser'),
            storage: 'size',
            val: 'stretch_browser',
        },
    ],

    position: [
        {
            key: x.unique_id(),
            global: true,
            text: create_option_data_text_val('global'),
            storage: 'position',
            val: 'global',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('center_top'),
            storage: 'position',
            val: 'center top',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('center_center'),
            storage: 'position',
            val: 'center center',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('center_bottom'),
            storage: 'position',
            val: 'center bottom',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('left_top'),
            storage: 'position',
            val: 'left top',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('left_center'),
            storage: 'position',
            val: 'left center',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('left_bottom'),
            storage: 'position',
            val: 'left bottom',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('right_top'),
            storage: 'position',
            val: 'right top',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('right_center'),
            storage: 'position',
            val: 'right center',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('right_bottom'),
            storage: 'position',
            val: 'right bottom',
        },
    ],

    repeat: [
        {
            key: x.unique_id(),
            global: true,
            text: create_option_data_text_val('global'),
            storage: 'repeat',
            val: 'global',

        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('repeat'),
            storage: 'repeat',
            val: 'repeat',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('repeat_y'),
            storage: 'repeat',
            val: 'repeat-y',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('repeat_x'),
            storage: 'repeat',
            val: 'repeat-x',
        },

        {
            key: x.unique_id(),
            global: false,
            text: create_option_data_text_val('no_repeat'),
            storage: 'repeat',
            val: 'no-repeat',
        },
    ],
};
