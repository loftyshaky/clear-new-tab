'use_strict';

import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

export const reset_upload_btn_val = action(() => {
    try {
        ob.upload_btn_val = '';

    } catch (er) {
        err(er, 119);
    }
});

export const dehighlight_upload_box_ondrop = action(() => {
    try {
        mut.drag_counter = 0;
        ob.highlight_upload_box = false;

    } catch (er) {
        err(er, 120);
    }
});

export const highlight_upload_box_ondragenter = action(() => {
    try {
        mut.drag_counter++;

        ob.highlight_upload_box = true;

    } catch (er) {
        err(er, 121);
    }
});

export const dehighlight_upload_box_ondragleave = action(() => {
    try {
        mut.drag_counter--;

        if (mut.drag_counter === 0) {
            ob.highlight_upload_box = false;
        }

    } catch (er) {
        err(er, 122);
    }
});

export const mut = {
    drag_counter: 0,
};

export const ob = observable({
    upload_btn_val: '',
    highlight_upload_box: false,
});
