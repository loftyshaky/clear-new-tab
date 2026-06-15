import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { c_dependencies } from '@loftyshaky/shared/dependencies';
import type { p_dependencies } from 'dependencies/internal';

export const Body: React.FunctionComponent<p_dependencies.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return <c_dependencies.Body />;
});
