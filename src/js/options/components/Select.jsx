import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';

import x from 'x';
import * as prevent_scrolling from 'js/prevent_scrolling';
import * as shared_o from 'options/shared_o';
import * as settings from 'options/settings';

import { Tr } from 'js/Tr';
import { Help } from 'options/components/Help';

export class Select extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            show_global_options: this.show_global_options,
        } = this.props);

        this.select_w = React.createRef();
        this.select = React.createRef();
    }

    //> create one option element
    create_option = option => {
        const get_none_class = r.ifElse(() => !this.show_global_options && option.global,
            () => 'none',

            () => '');

        return <li role="presentation" key={option.key} className={x.cls(['option', get_none_class()])} data-storage={option.storage} data-val={option.val} onClick={this.change_select_val}>{option.text}</li>;
    }
    //< create one option element

    //> change option value when selecting option
    change_select_val = e => {
        settings.change_select_val(e.target.dataset.storage, e.target.dataset.val, e.target.textContent);

        this.hide_options();
    }
    //< change option value when selecting option

    //> hide options when clicking on option or select_title
    hide_options = async () => {
        if (document.activeElement === this.select_w.current) {
            await x.delay(0);

            this.select_w.current.blur();
        }
    }
    //< hide options when clicking on option or select_title

    render() {
        const options = settings.options[this.name];
        const selected_option_text = settings.ob.selected_options[this.name];
        const select_visibility = shared_o.ob.hidable_input_items[this.name];

        return (
            <Tr
                attr={{
                    className: 'input_item select_input_item',
                }}
                tag="div"
                name="gen"
                state={typeof select_visibility === 'boolean' ? select_visibility : true}
            >
                <label
                    className="input_label"
                    data-text={`${this.name}_label_text`}
                />
                <div
                    role="button"
                    className="select_w settings_input"
                    tabIndex="0"
                    ref={this.select_w}
                >
                    <div
                        role="presentation"
                        className="select_title"
                        onMouseDown={this.hide_options}
                    >{selected_option_text}
                    </div>
                    <ul
                        className="select"
                        onWheel={prevent_scrolling.prevent_scrolling.bind(this.select.current)}
                        ref={this.select}
                    >
                        {options.map(this.create_option)}
                    </ul>
                </div>
                <Help {...this.props} />
            </Tr>
        );
    }
}

observer(Select);
