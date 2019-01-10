//> Loading_screen c

//^

import * as img_loading from 'js/img_loading';
import { Tr } from 'js/Tr';

import hourglass_svg from 'svg/hourglass';

import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

//> Loading_screen c
export const Loading_screen = observer(() => (
    <Tr
        attr={{
            className: 'loading_screen',
        }}
        tag="div"
        name="loading_screen"
        state={img_loading.ob.show_loading_screen}
    >

        <Svg src={hourglass_svg} />
    </Tr>
));
//< Loading_screen c
