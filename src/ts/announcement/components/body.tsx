import React from 'react';
import { observer } from 'mobx-react';

import { c_announcement } from '@loftyshaky/shared/announcement';

export const Body: React.FunctionComponent = observer(() => (
    <c_announcement.Body>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: ext.msg(`msg_to_user_${env.browser}_text`) }} />
    </c_announcement.Body>
));
