'use_strict';

import { observable, action, configure } from 'mobx';

import x from 'x';

configure({ enforceActions: 'observed' });

export const enter_upload_mode = () => {
    try {
        mut.uploading_theme_img = true;

        disable_ui();
        change_paste_input_placeholder_val(null);
        hide_upload_box_messages();
        show_upload_box_uploading_message();

    } catch (er) {
        err(er, 239);
    }
};

export const exit_upload_mode = status => {
    try {
        if (page === 'options') {
            mut.uploading_theme_img = false;

            enable_ui();

            hide_upload_box_messages();

            if (status === 'rejected' || status === 'resolved_with_errors') {
                show_upload_box_error_message();
            }

            if (status === 'resolved_paste') {
                change_paste_input_placeholder_val(null);
            }

            if (status === 'rejected_paste') {
                change_paste_input_placeholder_val(x.msg('upload_box_error_message_text'));
            }
        }

    } catch (er) {
        err(er, 181);
    }
};

export const enable_ui = () => {
    try {
        if (!mut.uploading_theme_img) {
            x.remove(s('.ui_disabled'));
        }

    } catch (er) {
        err(er, 166);
    }
};

export const disable_ui = () => {
    try {
        x.load_css('ui_disabled');

    } catch (er) {
        err(er, 167);
    }
};

export const hide_upload_box_messages = action(() => {
    try {
        ob.upload_box_uploading_message_none_cls = 'none';
        ob.upload_box_error_message_none_cls = 'none';

    } catch (er) {
        err(er, 193);
    }
});

const show_upload_box_error_message = action(() => {
    try {
        ob.upload_box_error_message_none_cls = '';

    } catch (er) {
        err(er, 194);
    }

});

const show_upload_box_uploading_message = action(() => {
    try {
        ob.upload_box_uploading_message_none_cls = '';

    } catch (er) {
        err(er, 195);
    }
});

export const change_paste_input_placeholder_val = action(val => {
    try {
        ob.paste_input_placeholder = val;

    } catch (er) {
        err(er, 196);
    }
});

const mut = {
    uploading_theme_img: false,
};

export const ob = observable({
    upload_box_uploading_message_none_cls: 'none',
    upload_box_error_message_none_cls: 'none',
    paste_input_placeholder: '',
});
