import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_dependencies } from '@loftyshaky/shared/dependencies';
import { p_dependencies } from 'dependencies/internal';

export const Body: React.FunctionComponent<p_dependencies.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return <c_dependencies.Body />;
});
