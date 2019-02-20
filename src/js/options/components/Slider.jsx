'use_strict';

import 'rc-slider/assets/index.css';

import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from 'rc-tooltip';
import ReactSlider from 'rc-slider';

import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';

import { Tr } from 'js/components/Tr';
import { Global_checkbox } from 'options/components/Checkbox';

const { Handle } = ReactSlider;

export const Slider = observer(props => {
    const { family, name, include_global_checkbox } = props;
    const { val } = inputs_data.obj[family][name];

    const global_checkbox = include_global_checkbox
        ? (
            <Global_checkbox
                family={family}
                name={name}
                checkbox_type="global"
                is_global_checkbox
            />
        )
        : null;

    const change_val = new_val => {
        try {
            settings.change_input_val(family, name, new_val);
            settings.change_settings_slider('slider', family, name, new_val);

        } catch (er) {
            err(er, 228);
        }
    };

    return (
        <Tr
            attr={{
                className: 'input slider_input',
            }}
            tag="div"
            name="gen"
            state={inputs_data.obj[family][name].visible}
        >
            <label
                className="input_label slider_input_label"
                data-text={`${name}_label_text`}
                htmlFor={name}
            />
            <div className="slider_w">
                <ReactSlider
                    value={val}
                    min={0}
                    max={100}
                    handle={Handle_c}
                    onChange={change_val}
                />
                {global_checkbox}
            </div>
        </Tr>
    );
});

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
