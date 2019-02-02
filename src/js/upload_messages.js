'use_strict';

import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

export const hide_upload_box_messages = action(() => {
    try {
        ob.upload_box_uploading_message_none_cls = 'none';
        ob.upload_box_error_message_none_cls = 'none';

    } catch (er) {
        err(er, 193);
    }
});

export const show_upload_box_error_message = action(() => {
    try {
        ob.upload_box_error_message_none_cls = '';

    } catch (er) {
        err(er, 194);
    }

});

export const show_upload_box_uploading_message = action(() => {
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

export const ob = observable({
    upload_box_uploading_message_none_cls: 'none',
    upload_box_error_message_none_cls: 'none',
    paste_input_placeholder: '',
});
