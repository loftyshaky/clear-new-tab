import React from 'react';
import { observer } from 'mobx-react';

import { p_backgrounds } from 'settings/internal';

export const OverlayItemBtn: React.FunctionComponent<p_backgrounds.OverlayItemBtn> = observer(
    (props) => {
        const { name, text, on_click } = props;

        return (
            <div
                className={x.cls(['overlay_item', 'btn', name])}
                role='button'
                tabIndex={-1}
                onClick={on_click}
                onKeyDown={() => undefined}
            >
                {text}
            </div>
        );
    },
);
