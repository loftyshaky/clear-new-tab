import { observable, action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as file_types from 'js/file_types';
import * as get_ms_left from 'js/get_ms_left';
import * as last_background_change_time from 'js/last_background_change_time';
import * as generate_random_color from 'js/generate_random_color';
import * as keep_sending_message_before_response from 'js/keep_sending_message_before_response';

import x from 'x';

configure({ enforceActions: 'observed' });

//> display image on new tab page load or when image changes
export const display_background = async (reload_background_even_if_it_didnt_change, transition_background_change, slideshow_change) => {
    try {
        if (slideshow_change) {
            analytics.send_new_tab_backgrounds_event('slideshow_change');
        }

        const ed_all = await eda();

        const mode = r.cond([
            [r.anyPass([r.equals('one'), r.equals('multiple'), r.equals('theme')]), r.always('img_video_or_color')],
            [r.equals('random_solid_color'), r.always('random_solid_color')],
        ])(ed_all.mode);

        get_background(mode, ed_all, reload_background_even_if_it_didnt_change, transition_background_change, slideshow_change);

    } catch (er) {
        err(er, 57);
    }
};
//< display image on new tab page load or when image changes

//> get one image from background.js backgrounds object
const get_background = async (mode, ed_all, reload_background_even_if_it_didnt_change, transition_background_change) => {
    try {
        if (mode === 'img_video_or_color') { // not random solid color
            const query_string = window.location.search;

            if (mode === 'random_solid_color') {
                mut.previous_background = {
                    id: mut.random_solid_color,
                };

            } else {
                mut.previous_background = mut.loaded_background;
            }

            mut.loaded_background = await r.ifElse(
                () => query_string.indexOf('preview') === -1,
                async () => keep_sending_message_before_response.keep_sending_message_before_response('get_background'),

                async () => {
                    try {
                        const background_id = query_string.split('preview_background_id=').pop();

                        return x.send_message_to_background_c({ message: 'get_preview_background', background_id });

                    } catch (er) {
                        err(er, 59);
                    }

                    return undefined;
                },
            )();

            const no_images_uploaded = !mut.loaded_background;

            if (no_images_uploaded) {
                mut.loaded_background = {
                    id: 'no_images_color',
                    background: '#ffffff',
                    type: 'color',
                };
            }

            if (mut.loaded_background) {
                const is_color_background = file_types.con.types[mut.loaded_background.type] === 'colors';
                mut.background.background = mut.loaded_background.background;

                if (!is_color_background) {
                    mut.size_db_val = mut.loaded_background.size === 'global' ? ed_all.size : mut.loaded_background.size;
                    mut.background.position = mut.loaded_background.position === 'global' ? ed_all.position : mut.loaded_background.position;
                    mut.background.repeat = mut.loaded_background.repeat === 'global' ? ed_all.repeat : mut.loaded_background.repeat;
                    mut.background.color = mut.loaded_background.color === 'global' ? ed_all.color : mut.loaded_background.color;
                    mut.background.video_volume = mut.loaded_background.video_volume === 'global' ? ed_all.video_volume : mut.loaded_background.video_volume;

                    mut.mode = file_types.con.types[mut.loaded_background.type] === 'img_files' || file_types.con.types[mut.loaded_background.type] === 'links' ? 'img' : 'video';

                } else if (is_color_background) {
                    mut.mode = 'color';
                }
            }

        } else if (mode === 'random_solid_color') {
            const ms_left = await get_ms_left.get_ms_left();

            if (ms_left < 0 && ed_all.change_interval != 1 && !ed_all.background_already_changed) { // eslint-disable-line eqeqeq
                mut.random_solid_color = generate_random_color.generate_random_color();

                await db.ed.update(1, { current_random_color: mut.random_solid_color });

                last_background_change_time.update_last_background_change_time();

            } else {
                mut.random_solid_color = r.clone(ed_all.current_random_color);
            }

            mut.mode = 'random_solid_color';
        }

        determine_size(reload_background_even_if_it_didnt_change, transition_background_change);

    } catch (er) {
        err(er, 58);
    }
};
//< get one image from background.js backgrounds object

//> determine actual size value based size value from database
const determine_size = async (reload_background_even_if_it_didnt_change, transition_background_change) => {
    try {
        if (mut.mode === 'img' || mut.mode === 'video') {
            if (mut.size_db_val === 'dont_resize' || mut.size_db_val === 'fit_browser' || mut.size_db_val === 'cover_browser' || mut.size_db_val === 'stretch_browser') {
                mut.background.video_width = '100%';
                mut.background.video_height = '100%';
            }

            if (mut.size_db_val === 'dont_resize') {
                mut.background.size = mut.mode === 'img' ? 'auto auto' : 'none';

            } else if (mut.size_db_val === 'fit_browser') {
                mut.background.size = 'contain';

            } else if (mut.size_db_val === 'cover_browser') {
                mut.background.size = 'cover';

            } else if (mut.size_db_val === 'stretch_browser') {
                mut.background.size = mut.mode === 'img' ? '100% 100%' : 'fill';

            } else if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen' || mut.size_db_val === 'stretch_screen') {
                calculate_dimensions();
            }
        }

        set_background(reload_background_even_if_it_didnt_change, transition_background_change);

    } catch (er) {
        err(er, 60);
    }
};
//< determine actual size value based size value from database

