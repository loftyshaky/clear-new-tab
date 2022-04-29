import React from 'react';
import { Observer, observer } from 'mobx-react';
import { List, AutoSizer } from 'react-virtualized';

import { c_scheduler, d_scheduler } from 'settings/internal';

export const Tasks: React.FunctionComponent = observer(() => {
    const ListAny = List as any;
    const AutoSizerAny = AutoSizer as any;

    return (
        <div className={x.cls(['tasks', d_scheduler.Help.i().scheduler_inner_visibility_cls])}>
            <AutoSizerAny>
                {({ height, width }: any) => (
                    <Observer>
                        {() => (
                            <ListAny
                                width={width}
                                height={height}
                                rowCount={d_scheduler.Tasks.i().tasks.length}
                                rowHeight={d_scheduler.Dims.i().task_height}
                                rowRenderer={({ index, key, style }: any) => (
                                    <c_scheduler.Task
                                        index={index}
                                        key={key}
                                        style={style}
                                        task={d_scheduler.Tasks.i().tasks[index]}
                                        dragged={false}
                                    />
                                )}
                            />
                        )}
                    </Observer>
                )}
            </AutoSizerAny>
            <c_scheduler.DraaggedTask />
        </div>
    );
});
