import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { t } from '@loftyshaky/shared';
import {
    c_background,
    d_background,
    s_background,
    p_background,
    i_background,
} from 'new_tab/internal';

export const BackgrountContainer: React.FunctionComponent<p_background.BackgrountContainer> =
    observer((props) => {
        // eslint-disable-next-line no-unused-expressions
        d_background.VideoPlayback.i().is_playing;

        const video_el_ref = useRef<any>(null);
        const repeated_video_el_refs = useRef<any>([]);

        useEffect(() => {
            const video_els = [video_el_ref.current, ...repeated_video_el_refs.current].filter(
                (item): boolean => err(() => n(item), 'cnt_1393'),
            );

            s_background.VideoPlayback.i().set_video_speed({
                video_speed,
                video_els,
            });
            s_background.VideoPlayback.i().set_video_volume({
                video_volume,
                video_els,
            });

            s_background.VideoPlayback.i().play_or_pause_current_video({
                play_status: 'pause',
                background_container_i,
                video_els,
                is_visible_video_comparison_bool: false,
            });

            if (d_background.VideoPlayback.i().is_playing) {
                s_background.VideoPlayback.i().play_or_pause_current_video({
                    play_status: 'play',
                    background_container_i,
                    video_els,
                });
            } else {
                s_background.VideoPlayback.i().play_or_pause_current_video({
                    play_status: 'pause',
                    background_container_i,
                    video_els,
                });
            }
        });

        const { background_container_i } = props;
        const background: string = d_background.Main.i().background[background_container_i];
        const background_size: string =
            d_background.BackgroundSize.i().background_size[background_container_i];
        const background_position: string =
            d_background.Main.i().background_position[background_container_i];
        const background_repeat: string =
            d_background.Main.i().background_repeat[background_container_i];
        const color_of_area_around_background: string =
            d_background.Main.i().color_of_area_around_background[background_container_i];
        const video_speed: number = d_background.Main.i().video_speed[background_container_i];
        const video_volume: number = d_background.Main.i().video_volume[background_container_i];
        const background_css: t.AnyRecord = toJS(
            d_background.Main.i().background_css[background_container_i],
        );
        const video_background_css: t.AnyRecord = toJS(
            d_background.Main.i().get_video_background_css({
                background_container_i,
            }),
        );
        const video_repeat_positions: i_background.Position[] = toJS(
            d_background.VideoReapeat.i().video_repeat_positions[background_container_i],
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

        return _.isEmpty(background_css) ? null : (
            <>
                <div
                    className={x.cls([
                        'background_container',
                        background_position,
                        z_index_plus_1_cls,
                        video_no_tr_cls,
                        video_is_visible_cls,
                        d_background.Classes.i().videos_load_video_is_visible_cls,
                        background_is_sliding_cls,
                    ])}
                    style={{
                        backgroundColor: color_of_area_around_background,
                    }}
                >
                    {s_background.Type.i().is_video({
                        background_container_i,
                    }) ? (
                        <>
                            {data.settings.enable_video_repeat &&
                            background_size === 'none' && // none = dont_resize
                            background_repeat.includes('repeat') ? undefined : (
                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                <video
                                    src={background}
                                    style={video_background_css}
                                    loop
                                    ref={video_el_ref}
                                />
                            )}
                            {data.settings.enable_video_repeat ? (
                                <c_background.RepeatedVideos
                                    background={background}
                                    video_repeat_positions={video_repeat_positions}
                                    repeated_video_el_refs={repeated_video_el_refs}
                                />
                            ) : undefined}
                        </>
                    ) : undefined}
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
