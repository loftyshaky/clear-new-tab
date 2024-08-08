import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { d_scheduler, p_scheduler } from 'settings/internal';

export const BackgroundPreview: React.FunctionComponent<p_scheduler.BackgroundPreview> = observer(
    (props) => {
        const { background_id } = props;
        const [background, set_background] = useState('');

        const BackgroundPreviewImg = () =>
            background === '' ? (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
            ) : (
                <img className='background_preview img' alt='Background preview' src={background} />
            );

        useEffect(() => {
            const set_background_2 = (): Promise<void> =>
                err_async(async () => {
                    const background_2: string = await d_scheduler.BackgroundPreview.get({
                        background_id,
                    });

                    set_background(background_2);
                }, 'cnt_1444');

            set_background_2();
        }, [background_id]);

        return d_scheduler.BackgroundPreview.background_is_color({ background_id }) &&
            background !== d_scheduler.BackgroundPreview.placeholder_img ? (
            <div className='background_preview color' style={{ backgroundColor: background }} />
        ) : (
            <BackgroundPreviewImg />
        );
    },
);
