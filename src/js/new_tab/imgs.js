//> display image on new tab page load or when image changes t

//> get one image from background.js imgs object t

//> determine actual size value based size value from database t

//> set css background property t

//> calculate image dimensions t

//> calculate_img_dimensions_when_in_fit_or_cover_screen_mode f

//> resize image on window resize and expanding t

//> crossfade_imgs f

//> reload image when chanmging settings in options page t

//> reload_img_divs f

//> variables t

//^

'use strict';

import x from 'x';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

configure({ enforceActions: true });

//> display image on new tab page load or when image changes t
export const display_img = async () => {
    const mode = r.cond([
        [r.anyPass([r.equals('one'), r.equals('multiple'), r.equals('theme')]), r.always('img_or_color')],
        [r.equals('random_solid_color'), r.always('random_solid_color')],
    ])(ed.mode);

    get_img(mode);
};
//< display image on new tab page load or when image changes t

//> get one image from background.js imgs object t
const get_img = async mode => {
    if (mode == 'img_or_color') {
        try {
            const query_string = location.search;

            const img = await r.ifElse(
                () => query_string.indexOf('preview') == - 1,
                async () => await x.send_message_to_background_c({ message: 'get_img' }),

                async () => {
                    const img_id = query_string.split('preview_img_id=').pop();

                    return await x.send_message_to_background_c({ message: 'get_preview_img', img_id: img_id });
                }
            )();

            if (img) {
                const is_color_img = img.type == 'color';
                mut.img.img = img.img;

                if (!is_color_img) {
                    mut.size_db_val = img.size == 'global' ? ed.size : img.size;
                    mut.img.position = img.position == 'global' ? ed.position : img.position;
                    mut.img.repeat = img.repeat == 'global' ? ed.repeat : img.repeat;
                    mut.img.color = img.color == 'global' ? ed.color : img.color;

                    determine_size('img');

                } else if (is_color_img) {
                    determine_size('color');
                }
            }

        } catch (er) {
            console.error(er);
        }

    } else if (mode == 'random_solid_color') {
        determine_size('random_solid_color');
    }
};
//< get one image from background.js imgs object t

//> determine actual size value based size value from database t
const determine_size = async mode => {
    if (mode == 'img') {
        if (mut.size_db_val == 'dont_resize') {
            mut.img.size = 'auto auto';

        } else if (mut.size_db_val == 'fit_browser') {
            mut.img.size = 'contain';

        } else if (mut.size_db_val == 'cover_browser') {
            mut.img.size = 'cover';

        } else if (mut.size_db_val == 'stretch_browser') {
            mut.img.size = '100% 100%';

        } else if (mut.size_db_val == 'fit_screen' || mut.size_db_val == 'cover_screen' || mut.size_db_val == 'stretch_screen') {
            if (mut.size_db_val == 'stretch_screen') {
                calculate_dimensions();
            }

            if (mut.size_db_val == 'fit_screen' || mut.size_db_val == 'cover_screen') {
                try {
                    await new Promise((resolve, reject) => {
                        mut.img_to_load = new Image();

                        mut.img_to_load.onload = () => {
                            calculate_dimensions(mut.img_to_load);

                            resolve();
                        }

                        mut.img_to_load.onerror = () => {
                            reject();
                        }

                        mut.img_to_load.src = mut.img.img;
                    });

                } catch (er) {
                    console.error(er);
                }
            }
        }
    }

    set_img(mode);
};
//< determine actual size value based size value from database t

//> set css background property t
const set_img = action(async mode => {
    if (!mut.first_run) {
        const fade_in_first_img = mut.current_img_div_i == 1;
        const fade_in_second_img = mut.current_img_div_i == 0;

        if (fade_in_first_img) {
            mut.current_img_div_i = 0;

            crossfade_imgs(1, 0);

        } else if (fade_in_second_img) {
            mut.fade_in_first_img = true;

            mut.current_img_div_i = 1;

            crossfade_imgs(0, 1);
        }
    }

    if (mode == 'img') {
        ob.img_divs.background[mut.current_img_div_i] = 'url("' + mut.img.img + '") ' + mut.img.position + ' / ' + mut.img.size + ' ' + mut.img.repeat + ' ' + mut.img.color;

    } else if (mode == 'color') {
        ob.img_divs.background[mut.current_img_div_i] = mut.img.img;

    } else if (mode == 'random_solid_color') {
        ob.img_divs.background[mut.current_img_div_i] = ed.current_random_color;
    }

    mut.first_run = false;
});
//< set css background property t

