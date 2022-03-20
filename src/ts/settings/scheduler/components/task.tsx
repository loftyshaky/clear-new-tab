import React from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs } from '@loftyshaky/shared/inputs';
import { svg } from 'shared/internal';
import { c_scheduler, d_scheduler, p_scheduler } from 'settings/internal';

export const Task: React.FunctionComponent<p_scheduler.Task> = observer((props) => {
    const { key, style, task } = props;

    return (
        <div
            key={key}
            className='task'
            style={{
                ...style,
                height: '78px',
            }}
        >
            <div className='date_w'>
                <span className='date'>{d_scheduler.Tasks.i().generate_date({ task })}</span>
                <c_inputs.IconBtn
                    input={
                        new o_inputs.IconBtn({
                            name: 'delete_task_btn',
                            Svg: svg.Close,
                            event_callback: () => undefined,
                        })
                    }
                />
            </div>
            <c_scheduler.BackgroundPreview background_id={task.background_id} />
        </div>
    );
});
