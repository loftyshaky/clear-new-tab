import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { t } from '@loftyshaky/shared';
import { d_background, p_background } from 'new_tab/internal';

export const BackgrountContainer: React.FunctionComponent<p_background.BackgrountContainer> =
    observer((props) => {
        const { background_container_i } = props;
        const background: string = d_background.Main.i().background[background_container_i];
        const background_position: string =
            d_background.Main.i().background_position[background_container_i];
        const color_of_area_around_background: string =
            d_background.Main.i().color_of_area_around_background[background_container_i];
        const background_css: t.AnyRecord = toJS(
            d_background.Main.i().background_css[background_container_i],
        );
        const video_background_css: t.AnyRecord = toJS(
            d_background.Main.i().get_video_background_css({
                background_container_i,
            }),
        );
        const z_index_plus_1_cls: string =
            d_background.Classes.i().z_index_plus_1_cls[background_container_i];
        const img_no_tr_cls: string =
            d_background.Classes.i().img_no_tr_cls[background_container_i];
        const img_is_visible_cls: string =
            d_background.Classes.i().img_is_visible_cls[background_container_i];
        const video_no_tr_cls: string =
            d_background.Classes.i().video_no_tr_cls[background_container_i];
        const video_is_visible_cls: string =
            d_background.Classes.i().video_is_visible_cls[background_container_i];
        const background_is_sliding_cls: string =
            d_background.Classes.i().background_is_sliding_cls[background_container_i];

        return (
            <>
                <div
                    className={x.cls([
                        'background_container',
                        background_position,
                        z_index_plus_1_cls,
                        video_no_tr_cls,
                        video_is_visible_cls,
                        background_is_sliding_cls,
                    ])}
                    style={{
                        backgroundColor: color_of_area_around_background,
                    }}
                >
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video src={background} style={video_background_css} loop autoPlay />
                </div>
                <div
                    className={x.cls([
                        'background_container',
                        z_index_plus_1_cls,
                        img_no_tr_cls,
                        img_is_visible_cls,
                        background_is_sliding_cls,
                    ])}
                    style={background_css}
                />
            </>
        );
    });
