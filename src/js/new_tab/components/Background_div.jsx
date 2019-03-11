/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as backgrounds from 'new_tab/backgrounds';

export class Background_div extends React.Component {
    constructor(props) {
        super(props);

        ({
            background_divs: this.background_divs,
        } = backgrounds.ob);
        ({
            background_div_i: this.background_div_i,
        } = this.props);


        this.video = React.createRef();
    }

    componentDidMount() {
        try {
            document.addEventListener('visibilitychange', this.set_video_volume);

        } catch (er) {
            err(er, 232);
        }
    }

    componentWillUpdate() {
        try {
            this.set_video_volume();

        } catch (er) {
            err(er, 233);
        }
    }

    componentWillUnmount() {
        try {
            document.removeEventListener('visibilitychange', this.set_video_volume);

        } catch (er) {
            err(er, 234);
        }
    }

    set_video_volume = () => {
        try {
            const hiding_this_video = this.background_divs.mute_video[this.background_div_i];

            if (document.hidden || backgrounds.mut.mode !== 'video' || hiding_this_video) {
                this.set_video_volume_inner(true);

            } else {
                this.set_video_volume_inner(false);
            }

        } catch (er) {
            err(er, 235);
        }
    }

    set_video_volume_inner = mute => {
        try {
            if (mute) {
                this.video.current.volume = 0;

            } else {
                this.video.current.volume = this.background_divs.video_volume[this.background_div_i] / 100;
            }

        } catch (er) {
            err(er, 236);
        }
    }

    render() {
        const showing_this_video = !this.background_divs.mute_video[this.background_div_i];

        return (
            <React.Fragment>
                <div
                    className={x.cls([
                        'background_div',
                        this.background_divs.no_tr_cls[this.background_div_i] ? 'no_tr' : null,
                        this.background_divs.z_index_minus_1_cls[this.background_div_i] ? 'z_index_minus_1' : null,
                        this.background_divs.opacity_0_cls[this.background_div_i] ? 'opacity_0' : null,
                        this.background_divs.is_video[this.background_div_i] ? 'hidden' : null,
                        this.background_divs.slide_cls[this.background_div_i],
                    ])}
                    style={{
                        background: this.background_divs.background[this.background_div_i],
                        backgroundSize: this.background_divs.background_size[this.background_div_i],
                    }}
                />
                <div
                    className={x.cls([
                        'background_div',
                        'video_background_div',
                        this.background_divs.video_background_position_class[this.background_div_i],
                        this.background_divs.no_tr_cls[this.background_div_i] ? 'no_tr' : null,
                        this.background_divs.z_index_minus_1_cls[this.background_div_i] ? 'z_index_minus_1' : null,
                        this.background_divs.opacity_0_cls[this.background_div_i] ? 'opacity_0' : null,
                        this.background_divs.is_video[this.background_div_i] ? null : 'hidden',
                        this.background_divs.slide_cls[this.background_div_i],
                    ])}
                    style={{
                        backgroundColor: this.background_divs.video_background_color[this.background_div_i],
                    }}
                >
                    <video
                        src={backgrounds.mut.mode === 'video' && showing_this_video ? this.background_divs.background[this.background_div_i] : null}
                        style={{
                            backgroundColor: this.background_divs.video_background_color[this.background_div_i],
                            objectFit: this.background_divs.background_size[this.background_div_i],
                            objectPosition: this.background_divs.video_background_position[this.background_div_i],
                            width: this.background_divs.video_width[this.background_div_i],
                            height: this.background_divs.video_height[this.background_div_i],
                        }}
                        ref={this.video}
                        loop
                        autoPlay
                    />
                </div>
            </React.Fragment>
        );
    }
}

observer(Background_div);
