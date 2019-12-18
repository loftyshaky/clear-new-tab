import React from 'react';
import { observer } from 'mobx-react';
import ReactSelect, { components } from 'react-select';

import x from 'x';
import * as analytics from 'js/analytics';
import { inputs_data } from 'options/inputs_data';
import { selects_options } from 'options/selects_options';
import * as settings from 'options/settings';
import * as inapp from 'js/inapp';

import { Tr } from 'js/components/Tr';
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
        try {
            const { value, premium } = selected_option;
            const select_is_locked = premium && inapp.check_if_clear_new_tab_is_activated();

            if (!select_is_locked) {
                analytics.send_event('selects', `selected_option-${this.family}-${this.name}-${value}`);

                if (!selected_option.is_settings_type_select) {
                    settings.change_settings('select', this.family, this.name, value);

                } else if (selected_option.is_settings_type_select && value === 'global') {
                    settings.change_input_val(this.family, this.name, value);
                }

                settings.switch_to_settings_type(this.name, value);

            } else {
                inapp.show_inapp_notice(value);
            }

        } catch (er) {
            err(er, 90);
        }
    }
    //< change option val when selecting option

    on_menu_open = async () => {
        try {
            await x.delay(0);

            this.transit_menu();

        } catch (er) {
            err(er, 91);
        }
    }

    transit_menu = () => {
        try {
            x.add_cls(s('.select__menu'), 'select__menu_is_focused');

        } catch (er) {
            err(er, 92);
        }
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
                        family={this.family}
                        name={this.name}
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
    const { selectProps: { name }, data: { global, premium, value } } = props;
    const select_is_locked = premium && inapp.check_if_clear_new_tab_is_activated();

    return (
        !(env.what_browser === 'edge' && name === 'mode' && value === 'theme') ? (
            <components.Option
                {...props}
                className={x.cls([global ? 'global_option' : null, select_is_locked ? 'locked_input' : null])}
            />
        ) : null
    );
};

observer(Select);
