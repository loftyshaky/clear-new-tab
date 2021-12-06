import React from 'react';
import { observer } from 'mobx-react';

import { p_backgrounds } from 'settings/internal';

export const OverlayItemInfo: React.FunctionComponent<p_backgrounds.OverlayItemInfo> = observer(
    (props) => {
        const { name, text } = props;

        return <span className={x.cls(['overlay_item', 'info', name])}>{text}</span>;
    },
);