//> set css background property
const set_background = action(async (reload_background_even_if_it_didnt_change, transition_background_change) => {
    try {
        const current_background = mut.mode === 'random_solid_color' ? { id: mut.random_solid_color } : mut.loaded_background;
        const reloading_same_background = current_background && mut.previous_background && current_background.id === mut.previous_background.id;

        if (!reloading_same_background || reload_background_even_if_it_didnt_change) {
            if (!mut.first_run) {
                const fade_in_first_background = mut.current_background_div_i === 1;
                const fade_in_second_background = mut.current_background_div_i === 0;

                if (fade_in_first_background) {
                    mut.current_background_div_i = 0;

                    transition_backgrounds(1, 0, transition_background_change);

                } else if (fade_in_second_background) {
                    mut.fade_in_first_background = true;

                    mut.current_background_div_i = 1;

                    transition_backgrounds(0, 1, transition_background_change);
                }
            }

            ob.background_divs.is_video[mut.current_background_div_i] = false;

            if (mut.mode === 'img') {
                ob.background_divs.background[mut.current_background_div_i] = `url("${mut.background.background}") ${mut.background.position} / ${mut.background.size} ${mut.background.repeat} ${mut.background.color}`;

            } else if (mut.mode === 'video') {
                ob.background_divs.is_video[mut.current_background_div_i] = true;
                ob.background_divs.background[mut.current_background_div_i] = mut.background.background;
                ob.background_divs.video_background_color[mut.current_background_div_i] = mut.background.color;
                ob.background_divs.video_background_position[mut.current_background_div_i] = mut.background.position;
                ob.background_divs.video_background_position_class[mut.current_background_div_i] = con.positions_dict[mut.background.position];
                ob.background_divs.background_size[mut.current_background_div_i] = mut.background.size;
                ob.background_divs.video_width[mut.current_background_div_i] = mut.background.video_width;
                ob.background_divs.video_height[mut.current_background_div_i] = mut.background.video_height;
                ob.background_divs.video_volume[mut.current_background_div_i] = mut.background.video_volume;

            } else if (mut.mode === 'color') {
                ob.background_divs.background[mut.current_background_div_i] = mut.background.background;

            } else if (mut.mode === 'random_solid_color') {
                ob.background_divs.background[mut.current_background_div_i] = mut.random_solid_color;
            }

            analytics.send_new_tab_backgrounds_event(`showed_${mut.mode}`);

            mut.first_run = false;
        }

    } catch (er) {
        err(er, 61);
    }
});
//< set css background property

