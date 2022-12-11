import React, { MouseEvent } from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs } from '@loftyshaky/shared/inputs';
import { svg } from 'shared/internal';
import { c_dnd, c_scheduler, d_dnd, d_scheduler, p_scheduler } from 'settings/internal';

export const Task: React.FunctionComponent<p_scheduler.Task> = observer((props) => {
    const { task, style, dragged } = props;
    const height: string = '78px';

    return (task as any).type === 'drop_zone' ? (
        <c_dnd.DropZone
            style={{ height }}
            on_mouse_up={(): void => {
                d_dnd.Main.i().drop({ move_by_move_btn: false });
            }}
        />
    ) : (
        <div
            className={x.cls([
                'task',
                d_scheduler.TaskAnimation.i().animated_cls({
                    id: task.id,
                }),
                d_scheduler.TaskDeletion.i().deleted_cls({
                    id: task.id,
                }),
                d_dnd.Main.i().dragged_item_cls({
                    dragged,
                }),
                d_dnd.Main.i().cursor_default_cls,
            ])}
            role='none'
            title={d_scheduler.Tasks.i().developer_info({ task })}
            style={{
                ...style,
                height,
            }}
            onMouseDown={(e: MouseEvent): void => {
                d_scheduler.TaskDnd.i().start_drag({ task_to_move: task }, e);
            }}
            onMouseMove={(e: MouseEvent): void => {
                d_scheduler.TaskDnd.i().create_drop_zone({ hovering_over_task: task }, e);
            }}
        >
            <div className={x.cls(['date_w', d_dnd.Main.i().pointer_events_none_cls])}>
                <span className='date'>{d_scheduler.Tasks.i().generate_date({ task })}</span>
                <c_inputs.IconBtn
                    input={
                        new o_inputs.IconBtn({
                            name: 'delete_task_btn',
                            Svg: svg.Close,
                            event_callback: (): void => {
                                d_scheduler.TaskDeletion.i().trigger_delete({
                                    id: task.id,
                                });
                            },
                        })
                    }
                />
            </div>
            <c_scheduler.BackgroundPreview background_id={task.background_id} />
        </div>
    );
});
