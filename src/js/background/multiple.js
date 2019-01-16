import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as tabs from 'background/tabs';
import * as shared_b_o from 'js/shared_b_o';
import * as shared_b_n from 'js/shared_b_n';

export const start_timer = async force_timer => {
    const one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length === 1;
    const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

    if (one_new_tab_tab_opened || !mut.timer_runned_once || (force_timer && at_least_one_new_tab_tab_opened)) {
        clear_timer();

        const mode = await ed123('mode');
        mut.timer_runned_once = true;
        if (mode === 'multiple' || mode === 'random_solid_color') {
            const ms_left = shared_b_n.get_ms_left();

            start_timer_inner(force_timer ? await ed123('change_interval') : ms_left); // eslint-disable-line eqeqeq
        }
    }
};

const start_timer_inner = async ms_left => {
    const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

    mut.timer = setTimeout(async () => {
        await get_next_img();
        const mode = await ed123('mode');

        clear_timer();

        if (await ed123('slideshow') && at_least_one_new_tab_tab_opened && (mode === 'multiple' || mode === 'random_solid_color')) {
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_img' }]);

            start_timer_inner(await ed123('change_interval'));
        }

    }, await ed123('change_interval') == 1 ? 3000 : ms_left); // eslint-disable-line eqeqeq
};

export const clear_timer = () => {

    clearTimeout(mut.timer);
};

//> decide what image to show next
export const get_next_img = async () => {
    try {
        if (!mut.get_next_img_f_is_running) {
            mut.get_next_img_f_is_running = true;
            const mode = await ed123('mode');

            if (mode === 'multiple') {
                const new_current_img = await ed123('future_img');
                const new_future_img = new_current_img + 1;

                await db.ed.update(1, { current_img: new_current_img });
                await shared_b_o.get_new_future_img(new_future_img);
                await x.get_ed();

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_img_input_val' }]);

                shared_b.preload_current_and_future_img('new_current_img');

            } else if (mode === 'random_solid_color') {
                await db.ed.update(1, { current_random_color: shared_b_o.generate_random_color() });
                await x.get_ed();
            }
        }

        mut.get_next_img_f_is_running = false;

    } catch (er) {
        console.error(er);
    }
};
//< decide what image to show next

export const update_time_setting_and_start_timer = async force_timer => {
    const ms_left = shared_b_n.get_ms_left();

    if (ms_left <= 0) {
        const time = new Date().getTime();

        await db.ed.update(1, { last_img_change_time: time });
        await x.get_ed();
    }

    start_timer(force_timer);
};

const mut = {
    timer_runned_once: false,
    timer: null,
    number_of_inner_timers_running: 0,
    get_next_img_f_is_running: false,
};
