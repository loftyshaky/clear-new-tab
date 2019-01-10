import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as tabs from 'background/tabs';
import * as shared_b_o from 'js/shared_b_o';

//> start_timer f
export const start_timer = async () => {
    if (!mut.starting_timer) {
        mut.starting_timer = true;
        const ext_data_not_loaded_yet = !ed;
        const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

        if (ext_data_not_loaded_yet) {
            await x.get_ed();
        }

        clear_timer();

        if (at_least_one_new_tab_tab_opened) {
            if (ed.mode === 'multiple' || ed.mode === 'random_solid_color') {
                const ms_left = shared_b.get_ms_left();

                start_timer_inner(ms_left);
            }
        }
    }
};
//< start_timer f

//> start_timer_inner f
const start_timer_inner = async delay => {
    mut.timer = setTimeout(async () => {
        const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

        await get_next_img();

        mut.starting_timer = false;

        mut.number_of_inner_timers_running++;

        mut.timer_innner = setTimeout(async () => {
            mut.number_of_inner_timers_running--;

            if (mut.number_of_inner_timers_running === 0 && ed.slideshow && at_least_one_new_tab_tab_opened && (ed.mode === 'multiple' || ed.mode === 'random_solid_color')) {
                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_img' }]);

                start_timer_inner(ed.change_interval);
            }
        }, ed.change_interval !== 1 ? 0 : 3000);
    }, delay);
};
//< start_timer_inner f

//> clear_timer f
export const clear_timer = () => {
    clearTimeout(mut.timer);
    clearTimeout(mut.timer_innner);

    mut.starting_timer = false;
    mut.number_of_inner_timers_running = 0;
};
//< clear_timer f

//> decide what image to show next t
const get_next_img = async () => {
    try {
        if (ed.mode === 'multiple') {
            const new_current_img = ed.future_img;
            const new_future_img = new_current_img + 1;

            await db.ed.update(1, { current_img: new_current_img });
            await shared_b_o.get_new_future_img(new_future_img);
            await x.get_ed();

            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_img_input_val' }]);

            shared_b.preload_current_and_future_img('new_current_img');

        } else if (ed.mode === 'random_solid_color') {
            await db.ed.update(1, { current_random_color: shared_b_o.generate_random_color() });
        }

    } catch (er) {
        console.error(er);
    }
};
//< decide what image to show next t

//> variables t
const mut = {
    timer: null,
    starting_timer: false,
    number_of_inner_timers_running: 0,
};
//< varibles t
