import { observer } from 'mobx-react-lite';

import { d_protecting_screen } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => (
    <div className={x.cls(['protecting_screen', d_protecting_screen.Visibility.visibility_cls])} />
));
