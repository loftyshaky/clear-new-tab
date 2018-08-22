//> Imgs c

//^

'use strict';

import x from 'x';
import * as imgs from 'new_tab/imgs';

import react from 'react';
import { observer } from "mobx-react";

//> Imgs c
export let Img_div = props => {
    const img_divs = imgs.ob.img_divs;

    return (
        <react.Fragment>
            <div
                className={x.cls(['img_div', img_divs.no_tr_cls[props.img_div_i] ? 'no_tr' : null, img_divs.z_index_minus_1_cls[props.img_div_i] ? 'z_index_minus_1' : null, img_divs.opacity_0_cls[props.img_div_i] ? 'opacity_0' : null])}
                style={{ background: img_divs.background[props.img_div_i], backgroundSize: img_divs.background_size[props.img_div_i] }}
            ></div>
        </react.Fragment>
    );
}
//< Imgs c

Img_div = observer(Img_div);