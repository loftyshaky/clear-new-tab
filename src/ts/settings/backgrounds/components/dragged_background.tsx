import React from 'react';
import { observer } from 'mobx-react';

import { Tr, i_db } from 'shared/internal';
import { c_backgrounds, d_backgrounds, d_dnd } from 'settings/internal';

export const DraaggedBackground: React.FunctionComponent = observer(() => (
    <Tr
        tag='div'
        name='fade'
        cls='dragged_background'
        // eslint-disable-next-line max-len
        state={d_dnd.Main.i().show_dragged_background}
    >
        {d_dnd.Main.i().drag_type === 'background' && n(d_dnd.Main.i().item_to_move) ? (
            <c_backgrounds.Background
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
                    left: x.px(d_dnd.Main.i().dragged_background_left),
                    top: x.px(d_dnd.Main.i().dragged_background_top),
                }}
                background={d_dnd.Main.i().item_to_move as i_db.Background}
                dragged
            />
        ) : undefined}
    </Tr>
));