//> calculate image dimensions
const calculate_dimensions = () => {
    try {
        const browser_is_in_fullscreen_mode = window.innerWidth === con.screen_width;
        const window_size = {
            width: null,
            height: null,
        };
        let dimensions;

        if (browser_is_in_fullscreen_mode) {
            if (mut.size_db_val === 'stretch_screen') {
                dimensions = {
                    width: con.screen_width,
                    height: con.screen_height,
                };

            } else if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen') {
                dimensions = calculate_background_dimensions_when_in_fit_or_cover_screen_mode(con.screen_width, con.screen_height);
            }

            if (mut.size_db_val === 'cover_screen') {
                window_size.width = con.screen_width;
                window_size.height = con.screen_height;
            }

        } else { // if browser is in windowed mode
            if (mut.size_db_val === 'stretch_screen') {
                dimensions = {
                    width: con.browser_window_width,
                    height: con.browser_window_height,
                };


            } else if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen') {
                dimensions = calculate_background_dimensions_when_in_fit_or_cover_screen_mode(con.browser_window_width, con.browser_window_height);
            }

            if (mut.size_db_val === 'cover_screen') {
                window_size.width = con.browser_window_width;
                window_size.height = con.browser_window_height;
            }
        }

        if (mut.size_db_val === 'stretch_screen' || mut.size_db_val === 'fit_screen') {
            if (mut.mode === 'img') {
                mut.background.size = `${dimensions.width}px ${dimensions.height}px`;

            } else if (mut.mode === 'video') {
                mut.background.video_width = dimensions.width;
                mut.background.video_height = dimensions.height;
            }

        } else if (mut.size_db_val === 'cover_screen') {
            if (dimensions.width === window_size.width) {
                if (mut.mode === 'img') {
                    mut.background.size = `auto ${window_size.height}px`;

                } else if (mut.mode === 'video') {
                    mut.background.video_width = 'auto';
                    mut.background.video_height = window_size.height;
                }

            } else if (dimensions.height === window_size.height) {
                if (mut.mode === 'img') {
                    mut.background.size = `${window_size.width}px auto`;

                } else if (mut.mode === 'video') {
                    mut.background.video_width = window_size.width;
                    mut.background.video_height = 'auto';
                }
            }
        }

        if (mut.mode === 'video') {
            mut.background.size = 'unset';
        }

    } catch (er) {
        err(er, 62);
    }
};
//< calculate image dimensions

const calculate_background_dimensions_when_in_fit_or_cover_screen_mode = (window_width, window_height) => {
    try {
        const background_width = mut.loaded_background.width;
        const background_height = mut.loaded_background.height;

        const aspect_ratio = Math.min(window_width / background_width, window_height / background_height); // calculate aspect ratio

        const width = Math.round(background_width * aspect_ratio);
        const height = Math.round(background_height * aspect_ratio);

        return {
            width,
            height,
        };

    } catch (er) {
        err(er, 63);
    }

    return undefined;
};

//> resize image on window resize and expanding
export const resize_background = action(() => {
    try {
        if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen' || mut.size_db_val === 'stretch_screen') {
            con.browser_window_width = window.innerWidth;
            con.browser_window_height = window.outerHeight;

            calculate_dimensions();

            ob.background_divs.background_size[mut.current_background_div_i] = mut.background.size;
            ob.background_divs.video_width[mut.current_background_div_i] = mut.background.video_width;
            ob.background_divs.video_height[mut.current_background_div_i] = mut.background.video_height;
        }

    } catch (er) {
        err(er, 64);
    }
});
//< resize image on window resize and expanding

