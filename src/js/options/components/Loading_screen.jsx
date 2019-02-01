'use_strict';

import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

import * as img_loading from 'options/img_loading';

import { Tr } from 'js/Tr';

import hourglass_svg from 'svg/hourglass';

export const Loading_screen = observer(() => (
    <Tr
        attr={{
            className: 'loading_screen',
        }}
        tag="div"
        name="gen"
        state={img_loading.ob.show_loading_screen}
    >

        <Svg src={hourglass_svg} />
    </Tr>
));
