import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { svg, i_db } from 'shared/internal';
import { c_backgrounds, d_backgrounds, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { key, index, style, background } = props;

    useEffect(() => {
        d_backgrounds.BackgroundAnimation.i().push_already_animated_id({ id: background.id });
    }, [background]);

    return (
        <span
            key={key}
            className={x.cls([
                'background',
                background.type,
                d_backgrounds.BackgroundAnimation.i().animated_cls({ id: background.id }),
                d_backgrounds.BackgroundDeletion.i().deleted_cls({
                    id: background.id,
                }),
            ])}
            style={{ ...style, backgroundColor: background.thumbnail }}
        >
            <div
                className={x.cls([
                    'screen',
                    d_backgrounds.CurrentBackground.i().selected_cls({ id: background.id }),
                ])}
                onClick={(): void => {
                    d_backgrounds.CurrentBackground.i().select({ background });
                }}
                role='none'
                tabIndex={-1}
            />
            {background.type.includes('color') ? undefined : (
                <img
                    src={background.thumbnail}
                    alt='Background'
                    style={{ width: style.width, height: style.height }}
                />
            )}
            <c_backgrounds.OverlayItemInfo name='background_index' text={index + 1} />
            <div className={x.cls(['bottom_overlay_items', 'info'])}>
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
            </div>
            <div className={x.cls(['bottom_overlay_items', 'btn'])}>
                <c_backgrounds.OverlayItemBtn
                    name='preview_background'
                    text={ext.msg('preview_background_btn_text')}
                    on_click={(): undefined => undefined}
                />
                <c_backgrounds.OverlayItemBtn
                    name='move_background'
                    text={ext.msg('move_background_btn_text')}
                    on_click={(): undefined => undefined}
                />
            </div>
            <button
                className={x.cls(['btn', 'delete_background_btn'])}
                onClick={(): void => {
                    d_backgrounds.BackgroundDeletion.i().trigger_delete({ id: background.id });
                }}
                type='button'
            >
                <svg.Close />
            </button>
        </span>
    );
});
