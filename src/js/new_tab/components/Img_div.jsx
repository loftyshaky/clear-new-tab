/* eslint-disable jsx-a11y/media-has-caption */

'use_strict';

import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as imgs from 'new_tab/imgs';

export class Img_div extends React.Component {
    constructor(props) {
        super(props);

        ({
            img_divs: this.img_divs,
        } = imgs.ob);
        ({
            img_div_i: this.img_div_i,
        } = this.props);


        this.video = React.createRef();
    }

    componentWillUpdate() {
        const hiding_this_video = this.img_divs.opacity_0_cls[this.img_div_i];

        if (imgs.mut.mode !== 'video' || hiding_this_video) {
            this.video.current.muted = true;

        } else {
            this.video.current.muted = false;
        }
    }

    render() {
        const showing_this_video = !this.img_divs.opacity_0_cls[this.img_div_i];

        return (
            <React.Fragment>
                <div
                    className={x.cls([
                        'img_div',
                        this.img_divs.no_tr_cls[this.img_div_i] ? 'no_tr' : null,
                        this.img_divs.z_index_minus_1_cls[this.img_div_i] ? 'z_index_minus_1' : null,
                        this.img_divs.opacity_0_cls[this.img_div_i] ? 'opacity_0' : null,
                        this.img_divs.is_video[this.img_div_i] ? 'hidden' : null,
                    ])}
                    style={{
                        background: this.img_divs.background[this.img_div_i],
                        backgroundSize: this.img_divs.background_size[this.img_div_i],
                    }}
                />
                <div
                    className={x.cls([
                        'img_div',
                        'video_img_div',
                        this.img_divs.video_background_position_class[this.img_div_i],
                        this.img_divs.no_tr_cls[this.img_div_i] ? 'no_tr' : null,
                        this.img_divs.z_index_minus_1_cls[this.img_div_i] ? 'z_index_minus_1' : null,
                        this.img_divs.opacity_0_cls[this.img_div_i] ? 'opacity_0' : null,
                        this.img_divs.is_video[this.img_div_i] ? null : 'hidden',
                    ])}
                    style={{
                        backgroundColor: this.img_divs.video_background_color[this.img_div_i],
                    }}
                >
                    <video
                        src={imgs.mut.mode === 'video' && showing_this_video ? this.img_divs.background[this.img_div_i] : null}
                        style={{
                            backgroundColor: this.img_divs.video_background_color[this.img_div_i],
                            objectFit: this.img_divs.background_size[this.img_div_i],
                            objectPosition: this.img_divs.video_background_position[this.img_div_i],
                            width: this.img_divs.video_width[this.img_div_i],
                            height: this.img_divs.video_height[this.img_div_i],
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

observer(Img_div);
