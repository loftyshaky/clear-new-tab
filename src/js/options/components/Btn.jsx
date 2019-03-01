import React from 'react';
import { observer } from 'mobx-react';

import { inputs_data } from 'options/inputs_data';

import { Tr } from 'js/components/Tr';

export const Btn = observer(props => {
    const { name, family, on_click, btn_ref, not_in_left_fieldset } = props;
    const { visible } = not_in_left_fieldset ? { visible: true } : inputs_data.obj[family][name];

    return (
        <Tr
            attr={{
                className: `input btn_w ${name}_btn_w`,
            }}
            tag="div"
            name="gen"
            state={visible}
        >
            <button
                type="button"
                name={name}
                className={`btn ${name}_btn`}
                data-text={`${name}_btn_text`}
                onClick={not_in_left_fieldset ? on_click : inputs_data.obj[family][name].on_click}
                ref={btn_ref}
            />
        </Tr>
    );
});
