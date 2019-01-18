import React from 'react';
import { observer } from 'mobx-react';
import ReactSelect, { components } from 'react-select';

import x from 'x';
import { inputs_data } from 'options/inputs_data';
import { selects_options } from 'options/selects_options';
import * as shared_o from 'options/shared_o';
import * as settings from 'options/settings';

import { Tr } from 'js/Tr';
import { Help } from 'options/components/Help';

export class Select extends React.Component {
    constructor(props) {
        super(props);

        ({
            family: this.family,
            name: this.name,
            global_options_is_visible: this.global_options_is_visible,
        } = this.props);

        this.select_w = React.createRef();
        this.select = React.createRef();
    }

    //> change option val when selecting option
    change_select_val = selected_option => {
        const { value } = selected_option;

        if (!selected_option.is_settings_type_select) {
            settings.change_settings('select', this.family, this.name, value);

        } else if (selected_option.is_settings_type_select && value === 'global') {
            shared_o.change_input_val(this.family, this.name, value);
        }

        shared_o.switch_to_settings_type(this.name, value);
    }
    //< change option val when selecting option

    on_menu_open = async () => {
        await x.delay(0);

        this.transit_menu();
    }

    transit_menu = () => {
        x.add_cls(s('.select__menu'), 'select__menu_is_focused');
    }

    render() {
        const { val } = inputs_data.obj[this.family][this.name];
        const options = selects_options[this.name];
        const selected_option = options.find(option => option.value === val);

        return (
            <Tr
                attr={{
                    className: 'input select_input',
                }}
                tag="div"
                name="gen"
                state={inputs_data.obj[this.family][this.name].visible}
            >
                <div>
                    <label
                        className="input_label"
                        data-text={`${this.name}_label_text`}
                    />
                    <ReactSelect
                        value={selected_option}
                        options={options}
                        components={{ Option }}
                        classNamePrefix="select"
                        backspaceRemovesValue={false}
                        onChange={this.change_select_val}
                        onMenuOpen={this.on_menu_open}
                    />
                    <Help {...this.props} />
                </div>
            </Tr>
        );
    }
}

const Option = props => {
    const { data: { global } } = props;

    return (
        <components.Option
            {...props}
            className={global ? 'global_option' : null}
        />
    );
};

observer(Select);
