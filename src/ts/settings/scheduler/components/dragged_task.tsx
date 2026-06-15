import { observer } from 'mobx-react-lite';

import { c_scheduler, d_dnd, d_scheduler } from 'settings/internal';
import { Tr } from 'shared/internal';
import type { i_db } from 'shared_clean/internal';

export const DraaggedTask: React.FunctionComponent = observer(() => (
    <Tr tag='div' name='fade' cls='dragged_task' state={d_dnd.Dnd.show_dragged_background}>
        {d_dnd.Dnd.drag_type === 'task' && n(d_dnd.Dnd.item_to_move) ? (
            <c_scheduler.Task
                index={0}
                style={{
                    width: d_scheduler.Dims.task_width,
                    height: d_scheduler.Dims.task_height,
                    left: x.px(d_dnd.Dnd.dragged_background_left),
                    top: x.px(d_dnd.Dnd.dragged_background_top),
                }}
                task={d_dnd.Dnd.item_to_move as i_db.Task}
                dragged
            />
        ) : undefined}
    </Tr>
));
