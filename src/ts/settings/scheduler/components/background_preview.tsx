import React from 'react';
import { observer } from 'mobx-react';

import { d_scheduler, p_scheduler } from 'settings/internal';

export const BackgroundPreview: React.FunctionComponent<p_scheduler.BackgroundPreview> = observer(
    (props) => {
        const { background_id } = props;
        const background: string = d_scheduler.BackgroundPreview.i().get({ background_id });

        return d_scheduler.BackgroundPreview.i().background_is_color({ background_id }) &&
            background !== d_scheduler.BackgroundPreview.i().placeholder_img_name ? (
            <div className='background_preview color' style={{ backgroundColor: background }} />
        ) : (
            <img className='background_preview img' alt='Background preview' src={background} />
        );
    },
);
