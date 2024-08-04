import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Virtuoso } from 'react-virtuoso';

import { c_scheduler, d_scheduler, d_scrollable } from 'settings/internal';
import { i_db } from 'shared_clean/internal';

export const Tasks: React.FunctionComponent = observer(() => (
    <div className={x.cls(['tasks', d_scheduler.Help.i().scheduler_inner_visibility_cls])}>
        <Virtuoso
            className='scrollable'
            style={{ height: '100%' }}
            increaseViewportBy={600}
            data={toJS(d_scheduler.Tasks.i().tasks)}
            itemContent={(i: number, task: i_db.Task) => (
                <c_scheduler.Task index={i} key={task.id} task={task} dragged={false} />
            )}
            totalListHeightChanged={async () => {
                await x.delay(200);

                d_scrollable.Main.i().set_scroll_position({
                    scrollable_type: 'tasks',
                    position: 'bottom',
                });
            }}
            components={{
                Footer: () => <div className='padding_bottom' />,
            }}
        />
        <c_scheduler.DraaggedTask />
    </div>
));
