import React from 'react';
import { SketchPicker } from 'react-color';
import { observer } from 'mobx-react';

import * as shared_o from 'options/shared_o';
import * as settings from 'options/settings';

import { Tr } from 'js/Tr';
import { Global_checkbox } from 'options/components/Checkbox';

export const Color = observer(props => {
    const change_color_input_vizualization_color = color => {
        shared_o.set_color_input_vizualization_color(props.name, color.hex);
    };

    //> accept color when clicking OK
    const accept_color = () => {
        props.accept_color(settings.ob.color_input_vizualization_colors[props.name]);

        settings.show_or_hide_color_pickier(props.name, false);
    };
    //< accept color when clicking OK

    const color_pickier_state = settings.ob.color_pickiers_state[props.name];
    const color_pickiers_position = settings.ob.color_pickiers_position[props.name];
    const global_checkbox = props.include_global_checkbox ? <Global_checkbox name="color_global" active={settings.ob.show_global_options} checked={settings.ob.color_global_checkbox_state} onchange_f={settings.change_color_global_checkbox_setting} /> : null;

    return (
        <div className="input color_input">
            <label
                className="input_label color_input_label"
                data-text={`${props.name}_label_text`}
                htmlFor={props.name}
            />
            <span
                className="color_input_vizualization"
                data-name={props.name}
                style={{ backgroundColor: settings.ob.color_input_vizualization_colors[props.name] }}
            >
                <div
                    className="color_pickier_w"
                    style={{ [color_pickiers_position]: '-1px' }}
                >
                    <Tr
                        attr={{
                            className: 'color_pickier',
                        }}
                        tag="div"
                        name="gen"
                        state={color_pickier_state}
                    >
                        <SketchPicker
                            color={settings.ob.color_input_vizualization_colors[props.name]}
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
