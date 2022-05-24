import React from 'react';
import { observer } from 'mobx-react';

import { p_dnd } from 'settings/internal';

export const DropZone: React.FunctionComponent<p_dnd.DropZone> = observer((props) => {
    const { style, on_mouse_up } = props;

    return <div className='drop_zone' style={style} role='none' onMouseUp={on_mouse_up} />;
});
