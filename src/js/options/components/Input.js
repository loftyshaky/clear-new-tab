//> Input c

//>1 paste image or image url when clicking on "Paste" button t

//>1 paste image or image url when clicking on "Paste" button t

//^

'use strict';

import * as img_loading from 'js/img_loading';
import * as settings from 'options/settings';
import { Tr } from 'js/Tr';

import react from 'react';
import { observer } from "mobx-react";

import { Help } from 'options_components/Help';

//> Input c
export class Input extends react.Component {
    constructor(props) {
        super(props);

        this.input = react.createRef();
        this.btn = react.createRef();
    }

    //>1 paste image or image url when clicking on "Paste" button t
    paste_image_by_paste_btn = () => {
        this.input.current.select();

        document.execCommand('paste');

        this.btn.current.focus();
    }
    //>1 paste image or image url when clicking on "Paste" button t

    render() {
        const pasted_url_img_el = this.props.name == 'paste' ? <img className='pasted_url_img_el' src='#' /> : null;

        return (
            <Tr
                attr={{
                    className: 'input_item'
                }}
                tag='div'
                name='gen'
                state={typeof this.props.input_visibility == 'boolean' ? this.props.input_visibility : true}
            >
                <label
                    className='input_label'
                    data-text={this.props.name + '_label_text'}
                    htmlFor={this.props.name + '_input'}
                ></label>
                <div className={this.props.name + '_input_w'}>
                    <input
                        className='normal_input adjacent_input'
                        value={this.props.val || ''}
                        type='text'
                        data-storage={this.props.storage}
                        id={this.props.name + '_input'}
                        placeholder={img_loading.ob.paste_input_placeholder}
                        onChange={() => ''}
                        onPaste={this.props.name == 'paste' ? img_loading.get_pasted_image_or_image_url : null}
                        onBlur={this.props.name == 'current_img' ? settings.correct_current_img_input_val : null}
                        onInput={settings.change_current_img_by_typing_into_currrent_img_input}
                        ref={this.input}
                    />
                    <Tr
                        tag='span'
                        name='gen'
                        state={typeof this.props.input_btn_visibility == 'boolean' ? this.props.input_btn_visibility : true}
                    >
                        <button
                            className='btn adjacent_btn'
                            data-text={this.props.name + '_btn_text'}
                            onClick={this.props.name == 'paste' ? this.paste_image_by_paste_btn : settings.change_current_img_by_clicking_on_select_img_btn}
                            ref={this.btn}
                        ></button>
                    </Tr>
                </div>
                {pasted_url_img_el}
                <Help {...this.props} />
            </Tr>
        );
    }
}
//< Input c

Input = observer(Input);