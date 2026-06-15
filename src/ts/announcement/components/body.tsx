import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { c_announcement } from '@loftyshaky/shared/announcement';
import type { p_announcement } from 'announcement/internal';

export const Body: React.FunctionComponent<p_announcement.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return <c_announcement.Body />;
});
