import x from 'x';

export const set_using_mouse_cls = fun_name => {
    try {
        x[fun_name](document.body, 'using_mouse');

    } catch (er) {
        err(er, 214);
    }
};

export const prevent_el_focus_on_esc = e => {
    try {
        const esc_pressed = e.keyCode === 27;

        if (esc_pressed) {
            document.activeElement.blur();
        }

    } catch (er) {
        err(er, 215);
    }
};
