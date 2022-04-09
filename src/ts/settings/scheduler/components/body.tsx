import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { Tr } from 'shared/internal';
import { c_scheduler, d_scheduler, s_virtualized_list } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => {
    useEffect(() => {
        s_virtualized_list.VirtualizedList.i().remove_container_tab_index({
            virtualized_list_type: 'tasks',
        });
    }, []);

    useEffect(() => {
        d_scheduler.Val.i().set_add_new_task_btn_ability();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.ui.background_id]);

    return (
        <Tr
            tag='div'
            name='fade'
            cls={x.cls(['scheduler', d_scheduler.Help.i().scheduler_overflow_auto_cls])}
            // eslint-disable-next-line max-len
            state={d_scheduler.Visibility.i().is_visible}
            style={{
                width: x.px(d_scheduler.Dims.i().scheduler_width),
                left: x.px(d_scheduler.Position.i().left),
            }}
        >
            <div>
                <c_scheduler.TopControls />
                <div
                    className={x.cls(['top', d_scheduler.Help.i().scheduler_inner_visibility_cls])}
                >
                    <c_scheduler.BackgroundPreview background_id={data.ui.background_id} />
                    <c_scheduler.DatePicker />
                </div>
            </div>
            <c_scheduler.Tasks />
            <c_scheduler.Help />
        </Tr>
    );
});
