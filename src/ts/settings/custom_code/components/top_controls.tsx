import type { JSX } from 'react';

import { observer } from 'mobx-react-lite';

import { c_inputs, type o_inputs } from '@loftyshaky/shared/inputs';
import { d_custom_code } from 'settings/internal';

export const TopControls: React.FunctionComponent = observer(() => (
    <div className='top_controls'>
        {Object.values(d_custom_code.TopControls.top_controls).map(
            (top_control: o_inputs.IconBtn): JSX.Element => (
                <c_inputs.IconBtn key={top_control.name} input={top_control} />
            ),
        )}
    </div>
));
