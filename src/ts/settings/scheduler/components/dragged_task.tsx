import React from 'react';
import { observer } from 'mobx-react';

import { i_db } from 'shared_clean/internal';
import { Tr } from 'shared/internal';
import { c_scheduler, d_dnd, d_scheduler } from 'settings/internal';

export const DraaggedTask: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='dragged_task'
        // eslint-disable-next-line max-len
        state={d_dnd.Main.i().show_dragged_background}
    >
        {d_dnd.Main.i().drag_type === 'task' && n(d_dnd.Main.i().item_to_move) ? (
            <c_scheduler.Task
                index={0}
                style={{
                    width: d_scheduler.Dims.i().task_width,
                    height: d_scheduler.Dims.i().task_height,
                    left: x.px(d_dnd.Main.i().dragged_background_left),
                    top: x.px(d_dnd.Main.i().dragged_background_top),
                }}
                task={d_dnd.Main.i().item_to_move as i_db.Task}
                dragged
            />
        ) : undefined}
    </Tr>
));
