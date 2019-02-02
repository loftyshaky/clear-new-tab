'use_strict';

import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as upload_messages from 'js/upload_messages';
import * as img_loading from 'options/img_loading';
import * as managing_upload_box from 'options/managing_upload_box';

import { Tr } from 'js/components/Tr';
import { Help } from 'options/components/Help';

export class Upload_box extends React.Component {
    componentDidMount() {
        try {
            x.bind(window, 'drop', this.prevent_default_dnd_actions);
            x.bind(window, 'dragover', this.prevent_default_dnd_actions);

        } catch (er) {
            err(er, 94);
        }
    }

    browse_handle_files = e => {
        try {
            img_loading.handle_files(e.target.files);
            managing_upload_box.reset_upload_btn_val();

        } catch (er) {
            err(er, 95);
        }
    }

    drop_handle_files = e => {
        try {
            managing_upload_box.dehighlight_upload_box_ondrop();
            img_loading.handle_files(e.dataTransfer.files);

        } catch (er) {
            err(er, 96);
        }
    }

    prevent_default_dnd_actions = e => {
        try {
            e.stopPropagation();
            e.preventDefault();

        } catch (er) {
            err(er, 97);
        }
    }

    render() {
        return (
            <div className="input upload_box_input">
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
                    <div className={x.cls(['upload_box_loader', 'upload_box_uploading_message', upload_messages.ob.upload_box_uploading_message_none_cls])} />
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
                        className={x.cls(['upload_box_message', 'upload_box_uploading_message', upload_messages.ob.upload_box_uploading_message_none_cls])}
                        data-text="upload_box_uploading_message_text"
                    />
                    <div
                        className={x.cls(['upload_box_message', 'upload_box_error_message', upload_messages.ob.upload_box_error_message_none_cls])}
                        data-text="upload_box_error_message_text"
                    />
                </Tr>
                <Help name="upload_box" add_help />
            </div>
        );
    }
}

observer(Upload_box);
