import React from 'react';
import { Observer, observer } from 'mobx-react';
import { List, AutoSizer } from 'react-virtualized';

import { c_scheduler, d_scheduler } from 'settings/internal';

export const Tasks: React.FunctionComponent = observer(() => (
    <div className='tasks'>
        <AutoSizer>
            {({ height, width }) => (
                <Observer>
                    {() => (
                        <List
                            width={width}
                            height={height}
                            rowCount={d_scheduler.Tasks.i().tasks.length}
                            rowHeight={d_scheduler.Dims.i().task_height}
                            rowRenderer={({ index, key, style }) => (
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
        </AutoSizer>
        <c_scheduler.DraaggedTask />
    </div>
));
