import React from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs } from '@loftyshaky/shared/inputs';
import { s_custom_code } from 'settings/internal';

export const FormatBtn: React.FunctionComponent = observer(() => (
    <c_inputs.Btn
        input={
            new o_inputs.Btn({
                name: 'format',
                event_callback: s_custom_code.CodeMirror.i().format,
            })
        }
    />
));
