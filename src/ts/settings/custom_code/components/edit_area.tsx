import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import { s_custom_code, p_custom_code } from 'settings/internal';

export const EditArea: React.FunctionComponent<p_custom_code.EditArea> = observer((props) => {
    const editor_ref = useRef<any>(null);

    const { type } = props;

    useEffect(() => {
        s_custom_code.CodeMirror.init_calls.push((): void => {
            s_custom_code.CodeMirror.init({ type, editor_el: editor_ref.current });
        });
    }, [type]);

    return (
        <div className='edit_area'>
            <label htmlFor={`${type}_edit_area_label`} className={x.cls(['name', type])}>
                {ext.msg(`${type}_label_text`)}
            </label>
            <div className='editor' ref={editor_ref} />
        </div>
    );
});
