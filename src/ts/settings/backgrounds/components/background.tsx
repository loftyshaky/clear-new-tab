import React from 'react';
import { observer } from 'mobx-react';

import { p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { key, style, background } = props;

    return (
        <span key={key} className='background' style={style}>
            <img src={background.thumbnail} alt='Background' />
        </span>
    );
});
