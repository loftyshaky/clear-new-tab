import Svg from 'svg-inline-react';
import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as r from 'ramda';

import x from 'x';
import * as enter_click from 'js/enter_click';
import * as analytics from 'js/analytics';
import * as inapp from 'js/inapp';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as permissions_file from 'options/permissions';

import { Tr } from 'js/components/Tr';

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
    const { key, checkbox_type, is_global_checkbox, family, name, permissions } = props;
    const checkbox_id = is_global_checkbox ? `${name}_global` : name;
    const checkbox_is_locked = inputs_data.obj[family][name].premium && inapp.check_if_clear_new_tab_is_activated();

    const on_change_f = r.cond([
        [r.equals('ed'), () => settings.change_settings.bind(null, 'checkbox', family, name, null)],
        [r.equals('permissions'), () => permissions_file.ask_for_permission_or_remove_it.bind(null, name, toJS(permissions))],
        [r.equals('global'), () => settings.change_global_checkbox_setting.bind(null, name)],
    ])(checkbox_type);

    const on_change = async e => {
        analytics.send_event('checkboxes', `${e.target.checked ? 'checked' : 'unchecked'}-${family}-${name}${is_global_checkbox ? '-global' : ''}`);

        on_change_f();
    };

    return (
        <Tr
            attr={{
                key,
                className: 'checkbox_w',
            }}
            tag="span"
            name="gen"
            state={is_global_checkbox ? settings.ob.global_options_is_visible : inputs_data.obj[family][name].visible}
        >
            <label className="checkbox_label">
                <input
                    className="checkbox"
                    checked={'global_checkbox_val' in inputs_data.obj[family][name] ? inputs_data.obj[family][name].global_checkbox_val : inputs_data.obj[family][name].val}
                    type="checkbox"
                    id={checkbox_id}
                    onChange={checkbox_is_locked ? inapp.show_inapp_notice.bind(null, inputs_data.obj[family][name].premium) : on_change}
                />
                <span
                    className={x.cls(['checkbox_checkmark_w', checkbox_is_locked ? 'locked_input' : null])}
                    role="button"
                    tabIndex="0"
                    onKeyUp={enter_click.simulate_click_on_enter}
                >
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={is_global_checkbox ? 'global_label_text' : `${name}_label_text`}
                htmlFor={checkbox_id}
            />
        </Tr>
    );
});
