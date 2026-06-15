import { observer } from 'mobx-react-lite';

import { c_inputs } from '@loftyshaky/shared/inputs';
import { d_scheduler } from 'settings/internal';

export const DatePicker: React.FunctionComponent = observer(() => (
    <div className='date_picker'>
        <c_inputs.SectionContent inputs={d_scheduler.DatePicker.inputs} />
    </div>
));
