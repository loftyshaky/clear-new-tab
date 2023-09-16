import React from 'react';
import { observer } from 'mobx-react';

import { d_backgrounds, p_backgrounds } from 'settings/internal';

export const ThumbnailW: React.FunctionComponent<p_backgrounds.ThumbnailW> = observer((props) => {
    const { background_id, children } = props;

    return (
        <div className='thumbnail_w'>
            <div
                className='color'
                style={{
                    backgroundColor:
                        d_backgrounds.Cache.i().access_prop_of_background_thumbnail_cache_item({
                            background_id,
                            key: 'placeholder_color',
                        }) as string | undefined,
                }}
            />
            {children}
        </div>
    );
});
