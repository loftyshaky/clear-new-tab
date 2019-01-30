'use_strict';

import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as imgs from 'new_tab/imgs';

import { Img_div } from 'new_tab/components/Img_div';

import { Error_boundary } from 'js/components/Error_boundary';

export class All extends React.Component {
    async componentDidMount() {
        try {
            imgs.display_img();

            x.bind(window, 'resize', imgs.resize_img);
            x.bind(document, 'visibilitychange', imgs.resize_img);

        } catch (er) {
            err(er, 56);
        }
    }

    render() {
        return (
            <Error_boundary>
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
            </Error_boundary>
        );
    }
}

observer(All);
