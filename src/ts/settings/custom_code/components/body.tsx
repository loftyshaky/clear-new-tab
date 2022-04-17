import React from 'react';
import { observer } from 'mobx-react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/material-palenight.css';
import 'codemirror/theme/material-ocean.css';

import { Tr } from 'shared/internal';
import { c_custom_code, d_custom_code } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='code_editor'
        // eslint-disable-next-line max-len
        state={d_custom_code.Visibility.i().is_visible}
    >
        <c_custom_code.TopControls />
        <div
            className={x.cls([
                'code_editor_inner',
                d_custom_code.Help.i().custom_code_inner_visibility_cls,
            ])}
        >
            <div className='edit_areas'>
                <c_custom_code.EditArea type='html' />
                <c_custom_code.EditArea type='css' />
                <c_custom_code.EditArea type='js' />
            </div>
            <c_custom_code.FormatBtn />
        </div>
        <c_custom_code.Help />
    </Tr>
));
