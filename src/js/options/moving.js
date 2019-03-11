import { observable, action, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as background_loading from 'options/background_loading';
import * as settings from 'options/settings';
import * as pagination from 'options/pagination';
import * as get_new_future_background from 'js/get_new_future_background';
import * as ui_state from 'options/ui_state';
import * as background_i from 'options/background_i';

configure({ enforceActions: 'observed' });

const dragged_item_position_modifiers = {
    options: {
        y: 7,
        x: 7,
    },
    new_tab: {
        y: 3,
        x: 0,
    },
};

export const start_drag = (background_w_tr, e) => {
    try {
        mut.mouse_is_down = true;
        mut.item_to_move = background_w_tr;
        mut.start_y = e.clientY;
        mut.start_x = e.clientX;

    } catch (er) {
        err(er, 123);
    }
};

export const prompt_to_move = async background_w_tr => {
    try {
        mut.item_to_move = background_w_tr;

        analytics.send_options_backgrounds_event('opened_enter_new_background_no_prompt');

        const new_position_i = window.prompt(x.msg('enter_new_background_no'));

        if (new_position_i) {
            analytics.send_prompts_accepted_event('enter_new_background_no');

        } else {
            analytics.send_prompts_canceled_event('enter_new_background_no');
        }

        const given_value_is_integer = Number.isInteger(+new_position_i);
        const number_of_backgrounds = await db.backgroundsd.count();

        if (new_position_i && given_value_is_integer && number_of_backgrounds > 1) {
            let new_position_i_final;

            if (new_position_i < 1) {
                new_position_i_final = 1;

            } else if (new_position_i > number_of_backgrounds) {
                new_position_i_final = number_of_backgrounds;

            } else {
                new_position_i_final = new_position_i;
            }

            move('prompt', new_position_i_final);

        } else if (new_position_i) {
            analytics.send_options_backgrounds_event('unable_to_move_by_prompt');
        }

    } catch (er) {
        err(er, 210);
    }
};

export const stop_drag = (mode, e) => {
    try {
        mut.mouse_is_down = false;

        const drop_area = s('.drop_area');
        const dropped_in_drop_area = e.target === drop_area;

        if (mode === 'options' && drop_area && !dropped_in_drop_area) {
            remove_drop_area();
        }

        if (ob.show_dragged_item) {
            mut.dragged_item.innerHTML = '';

            show_or_hide_dragged_item(false);
        }

    } catch (er) {
        err(er, 124);
    }
};

//> show dragged_item and insert dragged element into it / update dragged_item position
export const set_dragged_item_position = (mode, e) => {
    try {
        if (mut.mouse_is_down) {
            if (!ob.show_dragged_item) {
                const modifier = 10;
                const moved_10px_from_click_position_in_any_direction = e.clientY > mut.start_y + modifier || e.clientY < mut.start_y - modifier || e.clientX > mut.start_x + modifier || e.clientX < mut.start_x - modifier;

                if (moved_10px_from_click_position_in_any_direction) {
                    show_or_hide_dragged_item(true);

                    const item_to_move_clone = mut.item_to_move.cloneNode(true);

                    x.append(mut.dragged_item, item_to_move_clone);

                    mut.dragged_item_width = parseFloat(window.getComputedStyle(sb(mut.dragged_item, '.background_w')).width);

                    set_dragged_item_position(mode, e);
                }

            } else {
                mut.dragged_item.style.top = `${e.clientY + dragged_item_position_modifiers[mode].y}px`;
                mut.dragged_item.style.left = `${e.clientX - mut.dragged_item_width - dragged_item_position_modifiers[mode].x}px`;
            }
        }

    } catch (er) {
        err(er, 125);
    }
};
//< show dragged_item and insert dragged element into it / update dragged_item position

//> drop area
export const create_drop_area = (background_w_tr, mode, e) => {
    try {
        const not_hovering_over_drop_area = (mode === 'options' || mode === 'new_tab') && !x.matches(e.target, '.drop_area');

        if (not_hovering_over_drop_area && mut.mouse_is_down && ob.show_dragged_item) {
            const old_drop_area = s('.drop_area');

            if (old_drop_area) {
                remove_drop_area();
            }

            const new_drop_area = x.create('div', 'drop_area');

            let item_to_move;
            let hovered_item;
            let coords;
            let client_key;

            if (mode === 'options') {
                ({ item_to_move } = mut);
                hovered_item = background_w_tr;
                coords = mut.current_x;
                client_key = 'clientX';
            }

            const moved_mouse_right_or_up = coords < e[client_key];
            const moved_mouse_left_or_down = coords > e[client_key];
            const stayed_at_the_same_coords = coords === e[client_key]; // ex: if client_key is clientX and mouse moved up but not right or left this variable vill be true

            if (moved_mouse_right_or_up || stayed_at_the_same_coords) {
                const last_item = get_first_or_last_visible_item(mode);
                const penultimate_item = last_item.previousElementSibling;

                append_drop_area(mode, hovered_item, item_to_move, new_drop_area, last_item, penultimate_item, 'nextElementSibling', 'previousElementSibling', 'after', 'right', client_key, e);

            } else if (moved_mouse_left_or_down) {
                const first_item = get_first_or_last_visible_item(mode);
                const second_item = first_item.nextElementSibling;

                append_drop_area(mode, hovered_item, item_to_move, new_drop_area, first_item, second_item, 'previousElementSibling', 'nextElementSibling', 'before', 'left', client_key, e);
            }

            if (mode === 'options') {
                new_drop_area.style.width = `${mut.dragged_item_width - 4}px`;

                new_drop_area.addEventListener('mouseup', move.bind(null, 'drop'));
            }

            mut.current_x = e.clientX;
            mut.current_y = e.clientY;
        }

    } catch (er) {
        err(er, 126);
    }
};

const remove_drop_area = () => {
    try {
        x.remove(s('.drop_area'));

    } catch (er) {
        err(er, 127);
    }
};

const get_first_or_last_visible_item = (mode, hovered_tree) => {
    try {
        if (mode === 'options') {
            return s('.background_w_tr:first-child');

        } if (mode === 'new_tab' || mode === 'new_tab_bookmarks_bar') {
            return sb(hovered_tree, ':scope > .entries_w > .entry:first-child');
        }

    } catch (er) {
        err(er, 128);
    }

    return undefined;
};

const append_drop_area = (mode, hovered_item, item_to_move, drop_area, first_item, second_item, traverse_1, traverse_2, append_f) => {
    try {
        if (item_to_move[traverse_1] || item_to_move[traverse_2] || (mode === 'new_tab' || mode === 'new_tab_bookmarks_bar')) {
            let el_to_append_before_or_after;

            if ((hovered_item !== first_item && hovered_item !== second_item) || (item_to_move !== first_item && item_to_move !== second_item)) {
                if (hovered_item[traverse_1] !== item_to_move && hovered_item !== item_to_move) {
                    el_to_append_before_or_after = hovered_item;

                } else if (hovered_item === item_to_move) {
                    el_to_append_before_or_after = hovered_item[traverse_1];

                } else if (hovered_item[traverse_1] === item_to_move) {
                    el_to_append_before_or_after = hovered_item[traverse_1][traverse_1];
                }

            } else if (!item_to_move[traverse_1]) {
                if (!hovered_item[traverse_1] && hovered_item[traverse_2] && hovered_item[traverse_2][traverse_2]) {
                    el_to_append_before_or_after = hovered_item[traverse_2][traverse_2];

                } else if (hovered_item[traverse_1] && !hovered_item[traverse_1][traverse_1] && hovered_item[traverse_2]) {
                    el_to_append_before_or_after = hovered_item[traverse_2];
                }

            } else if (!item_to_move[traverse_1][traverse_1]) {
                if (hovered_item === item_to_move) {
                    el_to_append_before_or_after = hovered_item[traverse_1];

                } else if (!hovered_item[traverse_1]) {
                    el_to_append_before_or_after = hovered_item;
                }
            }

            if (el_to_append_before_or_after) {
                x[append_f](el_to_append_before_or_after, drop_area);
            }
        }

    } catch (er) {
        err(er, 129);
    }
};
//< drop area

const show_or_hide_dragged_item = action(bool => {
    try {
        ob.show_dragged_item = bool;

    } catch (er) {
        err(er, 130);
    }
});

const move = async (mode, new_position_no) => {
    try {
        ui_state.disable_ui();

        const background_i_modificator = background_i.determine_background_i_modificator();
        let background_i_after_move = new_position_no - 1 - background_i_modificator;
        let el_to_move_background_before_or_after;

        if (mode === 'drop') {
            analytics.send_options_backgrounds_event('moved_by_dragging_and_dropping');

            el_to_move_background_before_or_after = s('.drop_area');

        } else if (mode === 'prompt') {
            analytics.send_options_backgrounds_event('moved_by_prompt');

            if (new_position_no <= background_i_modificator || new_position_no > background_i_modificator + populate_storage_with_images_and_display_them.con.backgrounds_per_page) {
                el_to_move_background_before_or_after = 'background_is_out_of_page';

            } else {
                el_to_move_background_before_or_after = s(`.background_w_tr:nth-child(${new_position_no - background_i_modificator})`);
            }
        }

        if (el_to_move_background_before_or_after !== mut.item_to_move) {
            const background_i_before_move = background_i.get_background_i_by_el(mut.item_to_move);

            if (mode === 'drop' || (mode === 'prompt' && el_to_move_background_before_or_after !== 'background_is_out_of_page' && background_i_before_move < background_i_after_move)) {
                x.after(el_to_move_background_before_or_after, mut.item_to_move);

            } if (mode === 'prompt' && el_to_move_background_before_or_after !== 'background_is_out_of_page' && background_i_before_move > background_i_after_move) {
                x.before(el_to_move_background_before_or_after, mut.item_to_move);
            }

            const all_backgrounds_background_i_before_move = background_i_before_move + background_i_modificator;
            let all_backgrounds_background_i_after_move;

            if (mode === 'drop') {
                background_i_after_move = background_i.get_background_i_by_el(mut.item_to_move);
                all_backgrounds_background_i_after_move = background_i_after_move + background_i_modificator;

            } else if (mode === 'prompt') {
                all_backgrounds_background_i_after_move = new_position_no - 1;
            }

            x.remove(s('.drop_area'));

            let move_type;
            let start_i;
            let end_i;

            if (all_backgrounds_background_i_before_move < all_backgrounds_background_i_after_move) {
                move_type = 'forward';
                start_i = all_backgrounds_background_i_before_move + 1;
                end_i = all_backgrounds_background_i_after_move;

            } else if (all_backgrounds_background_i_before_move > all_backgrounds_background_i_after_move) {
                move_type = 'backward';
                start_i = all_backgrounds_background_i_before_move - 1;
                end_i = all_backgrounds_background_i_after_move;
            }

            const response = await x.send_message_to_background_c({ message: 'get_ids_of_backgrounds_to_shift', move_type, all_backgrounds_background_i_before_move, start_i, end_i });

            await db.transaction('rw', db.ed, db.backgroundsd, async () => {
                const modifier_1 = move_type === 'forward' ? -1 : 1; // if forwsard - 1 if backward 1
                const modifier_2 = move_type === 'forward' ? 1 : -1; // if forwsard 1 if backward - 1

                const backgrounds_to_move = await Promise.all(response.ids_of_backgrounds_to_move.map(async id => {
                    const background = await db.backgroundsd.get(id);

                    return background;
                }));

                await Promise.all(backgrounds_to_move.map(async background => {
                    await db.backgroundsd.update(background.id, { position_id: background.position_id + modifier_1 });
                }));

                const background = await db.backgroundsd.get(response.ids_of_backgrounds_to_move[response.ids_of_backgrounds_to_move.length - 1]);

                await db.backgroundsd.update(response.background_id_before_move, { position_id: background.position_id + modifier_2 });

                await set_new_current_or_future_background_value_after_move('current_background', move_type, all_backgrounds_background_i_before_move, all_backgrounds_background_i_after_move);
                await set_new_current_or_future_background_value_after_move('future_background', move_type, all_backgrounds_background_i_before_move, all_backgrounds_background_i_after_move);

                const current_background = await ed('current_background');

                await get_new_future_background.get_new_future_background(current_background + 1);
            });

            const current_background = await ed('current_background');

            settings.change_current_background_input_val(current_background + 1);

            await x.send_message_to_background_c({ message: 'retrieve_backgrounds' });

            if (el_to_move_background_before_or_after !== 'background_is_out_of_page') {
                move_backgrounds_arr_item(background_i_before_move, background_i_after_move);

            } else {
                background_loading.load_page('load_page', pagination.ob.active_page, true);
            }
        }

        ui_state.enable_ui();

    } catch (er) {
        err(er, 131);

        ui_state.enable_ui();
    }
};

const set_new_current_or_future_background_value_after_move = async (type, move_type, background_i_before_move, background_i_after_move) => { // type: current_background, future_background
    try {
        const ed_all = await eda();

        if (type === 'current_background' || ed_all.shuffle) {
            if (ed_all[type] === background_i_before_move) {
                ed_all[type] = background_i_after_move;

            } else if (move_type === 'forward' && ed_all[type] <= background_i_after_move && ed_all[type] >= background_i_before_move) {
                ed_all[type] -= ed_all[type];

            } else if (move_type === 'backward' && ed_all[type] >= background_i_after_move && ed_all[type] <= background_i_before_move) {
                ed_all[type] += ed_all[type];
            }

        } else {
            ed_all[type] = ed_all.current_background + 1;
        }

        await db.ed.update(1, { [type]: ed_all[type] });

    } catch (er) {
        err(er, 132);
    }
};

const move_backgrounds_arr_item = action((from, to) => {
    try {
        x.move_a_item(populate_storage_with_images_and_display_them.ob.backgrounds, from, to);

    } catch (er) {
        err(er, 133);
    }
});

export const mut = {
    item_to_move: null,
    dragged_item: null,
    dragged_item_width: null,
    start_y: null,
    start_x: null,
    current_y: null,
    current_x: null,
    mouse_is_down: false,
};

export const ob = observable({
    show_dragged_item: false,
});
