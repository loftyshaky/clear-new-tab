import React from 'react';
import { observer } from 'mobx-react';

import { p_backgrounds } from 'settings/internal';

export const DropZone: React.FunctionComponent<p_backgrounds.DropZone> = observer((props) => {
    const { style } = props;

    return <div className='drop_zone' style={{ ...style }} />;
});
