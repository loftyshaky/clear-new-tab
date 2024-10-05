import React from 'react';
import { observer } from 'mobx-react';

import { Tr } from 'shared/internal';

export const Body: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='install_help'
        // eslint-disable-next-line max-len
        state={data.settings.prefs.install_help_is_visible}
    >
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: ext.msg(`install_help_${env.browser}_text`) }} />
    </Tr>
));
