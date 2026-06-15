import { observer } from 'mobx-react-lite';

import { c_backgrounds, d_backgrounds, d_dnd } from 'settings/internal';
import { Tr } from 'shared/internal';
import type { i_db } from 'shared_clean/internal';

export const DraaggedBackground: React.FunctionComponent = observer(() => (
    <Tr tag='div' name='fade' cls='dragged_background' state={d_dnd.Dnd.show_dragged_background}>
        {d_dnd.Dnd.drag_type === 'background' && n(d_dnd.Dnd.item_to_move) ? (
            <c_backgrounds.Background
                index={0}
                style={{
                    width: x.px(
                        d_backgrounds.Dnd.dragged_background_dim({
                            dim: 'width',
                        }),
                    ),
                    height: x.px(
                        d_backgrounds.Dnd.dragged_background_dim({
                            dim: 'height',
                        }),
                    ),
                    left: x.px(d_dnd.Dnd.dragged_background_left),
                    top: x.px(d_dnd.Dnd.dragged_background_top),
                }}
                background={d_dnd.Dnd.item_to_move as i_db.Background}
                dragged
            />
        ) : undefined}
    </Tr>
));
