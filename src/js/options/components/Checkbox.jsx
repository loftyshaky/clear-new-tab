import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

import * as shared_o from 'options/shared_o';
import * as permissions from 'options/permissions';

import { Tr } from 'js/Tr';

import checkmark_svg from 'svg/checkmark';

export const Checkbox = observer(props => {
    const checkbox_visibility = shared_o.ob.hidable_input_items[props.name];

    return (
        <Tr
            attr={{
                className: 'input_item',
            }}
            tag="div"
            name="gen"
            state={typeof checkbox_visibility === 'boolean' ? checkbox_visibility : true}
        >
            <Global_checkbox {...props} active />
        </Tr>
    );
});

export const Global_checkbox = observer(props => {
    const checked = ed[props.name] || permissions.ob.optional_permissions_checkboxes[props.name] || props.checked;
    const onchange_f = props.onchange_f.bind ? props.onchange_f.bind(null, 'checkbox', props.name, null) : props.onchange_f;

    return (
        <Tr
            tag="span"
            name="gen"
            state={props.active}
        >
            <label className="checkbox_label">
                <input
                    className="checkbox"
                    checked={checked || ''}
                    type="checkbox"
                    id={props.name}
                    onChange={onchange_f}
                />
                <span className="checkbox_checkmark_w">
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={`${props.name}_label_text`}
                htmlFor={props.name}
            />
        </Tr>
    );
});
