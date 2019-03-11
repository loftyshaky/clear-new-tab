import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

import * as background_loading from 'options/background_loading';

import { Tr } from 'js/components/Tr';

import hourglass_svg from 'svg/hourglass';

export const Loading_screen = observer(() => (
    <Tr
        attr={{
            className: 'loading_screen',
        }}
        tag="div"
        name="gen"
        state={background_loading.ob.show_loading_screen}
    >

        <Svg src={hourglass_svg} />
    </Tr>
));
