import React from 'react';
import { observer } from 'mobx-react';

import { stop_propagation } from '@loftyshaky/shared';
import { d_backgrounds, p_backgrounds } from 'settings/internal';

export const OverlayItemBtn: React.FunctionComponent<p_backgrounds.OverlayItemBtn> = observer(
    (props) => {
        const { name, text, cls, on_click, children } = props;

        return (
            <div
                className={x.cls([
                    'overlay_item',
                    'btn',
                    name,
                    d_backgrounds.Dnd.i().pointer_events_none_cls,
                    cls,
                ])}
                role='button'
                tabIndex={-1}
                onClick={on_click}
                onMouseDown={stop_propagation}
                onKeyDown={() => undefined}
            >
                {text}
                {children}
            </div>
        );
    },
);
