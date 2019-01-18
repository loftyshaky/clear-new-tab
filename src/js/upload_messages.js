import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

export const hide_upload_box_messages = action(() => {
    ob.upload_box_uploading_message_none_cls = 'none';
    ob.upload_box_error_message_none_cls = 'none';
});

export const show_upload_box_error_message = action(() => { ob.upload_box_error_message_none_cls = ''; });

export const show_upload_box_uploading_message = action(() => { ob.upload_box_uploading_message_none_cls = ''; });

export const change_paste_input_placeholder_val = action(val => { ob.paste_input_placeholder = val; });

export const ob = observable({
    upload_box_uploading_message_none_cls: 'none',
    upload_box_error_message_none_cls: 'none',
    paste_input_placeholder: '',
});
