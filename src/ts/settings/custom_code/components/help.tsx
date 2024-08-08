import React from 'react';
import { observer } from 'mobx-react';
import { d_custom_code } from 'settings/internal';

export const Help: React.FunctionComponent = observer(() => (
    <div className={x.cls(['custom_code_help', d_custom_code.Help.help_visibility_cls])}>
        {ext.msg('custom_code_help_text')}
    </div>
));
