'use_strict';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

import { db } from 'js/init_db';
import * as file_types from 'js/file_types';
import * as get_ms_left from 'js/get_ms_left';
import * as last_img_change_time from 'js/last_img_change_time';
import * as generate_random_color from 'js/generate_random_color';

import x from 'x';

configure({ enforceActions: 'observed' });

//> display image on new tab page load or when image changes
export const display_img = async force_current_img => {
    try {
        if (!mut.prevent_next_img_change) {
            const ed_all = await eda();

            const mode = r.cond([
                [r.anyPass([r.equals('one'), r.equals('multiple'), r.equals('theme')]), r.always('img_or_color')],
                [r.equals('random_solid_color'), r.always('random_solid_color')],
            ])(ed_all.mode);

            get_img(mode, ed_all, force_current_img);

        } else {
            mut.prevent_next_img_change = false;
        }
    } catch (er) {
        err(er, 57);
    }
};
//< display image on new tab page load or when image changes

//> get one image from background.js imgs object
const get_img = async (mode, ed_all) => {
    try {
        if (mode === 'img_or_color') { // not random solid color
            const query_string = window.location.search;

            mut.loaded_img = await r.ifElse(
                () => query_string.indexOf('preview') === -1,
                async () => x.send_message_to_background_c({ message: 'get_img' }),

                async () => {
                    try {
                        const img_id = query_string.split('preview_img_id=').pop();

                        return x.send_message_to_background_c({ message: 'get_preview_img', img_id });

                    } catch (er) {
                        err(er, 59);
                    }

                    return undefined;
                },
            )();

            if (mut.loaded_img) {
                const is_color_img = file_types.con.types[mut.loaded_img.type] === 'colors';
                mut.img.img = mut.loaded_img.img;

                if (!is_color_img) {
                    mut.size_db_val = mut.loaded_img.size === 'global' ? ed_all.size : mut.loaded_img.size;
                    mut.img.position = mut.loaded_img.position === 'global' ? ed_all.position : mut.loaded_img.position;
                    mut.img.repeat = mut.loaded_img.repeat === 'global' ? ed_all.repeat : mut.loaded_img.repeat;
                    mut.img.color = mut.loaded_img.color === 'global' ? ed_all.color : mut.loaded_img.color;
                    mut.img.video_volume = mut.loaded_img.video_volume === 'global' ? ed_all.video_volume : mut.loaded_img.video_volume;

                    mut.mode = file_types.con.types[mut.loaded_img.type] === 'img_files' || file_types.con.types[mut.loaded_img.type] === 'links' ? 'img' : 'video';

                    determine_size();

                } else if (is_color_img) {
                    mut.mode = 'color';

                    determine_size('color');
                }
            }

        } else if (mode === 'random_solid_color') {
            const ms_left = await get_ms_left.get_ms_left();

            if (ms_left < 0 && ed_all.change_interval != 1 && !ed_all.img_already_changed) { // eslint-disable-line eqeqeq
                mut.prevent_next_img_change = true;
                mut.random_solid_color = generate_random_color.generate_random_color();

                await db.ed.update(1, { current_random_color: mut.random_solid_color });
                last_img_change_time.update_last_img_change_time();

            } else {
                mut.random_solid_color = r.clone(ed_all.current_random_color);
            }

            mut.mode = 'random_solid_color';

            determine_size('random_solid_color');
        }
    } catch (er) {
        err(er, 58);
    }
};
//< get one image from background.js imgs object

//> determine actual size value based size value from database
const determine_size = async () => {
    try {
        if (mut.mode === 'img' || mut.mode === 'video') {
            if (mut.size_db_val === 'dont_resize' || mut.size_db_val === 'fit_browser' || mut.size_db_val === 'cover_browser' || mut.size_db_val === 'stretch_browser') {
                mut.img.video_width = '100%';
                mut.img.video_height = '100%';
            }

            if (mut.size_db_val === 'dont_resize') {
                mut.img.size = mut.mode === 'img' ? 'auto auto' : 'none';

            } else if (mut.size_db_val === 'fit_browser') {
                mut.img.size = 'contain';

            } else if (mut.size_db_val === 'cover_browser') {
                mut.img.size = 'cover';

            } else if (mut.size_db_val === 'stretch_browser') {
                mut.img.size = mut.mode === 'img' ? '100% 100%' : 'fill';

            } else if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen' || mut.size_db_val === 'stretch_screen') {
                calculate_dimensions();
            }
        }

        set_img();

    } catch (er) {
        err(er, 60);
    }
};
//< determine actual size value based size value from database

