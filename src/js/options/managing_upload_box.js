//> reset_upload_btn_val f

//> dehighlight_upload_box_on_drop f

//> highlight_upload_box_f f

//> dehighlight_upload_box_on_dragleave f

//> varibles t

//^

'use strict';

import { observable, action, configure } from "mobx";

configure({ enforceActions: true });

//> reset_upload_btn_val f
export const reset_upload_btn_val = action(() => {
    ob.upload_btn_val = '';
});
//< reset_upload_btn_val f

//> dehighlight_upload_box_on_drop f
export const dehighlight_upload_box_ondrop = action(e => {
    mut.drag_counter = 0;
    ob.highlight_upload_box = false;
});
//< dehighlight_upload_box_on_drop f

//> highlight_upload_box_f f
export const highlight_upload_box_ondragenter = action(() => {
    mut.drag_counter++;

    ob.highlight_upload_box = true;
});
//< highlight_upload_box_f f

//> dehighlight_upload_box_on_dragleave f
export const dehighlight_upload_box_ondragleave = action(e => {
    mut.drag_counter--;

    if (mut.drag_counter == 0) {
        ob.highlight_upload_box = false;
    }
});
//< dehighlight_upload_box_on_dragleave f

//> varibles t
export const mut = {
    drag_counter: 0
};

export const ob = observable({
    upload_btn_val: '',
    highlight_upload_box: false
});
//< varibles t