import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useRef } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { t } from '@loftyshaky/shared/shared';
import {
    c_background,
    d_background,
    s_background,
    p_background,
    i_background,
} from 'new_tab/internal';

export const BackgrountContainer: React.FunctionComponent<p_background.BackgrountContainer> =
    observer((props) => {
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        d_background.VideoPlayback.is_playing;

        const video_el_ref = useRef<any>(null);
        const repeated_video_el_refs = useRef<any>([]);

        useEffect(() => {
            const video_els = [video_el_ref.current, ...repeated_video_el_refs.current].filter(
                (item): boolean => err(() => n(item), 'cnt_1393'),
            );

            s_background.VideoPlayback.set_video_speed({
                video_speed,
                video_els,
            });
            s_background.VideoPlayback.set_video_volume({
                video_volume,
                video_els,
            });

            s_background.VideoPlayback.play_or_pause_current_video({
                play_status: 'pause',
                background_container_i,
                video_els,
                video_speed,
                is_visible_video_comparison_bool: false,
            });

            if (d_background.VideoPlayback.is_playing) {
                s_background.VideoPlayback.play_or_pause_current_video({
                    play_status: 'play',
                    background_container_i,
                    video_els,
                    video_speed,
                });
            } else {
                s_background.VideoPlayback.play_or_pause_current_video({
                    play_status: 'pause',
                    background_container_i,
                    video_els,
                    video_speed,
                });
            }
        });

        const { background_container_i } = props;
        const background: string = d_background.Background.background[background_container_i];
        const background_size: string =
            d_background.BackgroundSize.background_size[background_container_i];
        const background_position: string =
            d_background.Background.background_position[background_container_i];
        const background_repeat: string =
            d_background.Background.background_repeat[background_container_i];
        const color_of_area_around_background: string =
            d_background.Background.color_of_area_around_background[background_container_i];
        const video_speed: number = d_background.Background.video_speed[background_container_i];
        const video_volume: number = d_background.Background.video_volume[background_container_i];
        const background_css: t.AnyRecord = toJS(
            d_background.Background.background_css[background_container_i],
        );
        const video_background_css: t.AnyRecord = toJS(
            d_background.Background.get_video_background_css({
                background_container_i,
            }),
        );
        const video_repeat_positions: i_background.Position[] = toJS(
            d_background.VideoReapeat.video_repeat_positions[background_container_i],
        );
        const z_index_plus_1_cls: string =
            d_background.Classes.z_index_plus_1_cls[background_container_i];
        const img_no_tr_cls: string = d_background.Classes.img_no_tr_cls[background_container_i];
        const img_is_visible_cls: string =
            d_background.Classes.img_is_visible_cls[background_container_i];
        const video_no_tr_cls: string =
            d_background.Classes.video_no_tr_cls[background_container_i];
        const video_is_visible_cls: string =
            d_background.Classes.video_is_visible_cls[background_container_i];
        const background_is_sliding_cls: string =
            d_background.Classes.background_is_sliding_cls[background_container_i];
        const background_is_no_effect_cls: string =
            d_background.Classes.background_is_no_effect_cls[background_container_i];

        return isEmpty(background_css) ? null : (
            <>
                <div
                    className={x.cls([
                        'background_container',
                        background_position,
                        z_index_plus_1_cls,
                        video_no_tr_cls,
                        video_is_visible_cls,
                        d_background.Classes.videos_load_video_is_visible_cls,
                        background_is_sliding_cls,
                        background_is_no_effect_cls,
                    ])}
                    style={{
                        backgroundColor: color_of_area_around_background,
                    }}
                >
                    {s_background.Type.is_video({
                        background_container_i,
                    }) ? (
                        <>
                            {data.settings.prefs.enable_video_repeat &&
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
                            {data.settings.prefs.enable_video_repeat ? (
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
                        background_is_no_effect_cls,
                    ])}
                    style={background_css}
                />
            </>
        );
    });
