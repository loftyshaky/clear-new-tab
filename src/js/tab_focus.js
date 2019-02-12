import x from 'x';

const set_using_mouse_cls = fun_name => {
    try {
        x[fun_name](document.body, 'using_mouse');

    } catch (er) {
        err(er, 214);
    }
};

const prevent_el_focus_on_esc = e => {
    try {
        const esc_pressed = e.keyCode === 27;

        if (esc_pressed) {
            document.activeElement.blur();
        }

    } catch (er) {
        err(er, 215);
    }
};

x.bind(document.body, 'mousedown', set_using_mouse_cls.bind(null, 'add_cls'));
x.bind(document.body, 'keydown', prevent_el_focus_on_esc);
x.bind(document.body, 'keydown', set_using_mouse_cls.bind(null, 'remove_cls'));
