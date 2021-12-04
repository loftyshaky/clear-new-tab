import React from 'react';
import { observer } from 'mobx-react';

import { i_db } from 'shared/internal';
import { c_backgrounds, d_backgrounds, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { key, index, style, background } = props;

    return (
        <span
            key={key}
            className={x.cls([
                'background',
                d_backgrounds.CurrentBackground.i().selected_cls({ id: background.id }),
            ])}
            style={{ ...style, backgroundColor: background.thumbnail }}
            role='button'
            tabIndex={-1}
            onClick={(): void => {
                d_backgrounds.CurrentBackground.i().select({ background });
            }}
            onKeyDown={() => undefined}
        >
            {background.type.includes('color') ? undefined : (
                <img
                    src={background.thumbnail}
                    alt='Background'
                    style={{ width: style.width, height: style.height }}
                />
            )}
            <c_backgrounds.OverlayItemInfo name='background_index' text={index + 1} />
            <div className='bottom_overlay_items'>
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
                    on_click={(): undefined => undefined}
                />
                <c_backgrounds.OverlayItemBtn
                    name='move_background'
                    text={ext.msg('move_background_btn_text')}
                    on_click={(): undefined => undefined}
                />
            </div>
        </span>
    );
});
