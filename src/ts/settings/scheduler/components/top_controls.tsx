import React from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs } from '@loftyshaky/shared/inputs';
import { d_scheduler } from 'settings/internal';

export const TopControls: React.FunctionComponent<any> = observer(() => (
    <div className='top_controls'>
        {Object.values(d_scheduler.TopControls.i().top_controls).map(
            (top_control: o_inputs.IconBtn): JSX.Element => (
                <c_inputs.IconBtn input={top_control} />
            ),
        )}
    </div>
));
