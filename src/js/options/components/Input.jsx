import React from 'react';
import { observer } from 'mobx-react';

import * as img_loading from 'js/img_loading';
import * as settings from 'options/settings';

import { Tr } from 'js/Tr';
import { Help } from 'options/components/Help';

export class Input extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            storage: this.storage,
        } = this.props);

        this.input = React.createRef();
        this.btn = React.createRef();
    }

    //> paste image or image url when clicking on "Paste" button
    paste_image_by_paste_btn = () => {
        this.input.current.select();

        document.execCommand('paste');

        this.btn.current.focus();
    }
    //> paste image or image url when clicking on "Paste" button

    render() {
        const { val, input_visibility, input_btn_visibility } = this.props;
        const pasted_url_img_el = this.name === 'paste' ? <img alt="" className="pasted_url_img_el" src="#" /> : null;

        return (
            <Tr
                attr={{
                    className: 'input',
                }}
                tag="div"
                name="gen"
                state={typeof input_visibility === 'boolean' ? input_visibility : true}
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
                        data-storage={this.storage}
                        id={`${this.name}_input`}
                        placeholder={img_loading.ob.paste_input_placeholder}
                        onChange={() => ''}
                        onPaste={this.name === 'paste' ? img_loading.get_pasted_image_or_image_url : null}
                        onBlur={this.name === 'current_img' ? settings.correct_current_img_input_val : null}
                        onInput={this.name === 'current_img' ? settings.change_current_img_by_typing_into_currrent_img_input : null}
                        ref={this.input}
                    />
                    <Tr
                        attr={{
                            className: 'adjacent_btn_w',
                        }}
                        tag="span"
                        name="gen"
                        state={typeof input_btn_visibility === 'boolean' ? input_btn_visibility : true}
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
