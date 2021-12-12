import React from 'react';
import { observer } from 'mobx-react';

import { Tr } from 'shared/internal';
import { c_backgrounds, d_backgrounds } from 'settings/internal';

export const DraaggedBackgrounds: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='dragged_background'
        // eslint-disable-next-line max-len
        state={d_backgrounds.Dnd.i().show_dragged_background}
    >
        {n(d_backgrounds.Dnd.i().background_to_move) ? (
            <c_backgrounds.Background
                key={0}
                index={0}
                style={{
                    width: x.px(
                        d_backgrounds.Dnd.i().dragged_background_dim({
                            dim: 'width',
                        }),
                    ),
                    height: x.px(
                        d_backgrounds.Dnd.i().dragged_background_dim({
                            dim: 'height',
                        }),
                    ),
                    left: x.px(d_backgrounds.Dnd.i().dragged_background_left),
                    top: x.px(d_backgrounds.Dnd.i().dragged_background_top),
                }}
                background={d_backgrounds.Dnd.i().background_to_move!}
                dragged
            />
        ) : undefined}
    </Tr>
));
