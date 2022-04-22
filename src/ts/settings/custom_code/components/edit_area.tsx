import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import { s_custom_code, p_custom_code } from 'settings/internal';

export const EditArea: React.FunctionComponent<p_custom_code.EditArea> = observer((props) => {
    const textarea_ref = useRef<any>(null);

    const { type } = props;

    useEffect(() => {
        s_custom_code.CodeMirror.i().init({ type, textarea_el: textarea_ref.current });
    }, [type]);

    return (
        <div className='edit_area'>
            <label htmlFor={`${type}_edit_area_label`} className={x.cls(['name', type])}>
                {ext.msg(`${type}_label_text`)}
            </label>
            <textarea
                className={x.cls(['text_input', type])}
                ref={textarea_ref}
                autoComplete='off'
                value=' ' /* needed to be not blank otherwise code mirror change event will not fire on initial paste */
            />
        </div>
    );
});
