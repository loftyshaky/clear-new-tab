import type { JSX } from 'react';

import { observer } from 'mobx-react-lite';

import { d_background, type i_background, type p_background } from 'new_tab/internal';

export const RepeatedVideos: React.FunctionComponent<p_background.RepeatedVideos> = observer(
    (props_2) => {
        const { background, video_repeat_positions, repeated_video_el_refs } = props_2;

        return (
            <>
                {video_repeat_positions.map(
                    (video_repeat_position: i_background.Position, i: number): JSX.Element => {
                        return (
                            <video
                                key={d_background.VideoReapeat.generate_repeat_position_react_key({
                                    video_repeat_position,
                                })}
                                className='repeated_video'
                                src={background}
                                style={video_repeat_position}
                                loop
                                onLoadedData={
                                    d_background.VideoReapeat.increment_loaded_videos_count
                                }
                                ref={(el: HTMLVideoElement) => {
                                    repeated_video_el_refs.current[i] = el;
                                }}
                            >
                                <track kind='captions' />
                            </video>
                        );
                    },
                )}
            </>
        );
    },
);
