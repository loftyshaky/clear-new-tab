import React from 'react';
import { observer } from 'mobx-react';

import { d_scheduler, p_scheduler } from 'settings/internal';

export const BackgroundPreview: React.FunctionComponent<p_scheduler.BackgroundPreview> = observer(
    (props) => {
        const { background_id } = props;
        const background: string = d_scheduler.BackgroundPreview.i().get({ background_id });

        return background.includes('data:') ||
            background === 'scheduler_background_preview_placeholder.png' ? (
            <img className='background_preview img' alt='Background preview' src={background} />
        ) : (
            <div className='background_preview color' style={{ backgroundColor: background }} />
        );
    },
);
