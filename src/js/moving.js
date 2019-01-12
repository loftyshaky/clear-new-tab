import { observable, action, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_o from 'options/shared_o';
import * as shared_b_o from 'js/shared_b_o';

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

export const start_drag = (img_w_tr, e) => {
    mut.mouse_is_down = true;
    mut.item_to_move = img_w_tr;
    mut.start_y = e.clientY;
    mut.start_x = e.clientX;
};

export const stop_drag = (mode, e) => {
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
};

//> show dragged_item and insert dragged element into it / update dragged_item position
export const set_dragged_item_position = (mode, e) => {
    if (mut.mouse_is_down) {
        if (!ob.show_dragged_item) {
            const modifier = 10;
            const moved_10px_from_click_position_in_any_direction = e.clientY > mut.start_y + modifier || e.clientY < mut.start_y - modifier || e.clientX > mut.start_x + modifier || e.clientX < mut.start_x - modifier;

            if (moved_10px_from_click_position_in_any_direction) {
                show_or_hide_dragged_item(true);

                const item_to_move_clone = mut.item_to_move.cloneNode(true);

                x.append(mut.dragged_item, item_to_move_clone);

                mut.dragged_item_width = parseFloat(window.getComputedStyle(sb(mut.dragged_item, '.img_w')).width);

                set_dragged_item_position(mode, e);
            }

        } else {
            mut.dragged_item.style.top = `${e.clientY + dragged_item_position_modifiers[mode].y}px`;
            mut.dragged_item.style.left = `${e.clientX - mut.dragged_item_width - dragged_item_position_modifiers[mode].x}px`;
        }
    }
};
//< show dragged_item and insert dragged element into it / update dragged_item position

//> drop area
export const create_drop_area = (img_w_tr, mode, e) => {
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
            hovered_item = img_w_tr;
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

            new_drop_area.addEventListener('mouseup', drop_options);
        }

        mut.current_x = e.clientX;
        mut.current_y = e.clientY;
    }
};

const remove_drop_area = () => {
    x.remove(s('.drop_area'));
};

const get_first_or_last_visible_item = (mode, hovered_tree) => {
    if (mode === 'options') {
        return s('.img_w_tr:first-child');

    } if (mode === 'new_tab' || mode === 'new_tab_bookmarks_bar') {
        return sb(hovered_tree, ':scope > .entries_w > .entry:first-child');
    }

    return undefined;
};

const append_drop_area = (mode, hovered_item, item_to_move, drop_area, first_item, second_item, traverse_1, traverse_2, append_f) => {
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
};
//< drop area

const show_or_hide_dragged_item = action(bool => {
    ob.show_dragged_item = bool;
});

//> options
const drop_options = async () => {
    try {
        shared_o.disable_ui();

        const drop_area = s('.drop_area');

        const img_i_before_drop = shared_o.get_img_i_by_el(mut.item_to_move);

        x.after(drop_area, mut.item_to_move);

        const img_i_after_drop = shared_o.get_img_i_by_el(mut.item_to_move);

        x.remove(drop_area);

        let move_type;
        let start_i;
        let end_i;

        if (img_i_before_drop < img_i_after_drop) {
            move_type = 'forward';
            start_i = img_i_before_drop + 1;
            end_i = img_i_after_drop;

        } else if (img_i_before_drop > img_i_after_drop) {
            move_type = 'backward';
            start_i = img_i_before_drop - 1;
            end_i = img_i_after_drop;
        }

        const response = await x.send_message_to_background_c({ message: 'get_ids_of_imgs_to_shift', move_type, img_i_before_drop, start_i, end_i });

        await db.transaction('rw', db.ed, db.imgs, async () => {
            const modifier_1 = move_type === 'forward' ? -1 : 1; // if forwsard - 1 if backward 1
            const modifier_2 = move_type === 'forward' ? 1 : -1; // if forwsard 1 if backward - 1

            // eslint-disable-next-line no-restricted-syntax
            for (const id of response.ids_of_imgs_to_move) { // forEach will not work here (position_id will not update)
                const img = await db.imgs.get(id);

                await db.imgs.update(id, { position_id: img.position_id + modifier_1 });
            }

            const img = await db.imgs.get(response.ids_of_imgs_to_move[response.ids_of_imgs_to_move.length - 1]);

            await db.imgs.update(response.img_id_before_drop, { position_id: img.position_id + modifier_2 });

            await set_new_current_or_future_img_value_after_drop('current_img', move_type, img_i_before_drop, img_i_after_drop);
            await set_new_current_or_future_img_value_after_drop('future_img', move_type, img_i_before_drop, img_i_after_drop);

            await shared_b_o.get_new_future_img(ed.current_img + 1);
        });

        shared_o.change_current_img_input_val(ed.current_img + 1);

        x.get_ed();
        await x.send_message_to_background_c({ message: 'reload_ed' });
        await x.send_message_to_background_c({ message: 'retrieve_imgs' });

        move_imgs_arr_item(img_i_before_drop, img_i_after_drop);

        shared_o.enable_ui();

    } catch (er) {
        console.error(er);

        shared_o.enable_ui();
    }
};

const set_new_current_or_future_img_value_after_drop = async (type, move_type, img_i_before_drop, img_i_after_drop) => { // type: current_img, future_img
    if (type === 'current_img' || ed.shuffle) {
        if (ed[type] === img_i_before_drop) {
            ed[type] = img_i_after_drop;

        } else if (move_type === 'forward' && ed[type] <= img_i_after_drop && ed[type] >= img_i_before_drop) {
            ed[type] -= ed[type];

        } else if (move_type === 'backward' && ed[type] >= img_i_after_drop && ed[type] <= img_i_before_drop) {
            ed[type] += ed[type];
        }

    } else {
        ed[type] = ed.current_img + 1;
    }

    await db.ed.update(1, { [type]: ed[type] });
};

const move_imgs_arr_item = action((from, to) => {
    x.move_a_item(shared_o.ob.imgs, from, to);
});
//< options