const transition_backgrounds = async (i1, i2, transition_background_change) => {
    try {
        const ed_all = await eda();

        runInAction(async () => {
            try {
                ob.background_divs.mute_video[i1] = true;
                ob.background_divs.mute_video[i2] = false;

                if (ed_all.background_change_effect === 'crossfade') {
                    ob.background_divs.no_tr_cls[i2] = true;
                    ob.background_divs.no_tr_cls[i1] = false;

                    ob.background_divs.slide_cls[i1] = null;
                    ob.background_divs.slide_cls[i2] = null;

                    ob.background_divs.z_index_minus_1_cls[i2] = true;
                    ob.background_divs.z_index_minus_1_cls[i1] = false;

                    ob.background_divs.opacity_0_cls[i1] = true;
                    ob.background_divs.opacity_0_cls[i2] = false;

                } else if (ed_all.background_change_effect === 'slide') {
                    const slide_direction = ed_all.slide_direction === 'random' ? con.slide_directions[con.slide_directions.length * Math.random() << 0] : ed_all.slide_direction; // eslint-disable-line no-bitwise

                    ob.background_divs.no_tr_cls[i2] = true;
                    ob.background_divs.no_tr_cls[i1] = true;

                    ob.background_divs.opacity_0_cls[i1] = false;
                    ob.background_divs.opacity_0_cls[i2] = false;

                    ob.background_divs.z_index_minus_1_cls[i1] = true;
                    ob.background_divs.z_index_minus_1_cls[i2] = false;


                    if (transition_background_change) {
                        ob.background_divs.slide_cls[i2] = `${slide_direction}_100`;
                        ob.background_divs.slide_cls[i1] = null;

                        ob.background_divs.no_tr_cls[i2] = false;

                        await x.delay(50);


                        runInAction(async () => {
                            try {
                                ob.background_divs.slide_cls[i2] = `${slide_direction}_0`;

                            } catch (er) {
                                err(er, 238);
                            }
                        });
                    }
                }

            } catch (er) {
                err(er, 237);
            }
        });

    } catch (er) {
        err(er, 65);
    }
};

//> reload image when chanmging settings in options page
export const reload_background = () => {
    try {
        reload_background_divs();
        display_background(true, false, false);

    } catch (er) {
        err(er, 66);
    }
};
//< reload image when chanmging settings in options page

const reload_background_divs = action(() => {
    ob.background_divs = {
        keys: [x.unique_id(), x.unique_id()],
        is_video: [false, false],
        mute_video: [false, false],
        no_tr_cls: [false, false],
        z_index_minus_1_cls: [false, true],
        opacity_0_cls: [false, false],
        slide_cls: [null, null],
        background: [null, null],
        background_size: [null, null],
        video_background_position: [null, null],
        video_background_position_class: [null, null],
        video_width: [null, null],
        video_height: [null, null],
        video_background_color: [null, null],
        video_volume: [null, null],
    };
});

const con = {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    browser_window_width: window.innerWidth,
    browser_window_height: window.outerHeight,
    positions_dict: {
        '50% 0%': 'top',
        '50% 50%': 'center',
        '50% 100%': 'bottom',
        '0% 0%': 'left_top',
        '0% 50%': 'left_center',
        '0% 100%': 'left_bottom',
        '100% 0%': 'right_top',
        '100% 50%': 'right_center',
        '100% 100%': 'right_bottom',
    },
    slide_directions: ['from_right_to_left', 'from_left_to_right', 'from_top_to_bottom', 'from_bottom_to_top'],
};

export const mut = {
    first_run: true,
    current_background_div_i: 0,
    size_db_val: null,
    mode: null,
    loaded_background: {
        id: 'loaded_background',
    },
    previous_background: {
        id: 'previous_background',
    },
    random_solid_color: 'random_solid_color',
    background: {
        size: null,
        background: null,
        position: null,
        repeat: null,
        color: null,
        video_width: null,
        video_height: null,
        video_background_color: null,
        video_volume: null,
    },
};

export const ob = observable({});

reload_background_divs(false);
