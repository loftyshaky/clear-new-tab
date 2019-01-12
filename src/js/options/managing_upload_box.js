import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

export const reset_upload_btn_val = action(() => {
    ob.upload_btn_val = '';
});

export const dehighlight_upload_box_ondrop = action(() => {
    mut.drag_counter = 0;
    ob.highlight_upload_box = false;
});

export const highlight_upload_box_ondragenter = action(() => {
    mut.drag_counter++;

    ob.highlight_upload_box = true;
});

export const dehighlight_upload_box_ondragleave = action(() => {
    mut.drag_counter--;

    if (mut.drag_counter === 0) {
        ob.highlight_upload_box = false;
    }
});

export const mut = {
    drag_counter: 0,
};

export const ob = observable({
    upload_btn_val: '',
    highlight_upload_box: false,
});
