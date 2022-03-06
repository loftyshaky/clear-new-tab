import React, { MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { o_inputs, c_inputs } from '@loftyshaky/shared/inputs';

import { Tr } from 'shared/internal';
import { d_backgrounds, c_backgrounds, p_backgrounds } from 'settings/internal';

export const Actions: React.FunctionComponent<p_backgrounds.Actions> = observer((props) => {
    const { background } = props;

    return (
        <c_backgrounds.OverlayItemBtn
            name='actions'
            cls={d_backgrounds.Actions.i().is_opened({ background_id: background.id })}
            text={ext.msg('actions_btn_text')}
            on_click={(e: MouseEvent): void => {
                d_backgrounds.Actions.i().change_visibility({ background_id: background.id }, e);
            }}
        >
            <Tr
                tag='div'
                name='fade'
                cls='action_btns_w'
                // eslint-disable-next-line max-len
                state={d_backgrounds.Actions.i().is_visible({ background_id: background.id })}
            >
                <c_inputs.Btn
                    input={
                        new o_inputs.Btn({
                            name: 'preview_background',
                            event_callback: () => undefined,
                        })
                    }
                />
                <hr />
                <c_inputs.Btn
                    input={
                        new o_inputs.Btn({
                            name: 'move_background',
                            event_callback: (): void => {
                                d_backgrounds.Dnd.i().move_by_move_btn({ background });
                            },
                        })
                    }
                />
                <hr />
                <c_inputs.Btn
                    input={
                        new o_inputs.Btn({
                            name: 'copy_background_id',
                            event_callback: () => undefined,
                        })
                    }
                />
            </Tr>
        </c_backgrounds.OverlayItemBtn>
    );
});