//> calculate image dimensions t
const calculate_dimensions = img => {
    const browser_is_in_fullscreen_mode = window.innerWidth == con.screen_width;
    const window_size = {
        width: null,
        height: null
    };
    let dimensions;

    if (browser_is_in_fullscreen_mode) {
        if (mut.size_db_val == 'stretch_screen') {
            dimensions = {
                width: con.screen_width,
                height: con.screen_height
            }

        } else if (mut.size_db_val == 'fit_screen' || mut.size_db_val == 'cover_screen') {
            dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(img, con.screen_width, con.screen_height);
        }

        if (mut.size_db_val == 'cover_screen') {
            window_size.width = con.screen_width;
            window_size.height = con.screen_height;
        }

    } else { // if browser is in windowed mode
        if (mut.size_db_val == 'stretch_screen') {
            dimensions = {
                width: con.browser_window_width,
                height: con.browser_window_height
            }


        } else if (mut.size_db_val == 'fit_screen' || mut.size_db_val == 'cover_screen') {
            dimensions = calculate_img_dimensions_when_in_fit_or_cover_screen_mode(img, con.browser_window_width, con.browser_window_height);
        }

        if (mut.size_db_val == 'cover_screen') {
            window_size.width = con.browser_window_width;
            window_size.height = con.browser_window_height;
        }
    }

    if (mut.size_db_val == 'stretch_screen' || mut.size_db_val == 'fit_screen') {
        mut.img.size = dimensions.width + 'px ' + dimensions.height + 'px';

    } else if (mut.size_db_val == 'cover_screen') {
        if (dimensions.width == window_size.width) {
            mut.img.size = 'auto ' + window_size.height + 'px';

        } else if (dimensions.height == window_size.height) {
            mut.img.size = window_size.width + 'px auto';
        }
    }
};
//< calculate image dimensions t

//> calculate_img_dimensions_when_in_fit_or_cover_screen_mode f
const calculate_img_dimensions_when_in_fit_or_cover_screen_mode = (img, window_width, window_height) => {
    const img_width = img.width;
    const img_height = img.height;

    const aspect_ratio = Math.min(window_width / img_width, window_height / img_height); // calculate aspect ratio

    const width = Math.round(img_width * aspect_ratio)
    const height = Math.round(img_height * aspect_ratio);

    return {
        width: width,
        height: height
    }
};
//< calculate_img_dimensions_when_in_fit_or_cover_screen_mode f

//> resize image on window resize and expanding t
export const resize_img = action(() => {
    if (mut.size_db_val == 'fit_screen' || mut.size_db_val == 'cover_screen' || mut.size_db_val == 'stretch_screen') {
        con.browser_window_width = window.innerWidth;
        con.browser_window_height = window.outerHeight;

        calculate_dimensions(mut.img_to_load);

        ob.img_divs.background_size[mut.current_img_div_i] = mut.img.size;
    }
});
//< resize image on window resize and expanding t

//> crossfade_imgs f
const crossfade_imgs = action((i1, i2) => {
    ob.img_divs.no_tr_cls[i2] = true;
    ob.img_divs.no_tr_cls[i1] = false;

    ob.img_divs.z_index_minus_1_cls[i2] = true;
    ob.img_divs.z_index_minus_1_cls[i1] = false;

    ob.img_divs.opacity_0_cls[i1] = true;
    ob.img_divs.opacity_0_cls[i2] = false;
});
//< crossfade_imgs f

//> reload image when chanmging settings in options page t
export const reload_img = () => {
    reload_img_divs();
    display_img();
};
//< reload image when chanmging settings in options page t

//> reload_img_divs f
const reload_img_divs = action(() => {
    ob.img_divs = {
        keys: [x.unique_id(), x.unique_id()],
        no_tr_cls: [false, false],
        z_index_minus_1_cls: [false, true],
        opacity_0_cls: [false, false],
        background: [null, null],
        background_size: [null, null]
    }
});
//< reload_img_divs f

//> variables t
const con = {
    screen_width: screen.width,
    screen_height: screen.height,
    browser_window_width: window.innerWidth,
    browser_window_height: window.outerHeight
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
        color: null
    }
};

export const ob = observable({});
//< varibles t

reload_img_divs();