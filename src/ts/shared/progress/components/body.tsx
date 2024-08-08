import React from 'react';
import { observer } from 'mobx-react';

import { d_progress } from 'shared/internal';

export const Progress: React.FunctionComponent = observer(() => (
    <div className={x.cls(['progress_w', d_progress.Visibility.progress_bar_is_visible_cls])}>
        <div className='text'>
            <span className='percentage'>{d_progress.Percentage.percentage}</span>{' '}
            <span className='status'>{d_progress.Status.status_text}</span>
        </div>
        <progress
            className='progress'
            max={d_progress.ProgressVal.progress_max}
            value={d_progress.ProgressVal.progress_val}
        />
    </div>
));
