'use_strict';

import React from 'react';
import { SketchPicker } from 'react-color';
import { observer } from 'mobx-react';

import * as analytics from 'js/analytics';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as enter_click_color_pickier from 'options/enter_click_color_pickier';

import { Tr } from 'js/components/Tr';
import { Global_checkbox } from 'options/components/Checkbox';

export const Color = observer(props => {
    const { family, name, include_global_checkbox } = props;
    const { vizualization_color, color_pickier_is_visible, color_pickier_position } = inputs_data.obj[family][name];
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

    const change_color_input_vizualization_color = color => {
        try {
            if (!inputs_data.obj[family][name].changed_color_once_after_focus) {
                inputs_data.obj[family][name].changed_color_once_after_focus = true;

                analytics.send_event('color_pickiers', `changed_color-${family}-${name}`);
            }

            settings.set_color_input_vizualization_color(family, name, color.hex);

        } catch (er) {
            err(er, 73);
        }
    };

    //> accept color when clicking OK
    const accept_color = () => {
        try {
            analytics.send_event('color_pickiers', `accepted_color-${family}-${name}`);

            settings.determine_and_run_accept_color_f(family, name, vizualization_color);
            settings.show_or_hide_color_pickier(family, name, false);

        } catch (er) {
            err(er, 74);
        }
    };
    //< accept color when clicking OK

    return (
        <div className="input color_input">
            <label
                className="input_label color_input_label"
                data-text={`${name}_label_text`}
                htmlFor={name}
            />
            <span
                className="color_input_vizualization"
                role="button"
                tabIndex={0}
                data-family={family}
                data-name={name}
                style={{ backgroundColor: vizualization_color }}
                onKeyUp={enter_click_color_pickier.open_color_pickier_on_enter}
            >
                <div
                    className="color_pickier_w"
                    style={{ [color_pickier_position]: '-1px' }}
                >
                    <Tr
                        attr={{
                            className: 'color_pickier',
                        }}
                        tag="div"
                        name="gen"
                        state={color_pickier_is_visible}
                    >
                        <SketchPicker
                            color={vizualization_color}
                            disableAlpha
                            onChange={change_color_input_vizualization_color}
                        />
                        <button
                            type="button"
                            className="color_ok_btn"
                            onClick={accept_color}
                        >OK
                        </button>
                    </Tr>
                </div>
            </span>
            {global_checkbox}
        </div>
    );
});
