'use_strict';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

import * as file_types from 'js/file_types';

import x from 'x';

configure({ enforceActions: 'observed' });

//> display image on new tab page load or when image changes
export const display_img = async force_current_img => {
    try {
        const ed_all = await eda();

        const mode = r.cond([
            [r.anyPass([r.equals('one'), r.equals('multiple'), r.equals('theme')]), r.always('img_or_color')],
            [r.equals('random_solid_color'), r.always('random_solid_color')],
        ])(ed_all.mode);

        get_img(mode, ed_all, force_current_img);

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

            const img = await r.ifElse(
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

            if (img) {
                const is_color_img = file_types.con.types[img.type] === 'colors';
                mut.img.img = img.img;

                if (!is_color_img) {
                    mut.size_db_val = img.size === 'global' ? ed_all.size : img.size;
                    mut.img.position = img.position === 'global' ? ed_all.position : img.position;
                    mut.img.repeat = img.repeat === 'global' ? ed_all.repeat : img.repeat;
                    mut.img.color = img.color === 'global' ? ed_all.color : img.color;

                    determine_size('img');

                } else if (is_color_img) {
                    determine_size('color');
                }
            }

        } else if (mode === 'random_solid_color') {
            mut.random_solid_color = r.clone(ed_all.current_random_color);

            determine_size('random_solid_color');
        }
    } catch (er) {
        err(er, 58);
    }
};
//< get one image from background.js imgs object

//> determine actual size value based size value from database
const determine_size = async mode => {
    try {
        if (mode === 'img') {
            if (mut.size_db_val === 'dont_resize') {
                mut.img.size = 'auto auto';

            } else if (mut.size_db_val === 'fit_browser') {
                mut.img.size = 'contain';

            } else if (mut.size_db_val === 'cover_browser') {
                mut.img.size = 'cover';

            } else if (mut.size_db_val === 'stretch_browser') {
                mut.img.size = '100% 100%';

            } else if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen' || mut.size_db_val === 'stretch_screen') {
                if (mut.size_db_val === 'stretch_screen') {
                    calculate_dimensions();
                }

                if (mut.size_db_val === 'fit_screen' || mut.size_db_val === 'cover_screen') {
                    await new Promise((resolve, reject) => {
                        mut.img_to_load = new Image();

                        mut.img_to_load.onload = () => {
                            calculate_dimensions(mut.img_to_load);

                            resolve();
                        };

                        mut.img_to_load.onerror = () => {
                            reject(er_obj('Failed to load image.'));
                        };

                        mut.img_to_load.src = mut.img.img;
                    });
                }
            }
        }

        set_img(mode);

    } catch (er) {
        err(er, 60);
    }
};
//< determine actual size value based size value from database

//> set css background property
const set_img = action(async mode => {
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

        if (mode === 'img') {
            ob.img_divs.background[mut.current_img_div_i] = `url("${mut.img.img}") ${mut.img.position} / ${mut.img.size} ${mut.img.repeat} ${mut.img.color}`;

        } else if (mode === 'color') {
            ob.img_divs.background[mut.current_img_div_i] = mut.img.img;

        } else if (mode === 'random_solid_color') {
            ob.img_divs.background[mut.current_img_div_i] = mut.random_solid_color;
        }

        mut.first_run = false;

    } catch (er) {
        err(er, 61);
    }
});
//< set css background property

//> calculate image dimensions
const calculate_dimensions = img => {
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
                dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(img, con.screen_width, con.screen_height);
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
                dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(img, con.browser_window_width, con.browser_window_height);
            }

            if (mut.size_db_val === 'cover_screen') {
                window_size.width = con.browser_window_width;
                window_size.height = con.browser_window_height;
            }
        }

        if (mut.size_db_val === 'stretch_screen' || mut.size_db_val === 'fit_screen') {
            mut.img.size = `${dimensions.width}px ${dimensions.height}px`;

        } else if (mut.size_db_val === 'cover_screen') {
            if (dimensions.width === window_size.width) {
                mut.img.size = `auto ${window_size.height}px`;

            } else if (dimensions.height === window_size.height) {
                mut.img.size = `${window_size.width}px auto`;
            }
        }

    } catch (er) {
        err(er, 62);
    }
};
//< calculate image dimensions

const calculate_img_dimensions_when_in_fit_or_cover_screen_mode = (img, window_width, window_height) => {
    try {
        const img_width = img.width;
        const img_height = img.height;

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

            calculate_dimensions(mut.img_to_load);

            ob.img_divs.background_size[mut.current_img_div_i] = mut.img.size;
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
        no_tr_cls: [false, false],
        z_index_minus_1_cls: [false, true],
        opacity_0_cls: [false, false],
        background: [null, null],
        background_size: [null, null],
    };
});

const con = {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    browser_window_width: window.innerWidth,
    browser_window_height: window.outerHeight,
};

const mut = {
    first_run: true,
    current_img_div_i: 0,
    size_db_val: null,
    img_to_load: null,
    img: {
        size: null,
        img: null,
        position: null,
        repeat: null,
        color: null,
    },
};

export const ob = observable({});

reload_img_divs();
