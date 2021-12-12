import React, { useEffect, MouseEvent } from 'react';
import { observer } from 'mobx-react';

import { stop_propagation } from '@loftyshaky/shared';
import { svg, i_db } from 'shared/internal';
import { c_backgrounds, d_backgrounds, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { key, index, style, background, dragged } = props;

    useEffect(() => {
        d_backgrounds.BackgroundAnimation.i().push_already_animated_id({ id: background.id });
    }, [background]);

    return (background as any).type === 'drop_zone' ? (
        <div
            key={key}
            className='drop_zone'
            style={style}
            role='none'
            onMouseUp={d_backgrounds.Dnd.i().drop}
        />
    ) : (
        <span
            key={key}
            className={x.cls([
                'background',
                background.type,
                d_backgrounds.BackgroundAnimation.i().animated_cls({ id: background.id }),
                d_backgrounds.BackgroundDeletion.i().deleted_cls({
                    id: background.id,
                }),
                d_backgrounds.Dnd.i().dragged_cls({
                    dragged,
                }),
                d_backgrounds.Dnd.i().cursor_default_cls,
            ])}
            style={{ ...style, backgroundColor: background.thumbnail }}
        >
            {background.type.includes('color') ? undefined : (
                <img
                    src={background.thumbnail}
                    alt='Background'
                    draggable='false'
                    style={{ width: style.width, height: style.height }}
                />
            )}
            <div
                className={x.cls([
                    'ui',
                    d_backgrounds.CurrentBackground.i().selected_cls({ id: background.id }),
                ])}
                role='none'
                tabIndex={-1}
                onClick={(): void => {
                    d_backgrounds.CurrentBackground.i().select({ background });
                }}
                onMouseDown={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.i().start_drag({ background_to_move: background }, e);
                }}
                onMouseMove={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.i().create_drop_zone(
                        { background_hovering_over: background },
                        e,
                    );
                }}
            >
                <c_backgrounds.OverlayItemInfo name='background_index' text={index + 1} />
                {background.type.includes('color') ? undefined : (
                    <c_backgrounds.OverlayItemInfo
                        name='background_dims'
                        text={`${(background as i_db.FileBackground).width}x${
                            (background as i_db.FileBackground).height
                        }`}
                    />
                )}
                <c_backgrounds.OverlayItemInfo
                    name='background_type'
                    text={ext.msg(`background_type_${background.type}_text`)}
                />
                <c_backgrounds.OverlayItemBtn
                    name='preview_background'
                    text={ext.msg('preview_background_btn_text')}
                    on_click={stop_propagation}
                />
                <c_backgrounds.OverlayItemBtn
                    name='move_background'
                    text={ext.msg('move_background_btn_text')}
                    on_click={stop_propagation}
                />
                <button
                    className={x.cls([
                        'btn',
                        'delete_background_btn',
                        d_backgrounds.Dnd.i().pointer_events_none_cls,
                    ])}
                    onClick={(e: MouseEvent): void => {
                        d_backgrounds.BackgroundDeletion.i().trigger_delete(
                            { id: background.id },
                            e,
                        );
                    }}
                    type='button'
                >
                    <svg.Close />
                </button>
            </div>
        </span>
    );
});
