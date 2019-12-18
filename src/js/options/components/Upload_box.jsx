import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as ui_state from 'options/ui_state';
import * as background_loading from 'options/background_loading';
import * as managing_upload_box from 'options/managing_upload_box';
import * as enter_click from 'js/enter_click';

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
            analytics.send_upload_box_event('uploaded_by_browse_btn');
            background_loading.handle_files(e.target.files);
            managing_upload_box.reset_upload_btn_val();

        } catch (er) {
            err(er, 95);
        }
    }

    drop_handle_files = e => {
        try {
            analytics.send_upload_box_event('uploaded_by_dragging_and_dropping');
            managing_upload_box.dehighlight_upload_box_ondrop();
            background_loading.handle_files(e.dataTransfer.files);

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

    upload_box_browse_label_on_click = () => {
        try {
            document.activeElement.blur();

            analytics.send_upload_box_event('browse_btn_clicked');

        } catch (er) {
            err(er, 277);
        }
    };

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
                    <div className={x.cls(['upload_box_loader', 'upload_box_uploading_message', ui_state.ob.upload_box_uploading_message_none_cls])} />
                    <input
                        className="upload_btn"
                        id="file"
                        type="file"
                        accept=".gif, .jpeg, .jpg, .png, .mp4, .webm, .ogv"
                        value={managing_upload_box.ob.upload_btn_val}
                        multiple
                        onChange={this.browse_handle_files}
                    />
                    <span className="upload_box_what_to_do_message">
                        <label
                            className="upload_box_browse_label"
                            htmlFor="file"
                            data-text="upload_box_browse_label_text"
                            tabIndex="0"
                            onKeyUp={enter_click.simulate_click_on_enter}
                            onClick={this.upload_box_browse_label_on_click}
                        />
                        {' '}
                        <label data-text="upload_box_drag_label_text" />
                    </span>
                    <div
                        className={x.cls(['upload_box_message', 'upload_box_uploading_message', ui_state.ob.upload_box_uploading_message_none_cls])}
                        data-text="upload_box_uploading_message_text"
                    />
                    <div
                        className={x.cls(['upload_box_message', 'upload_box_error_message', ui_state.ob.upload_box_error_message_none_cls])}
                        data-text="upload_box_error_message_text"
                    />
                </Tr>
                <Help family="upload" name="upload_box" add_help />
            </div>
        );
    }
}

observer(Upload_box);
