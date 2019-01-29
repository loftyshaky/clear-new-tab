import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as tabs from 'background/tabs';
import * as shared_b_o from 'js/shared_b_o';

export const start_timer = x.debounce(async update_last_img_change_time => {
    const ed_all = await eda();

    if (!ed_all.img_already_changed && (ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color')) {
        const ms_left = await get_ms_left();

        start_timer_inner(ms_left, update_last_img_change_time); // eslint-disable-line eqeqeq

    } else {
        await db.ed.update(1, { img_already_changed: false });

        await update_last_img_change_time_f();

        await start_timer_inner(ed_all.change_interval, update_last_img_change_time); // eslint-disable-line eqeqeq
    }
}, 50);

const start_timer_inner = async (ms_left, update_last_img_change_time) => {
    clear_timer();

    mut.timers.push(setTimeout(async () => {
        await get_next_img();

        if (update_last_img_change_time) {
            update_last_img_change_time_f();
        }

        const ed_all = await eda();

        if (ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') {
            mut.timers.push(setTimeout(async () => {
                if (ed_all.slideshow) {
                    x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_img' }]);
                }

                const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;
                const no_new_tab_tabs_opened = tabs.mut.new_tabs_ids.length === 0;

                if (at_least_one_new_tab_tab_opened) {
                    start_timer_inner(ed_all.change_interval, true);

                } else if (no_new_tab_tabs_opened) {

                    await db.ed.update(1, { img_already_changed: true });
                }
            }, ed_all.change_interval == 1 ? 3000 : 0)); // eslint-disable-line eqeqeq
        }

    }, ms_left)); // eslint-disable-line eqeqeq
};

export const clear_timer = () => {
    mut.timers.forEach(timer => {
        clearTimeout(timer);

        mut.timers = r.without([timer], mut.timers);
    });
};

//> decide what image to show next
export const get_next_img = async () => {
    try {
        if (!mut.get_next_img_f_is_running) {
            mut.get_next_img_f_is_running = true;
            const ed_all = await eda();

            if (ed_all.mode === 'multiple') {
                const new_current_img = ed_all.future_img;
                const new_future_img = new_current_img + 1;

                await db.ed.update(1, { current_img: new_current_img });
                await shared_b_o.get_new_future_img(new_future_img);

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_img_input_val' }]);

                shared_b.preload_current_and_future_img('new_current_img');

            } else if (ed_all.mode === 'random_solid_color') {
                await db.ed.update(1, { current_random_color: shared_b_o.generate_random_color() });
            }
        }

        mut.get_next_img_f_is_running = false;

    } catch (er) {
        console.error(er);
    }
};
//< decide what image to show next

export const update_last_img_change_time_f = async () => {
    const time = new Date().getTime();

    await db.ed.update(1, { last_img_change_time: time });
};

//> get number of ms left till change interval elpse (may be negative)
export const get_ms_left = async () => {
    const ed_all = await eda();
    const time = new Date().getTime();
    const ms_left = ed_all.change_interval - (time - ed_all.last_img_change_time);

    return ms_left;
};
//< get number of ms left till change interval elpse (may be negative)


const mut = {
    timers: [],
    get_next_img_f_is_running: false,
};
