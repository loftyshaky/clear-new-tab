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

export const focus_first_el_in_analytics_privacy_dialog = (el_to_focus, e) => {
    force_focus(el_to_focus, !mut.holding_shift, e);
};

export const focus_last_el_in_analytics_privacy_dialog = (el_to_focus, e) => {
    force_focus(el_to_focus, mut.holding_shift, e);
};

export const focus_first_el_in_analytics_privacy_dialog_caller = e => focus_first_el_in_analytics_privacy_dialog(s('.allow_analytics_btn'), e);
export const focus_last_el_in_analytics_privacy_dialog_caller = e => focus_last_el_in_analytics_privacy_dialog(s('.privacy_policy_link'), e);

const force_focus = async (el, shift, e) => {
    if (!mut.answered_to_analytics_privacy_question && shift && (e.keyCode === con.tab_key_code || e.type === 'focus')) {
        el.focus();
        e.preventDefault();
    }
};

//> prevent focus when ui is disabled
if (page === 'options') {
    x.bind(document, 'keydown', e => {
        if (s('.ui_disabled') && mut.answered_to_analytics_privacy_question) {
            e.target.blur();
            e.preventDefault();
        }
    });
}
//< prevent focus when ui is disabled

x.bind(document.body, 'mousedown', set_using_mouse_cls.bind(null, 'add_cls'));
x.bind(document.body, 'keydown', prevent_el_focus_on_esc);
x.bind(document.body, 'keydown', set_using_mouse_cls.bind(null, 'remove_cls'));
x.bind(document, 'keydown', e => { mut.holding_shift = e.shiftKey; });
x.bind(document, 'keyup', e => { mut.holding_shift = e.shiftKey; });

const con = {
    esc_key_code: 27,
    tab_key_code: 9,
};

export const mut = {
    answered_to_analytics_privacy_question: null,
};

(async () => {
    mut.answered_to_analytics_privacy_question = await ed('answered_to_analytics_privacy_question');
})();
