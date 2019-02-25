'use_strict';

import 'rc-slider/assets/index.css';

import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from 'rc-tooltip';
import ReactSlider from 'rc-slider';

import x from 'x';
import * as analytics from 'js/analytics';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';

import { Tr } from 'js/components/Tr';
import { Global_checkbox } from 'options/components/Checkbox';

const { Handle } = ReactSlider;

export class Slider extends React.Component {
    constructor(props) {
        super(props);

        ({
            family: this.family,
            name: this.name,
            include_global_checkbox: this.include_global_checkbox,
        } = this.props);


        this.slider_w = React.createRef();
    }

    componentDidMount() {
        x.bind(sb(this.slider_w.current, '.rc-slider-handle'), 'blur', () => {
            inputs_data.obj[this.family][this.name].adjusting_slider_once_after_focus = false;
        });
    }

    change_val = new_val => {
        try {
            if (!inputs_data.obj[this.family][this.name].adjusting_slider_once_after_focus) {
                inputs_data.obj[this.family][this.name].adjusting_slider_once_after_focus = true;

                analytics.send_event('sliders', `adjusted-${this.family}-${this.name}`);
            }

            settings.change_input_val(this.family, this.name, new_val);
            settings.change_settings_slider('slider', this.family, this.name, new_val);

        } catch (er) {
            err(er, 228);
        }
    };

    render() {
        const global_checkbox = this.include_global_checkbox
            ? (
                <Global_checkbox
                    family={this.family}
                    name={this.name}
                    checkbox_type="global"
                    is_global_checkbox
                />
            )
            : null;

        const { val } = inputs_data.obj[this.family][this.name];

        return (
            <Tr
                attr={{
                    className: 'input slider_input',
                }}
                tag="div"
                name="gen"
                state={inputs_data.obj[this.family][this.name].visible}
            >
                <label
                    className="input_label slider_input_label"
                    data-text={`${this.name}_label_text`}
                    htmlFor={this.name}
                />
                <div
                    className="slider_w"
                    ref={this.slider_w}
                >
                    <ReactSlider
                        value={val}
                        min={0}
                        max={100}
                        handle={Handle_c}
                        onChange={this.change_val}
                    />
                    {global_checkbox}
                </div>
            </Tr>
        );
    }
}

const Handle_c = props => {
    const { value, dragging, index, ...restProps } = props;

    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

observer(Slider);