//> set css background property
const set_img = action(async () => {
    try {
        if (!mut.first_run) {
            const fade_in_first_img = mut.current_img_div_i === 1;
            const fade_in_second_img = mut.current_img_div_i === 0;

            if (fade_in_first_img) {
                mut.current_img_div_i = 0;

                crossfade_imgs(1, 0);

            } else if (fade_in_second_img) {
                mut.fade_in_first_img = true;

                mut.current_img_div_i = 1;

                crossfade_imgs(0, 1);
            }
        }

        ob.img_divs.is_video[mut.current_img_div_i] = false;

        if (mut.mode === 'img') {
            ob.img_divs.background[mut.current_img_div_i] = `url("${mut.img.img}") ${mut.img.position} / ${mut.img.size} ${mut.img.repeat} ${mut.img.color}`;

        } else if (mut.mode === 'video') {
            ob.img_divs.is_video[mut.current_img_div_i] = true;
            ob.img_divs.background[mut.current_img_div_i] = mut.img.img;
            ob.img_divs.video_background_color[mut.current_img_div_i] = mut.img.color;
            ob.img_divs.video_background_position[mut.current_img_div_i] = mut.img.position;
            ob.img_divs.video_background_position_class[mut.current_img_div_i] = positions_dict[mut.img.position];
            ob.img_divs.background_size[mut.current_img_div_i] = mut.img.size;
            ob.img_divs.video_width[mut.current_img_div_i] = mut.img.video_width;
            ob.img_divs.video_height[mut.current_img_div_i] = mut.img.video_height;
            ob.img_divs.video_volume[mut.current_img_div_i] = mut.img.video_volume;

        } else if (mut.mode === 'color') {
            ob.img_divs.background[mut.current_img_div_i] = mut.img.img;

        } else if (mut.mode === 'random_solid_color') {
            ob.img_divs.background[mut.current_img_div_i] = mut.random_solid_color;
        }

        mut.first_run = false;

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
                dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(con.screen_width, con.screen_height);
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
                dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(con.browser_window_width, con.browser_window_height);
            }

            if (mut.size_db_val === 'cover_screen') {
                window_size.width = con.browser_window_width;
                window_size.height = con.browser_window_height;
            }
        }

        if (mut.size_db_val === 'stretch_screen' || mut.size_db_val === 'fit_screen') {
            if (mut.mode === 'img') {
                mut.img.size = `${dimensions.width}px ${dimensions.height}px`;

            } else if (mut.mode === 'video') {
                mut.img.video_width = dimensions.width;
                mut.img.video_height = dimensions.height;
            }

        } else if (mut.size_db_val === 'cover_screen') {
            if (dimensions.width === window_size.width) {
                if (mut.mode === 'img') {
                    mut.img.size = `auto ${window_size.height}px`;

                } else if (mut.mode === 'video') {
                    mut.img.video_width = 'auto';
                    mut.img.video_height = window_size.height;
                }

            } else if (dimensions.height === window_size.height) {
                if (mut.mode === 'img') {
                    mut.img.size = `${window_size.width}px auto`;

                } else if (mut.mode === 'video') {
                    mut.img.video_width = window_size.width;
                    mut.img.video_height = 'auto';
                }
            }
        }

        if (mut.mode === 'video') {
            mut.img.size = 'unset';
        }

    } catch (er) {
        err(er, 62);
    }
};
//< calculate image dimensions

const calculate_img_dimensions_when_in_fit_or_cover_screen_mode = (window_width, window_height) => {
    try {
        const img_width = mut.loaded_img.width;
        const img_height = mut.loaded_img.height;

        const aspect_ratio = Math.min(window_width / img_width, window_height / img_height); // calculate aspect ratio

        const width = Math.round(img_width * aspect_ratio);
        const height = Math.round(img_height * aspect_ratio);

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
export const resize_img = action(() => {
    try {
        if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen' || mut.size_db_val === 'stretch_screen') {
            con.browser_window_width = window.innerWidth;
            con.browser_window_height = window.outerHeight;

            calculate_dimensions();

            ob.img_divs.background_size[mut.current_img_div_i] = mut.img.size;
            ob.img_divs.video_width[mut.current_img_div_i] = mut.img.video_width;
            ob.img_divs.video_height[mut.current_img_div_i] = mut.img.video_height;
        }

    } catch (er) {
        err(er, 64);
    }
});
//< resize image on window resize and expanding

const crossfade_imgs = action((i1, i2) => {
    try {
        ob.img_divs.no_tr_cls[i2] = true;
        ob.img_divs.no_tr_cls[i1] = false;

        ob.img_divs.z_index_minus_1_cls[i2] = true;
        ob.img_divs.z_index_minus_1_cls[i1] = false;

        ob.img_divs.opacity_0_cls[i1] = true;
        ob.img_divs.opacity_0_cls[i2] = false;

    } catch (er) {
        err(er, 65);
    }
});

//> reload image when chanmging settings in options page
export const reload_img = () => {
    try {
        reload_img_divs();
        display_img();

    } catch (er) {
        err(er, 66);
    }
};
//< reload image when chanmging settings in options page

const reload_img_divs = action(() => {
    ob.img_divs = {
        keys: [x.unique_id(), x.unique_id()],
        is_video: [false, false],
        no_tr_cls: [false, false],
        z_index_minus_1_cls: [false, true],
        opacity_0_cls: [false, false],
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

const positions_dict = {
    '50% 0%': 'top',
    '50% 50%': 'center',
    '50% 100%': 'bottom',
    '0% 0%': 'left_top',
    '0% 50%': 'left_center',
    '0% 100%': 'left_bottom',
    '100% 0%': 'right_top',
    '100% 50%': 'right_center',
    '100% 100%': 'right_bottom',
};

const con = {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    browser_window_width: window.innerWidth,
    browser_window_height: window.outerHeight,
};

export const mut = {
    first_run: true,
    current_img_div_i: 0,
    size_db_val: null,
    mode: null,
    loaded_img: null,
    prevent_next_img_change: false,
    img: {
        size: null,
        img: null,
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

reload_img_divs();
