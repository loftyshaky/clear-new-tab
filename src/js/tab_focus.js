import x from 'x';

const set_using_mouse_cls = (fun_name, e) => {
    try {
        const tab_or_mouse_btn_pressed = e && e.keyCode ? e.keyCode === 9 : true;
        const esc_pressed = e && e.keyCode ? e.keyCode === con.esc_key_code : false;

        if (tab_or_mouse_btn_pressed && !esc_pressed) {
            x[fun_name](document.body, 'using_mouse');
        }

    } catch (er) {
        err(er, 214);
    }
};

const prevent_el_focus_on_esc = e => {
    try {
        const esc_pressed = e.keyCode === con.esc_key_code;

        if (esc_pressed) {
            document.activeElement.blur();

            set_using_mouse_cls('add_cls');
        }

    } catch (er) {
        err(er, 215);
    }
};

x.bind(document.body, 'mousedown', set_using_mouse_cls.bind(null, 'add_cls'));
x.bind(document.body, 'keydown', prevent_el_focus_on_esc);
x.bind(document.body, 'keydown', set_using_mouse_cls.bind(null, 'remove_cls'));

const con = {
    esc_key_code: 27,
};
