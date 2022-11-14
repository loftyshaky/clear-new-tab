import React from 'react';
import { observer } from 'mobx-react';
import { d_background, p_background, i_background } from 'new_tab/internal';

export const RepeatedVideos: React.FunctionComponent<p_background.RepeatedVideos> = observer(
    (props_2) => {
        const { background, video_repeat_positions, repeated_video_el_refs } = props_2;

        return (
            <>
                {video_repeat_positions.map(
                    (video_repeat_position: i_background.Position, i: number): JSX.Element => (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                            key={i}
                            className='repeated_video'
                            src={background}
                            style={video_repeat_position}
                            loop
                            onLoadedData={
                                d_background.VideoReapeat.i().increment_loaded_videos_count
                            }
                            ref={(el: HTMLVideoElement) => {
                                repeated_video_el_refs.current[i] = el;
                            }}
                        />
                    ),
                )}
            </>
        );
    },
);
