'use_strict';

import Svg from 'svg-inline-react';
import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as r from 'ramda';

import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as permissions_file from 'options/permissions';

import { Tr } from 'js/Tr';

import checkmark_svg from 'svg/checkmark';

export const Checkbox = observer(props => {
    const { family, name } = props;
    const { visible } = inputs_data.obj[family][name];

    return (
        <Tr
            attr={{
                className: 'input',
            }}
            tag="div"
            name="gen"
            state={visible}
        >
            <Global_checkbox {...props} visible />
        </Tr>
    );
});

export const Global_checkbox = observer(props => {
    const { key, checkbox_type, is_color_global_checkbox, family, name, permissions } = props;

    const on_change = r.cond([
        [r.equals('ed'), () => settings.change_settings.bind(null, 'checkbox', family, name, null)],
        [r.equals('permissions'), () => permissions_file.ask_for_permission_or_remove_it.bind(null, name, toJS(permissions))],
        [r.equals('color_global'), () => settings.change_color_global_checkbox_setting.bind(null, name)],
    ])(checkbox_type);

    return (
        <Tr
            attr={{
                key,
                className: 'checkbox_w',
            }}
            tag="span"
            name="gen"
            state={is_color_global_checkbox ? settings.ob.global_options_is_visible : inputs_data.obj[family][name].visible}
        >
            <label className="checkbox_label">
                <input
                    className="checkbox"
                    checked={'color_global_checkbox_val' in inputs_data.obj[family][name] ? inputs_data.obj[family][name].color_global_checkbox_val : inputs_data.obj[family][name].val}
                    type="checkbox"
                    id={props.name}
                    onChange={on_change}
                />
                <span className="checkbox_checkmark_w">
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={is_color_global_checkbox ? 'color_global_label_text' : `${props.name}_label_text`}
                htmlFor={props.name}
            />
        </Tr>
    );
});
