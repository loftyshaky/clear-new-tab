//> Upload_box c

//> browse_handle_files f

//> drop_handle_files f

//> prevent_default_dnd_actions f

//^

import x from 'x';
import * as img_loading from 'js/img_loading';
import * as managing_upload_box from 'options/managing_upload_box';
import { Tr } from 'js/Tr';

import { Help } from 'options/components/Help';

import React from 'react';
import { observer } from 'mobx-react';

//> Upload_box c
export class Upload_box extends React.Component {
    componentDidMount() {
        window.addEventListener('drop', this.prevent_default_dnd_actions);
        window.addEventListener('dragover', this.prevent_default_dnd_actions);
    }

    componentWillUnmount() {
        window.removeEventListener('drop', this.prevent_default_dnd_actions);
        window.removeEventListener('dragover', this.prevent_default_dnd_actions);
    }

    //> browse_handle_files f
    browse_handle_files = e => {
        img_loading.handle_files(e.target.files);
        managing_upload_box.reset_upload_btn_val();
    }
    //< browse_handle_files f

    //> drop_handle_files f
    drop_handle_files = e => {
        managing_upload_box.dehighlight_upload_box_ondrop();
        img_loading.handle_files(e.dataTransfer.files);
    }
    //< drop_handle_files f

    //> prevent_default_dnd_actions f
    prevent_default_dnd_actions = e => {
        e.stopPropagation();
        e.preventDefault();
    }
    //< prevent_default_dnd_actions f

    render() {
        return (
            <div className="input_item upload_box_input_item">
                <Tr
                    attr={{
                        className: 'upload_box',
                        onDragEnter: managing_upload_box.highlight_upload_box_ondragenter,
                        onDragLeave: managing_upload_box.dehighlight_upload_box_ondragleave,
                        onDrop: this.drop_handle_files,
                    }}
                    tag="div"
                    name="upload_box"
                    state={managing_upload_box.ob.highlight_upload_box}
                >
                    <div className={x.cls(['upload_box_loader', 'upload_box_uploading_message', img_loading.ob.upload_box_uploading_message_none_cls])} />
                    <input
                        className="upload_btn"
                        id="file"
                        type="file"
                        accept="image/*"
                        value={managing_upload_box.ob.upload_btn_val}
                        multiple
                        onChange={this.browse_handle_files}
                    />
                    <span className="upload_box_what_to_do_message">
                        <label
                            className="upload_box_browse_label"
                            htmlFor="file"
                            data-text="upload_box_browse_label_text"
                        />
                        {' '}
                        <label data-text="upload_box_drag_label_text" />
                    </span>
                    <div
                        className={x.cls(['upload_box_message', 'upload_box_uploading_message', img_loading.ob.upload_box_uploading_message_none_cls])}
                        data-text="upload_box_uploading_message_text"
                    />
                    <div
                        className={x.cls(['upload_box_message', 'upload_box_error_message', img_loading.ob.upload_box_error_message_none_cls])}
                        data-text="upload_box_error_message_text"
                    />
                </Tr>
                <Help name="upload_box" add_help />
            </div>
        );
    }
}
//< Upload_box c

observer(Upload_box);
