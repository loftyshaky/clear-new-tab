import React from 'react';
import { observer } from 'mobx-react';

import { d_dnd, p_backgrounds } from 'settings/internal';

export const OverlayItemBtn: React.FunctionComponent<p_backgrounds.OverlayItemBtn> = observer(
    (props) => {
        const { name, text, cls, on_click, children } = props;

        return (
            <div
                className={x.cls([
                    'overlay_item',
                    'btn',
                    name,
                    d_dnd.Dnd.pointer_events_none_cls,
                    cls,
                ])}
                role='button'
                tabIndex={0}
                onClick={on_click}
                onKeyDown={() => undefined}
            >
                {text}
                {children}
            </div>
        );
    },
);
