import React from 'react';
import { observer } from 'mobx-react';

import * as imgs from 'new_tab/imgs';

import { Img_div } from 'new_tab/components/Img_div';

export class All extends React.Component {
    async componentDidMount() {
        imgs.display_img();

        window.addEventListener('resize', imgs.resize_img);
        document.addEventListener('visibilitychange', imgs.resize_img);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', imgs.resize_img);
        document.removeEventListener('visibilitychange', imgs.resize_img);
    }

    render() {
        return (
            <div className="all">
                {
                    imgs.ob.img_divs.no_tr_cls.map((not_used, i) => (
                        <Img_div
                            img_div_i={i}
                            key={imgs.ob.img_divs.keys[i]}
                        />
                    ))
                }
            </div>
        );
    }
}

observer(All);
