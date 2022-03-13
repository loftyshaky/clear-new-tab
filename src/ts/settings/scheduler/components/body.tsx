import React from 'react';
import { observer } from 'mobx-react';

import { Tr } from 'shared/internal';
import { c_scheduler, d_scheduler } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='scheduler'
        // eslint-disable-next-line max-len
        state={d_scheduler.Visibility.i().is_visible}
        style={{
            width: x.px(d_scheduler.Width.i().width),
            left: x.px(d_scheduler.Position.i().left),
        }}
    >
        <c_scheduler.TopControls />
        <c_scheduler.DatePicker />
    </Tr>
));
