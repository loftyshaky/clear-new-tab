'use_strict';

import React from 'react';
import { observer } from 'mobx-react';

import * as upload_messages from 'js/upload_messages';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';

import { Tr } from 'js/components/Tr';
import { Help } from 'options/components/Help';

export class Input extends React.Component {
    constructor(props) {
        super(props);

        ({
            family: this.family,
            name: this.name,
        } = this.props);

        this.input = React.createRef();
        this.btn = React.createRef();
    }

    //> paste image or image url when clicking on "Paste" button
    paste_image_by_paste_btn = () => {
        try {
            this.input.current.select();

            document.execCommand('paste');

            this.btn.current.focus();

        } catch (er) {
            err(er, 85);
        }
    }
    //> paste image or image url when clicking on "Paste" button

    render() {
        const { on_paste, on_input, on_blur } = this.props;
        const { val, visible, adjacent_btn_is_visible } = inputs_data.obj[this.family][this.name];
        const pasted_url_img_el = this.name === 'paste' ? <img alt="" className="pasted_url_img_el" src="#" /> : null;

        return (
            <Tr
                attr={{
                    className: 'input',
                }}
                tag="div"
                name="gen"
                state={visible}
            >
                <label
                    className="input_label"
                    data-text={`${this.name}_label_text`}
                    htmlFor={`${this.name}_input`}
                />
                <div className={`${this.name}_input_w`}>
                    <input
                        className="normal_input adjacent_input"
                        value={val || ''}
                        type="text"
                        id={`${this.name}_input`}
                        placeholder={upload_messages.ob.paste_input_placeholder}
                        onChange={() => ''}
                        onPaste={on_paste}
                        onInput={on_input}
                        onBlur={on_blur}
                        ref={this.input}
                    />
                    <Tr
                        attr={{
                            className: 'adjacent_btn_w',
                        }}
                        tag="span"
                        name="gen"
                        state={adjacent_btn_is_visible}
                    >
                        <button
                            type="button"
                            className="btn adjacent_btn"
                            data-text={`${this.name}_btn_text`}
                            onClick={this.name === 'paste' ? this.paste_image_by_paste_btn : settings.change_current_img_by_clicking_on_select_img_btn}
                            ref={this.btn}
                        />
                    </Tr>
                </div>
                {pasted_url_img_el}
                <Help {...this.props} />
            </Tr>
        );
    }
}

observer(Input);
