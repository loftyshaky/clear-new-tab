import React from 'react';

import { inputs_data } from 'options/inputs_data';

import { Btn } from 'options/components/Btn';
import { Input } from 'options/components/Input';
import { Select } from 'options/components/Select';
import { Checkbox } from 'options/components/Checkbox';
import { Color } from 'options/components/Color';
import { Slider } from 'options/components/Slider';
import { Separator } from 'options/components/Separator';

export const Left_fieldset = props => {
    const { family, wrap_inputs, children } = props;
    const there_are_inputs_in_this_fieldset = inputs_data.obj[family];
    const inputs = there_are_inputs_in_this_fieldset
        ? Object.keys(inputs_data.obj[family]).map(name => {
            const Component = con.components[inputs_data.obj[family][name].type];

            return (
                <Component
                    {...inputs_data.obj[family][name]}
                />
            );
        })
        : null;

    return (
        <fieldset className="input_fieldset">
            <legend
                className={`${family}_legend`}
                data-text={`${family}_legend_text`}
            />
            <div className={`${family}_w`}>
                {children}
                {wrap_inputs ? <div>{inputs}</div> : inputs}
            </div>
        </fieldset>
    );
};

const con = {
    components: {
        btn: Btn,
        input: Input,
        select: Select,
        checkbox: Checkbox,
        color: Color,
        separator: Separator,
        slider: Slider,
    },
};
