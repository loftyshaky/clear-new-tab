import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_announcement } from '@loftyshaky/shared/announcement';
import { p_announcement } from 'announcement/internal';

export const Body: React.FunctionComponent<p_announcement.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return (
        <c_announcement.Body>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: ext.msg(`msg_to_user_${env.browser}_text`) }} />
        </c_announcement.Body>
    );
});
