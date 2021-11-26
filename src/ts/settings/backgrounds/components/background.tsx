import React from 'react';
import { observer } from 'mobx-react';

import { c_backgrounds, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { key, index, style, background } = props;

    return (
        <span key={key} className='background' style={style}>
            <img src={background.thumbnail} alt='Background' />
            <c_backgrounds.OverlayItemInfo name='background_index' text={index + 1} />
            <div className='bottom_overlay_items'>
                <c_backgrounds.OverlayItemInfo
                    name='background_dims'
                    text={`${background.width}x${background.height}`}
                />
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
