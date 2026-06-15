import { observer } from 'mobx-react-lite';

import { d_scheduler } from 'settings/internal';

export const Help: React.FunctionComponent = observer(() => (
    <div className={x.cls(['scheduler_help', d_scheduler.Help.help_visibility_cls])}>
        {ext.msg('scheduler_help_text')}
    </div>
));
