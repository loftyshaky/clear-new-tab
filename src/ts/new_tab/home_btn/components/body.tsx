import { observer } from 'mobx-react-lite';

import { d_home_btn, s_home_btn } from 'new_tab/internal';
import { svg } from 'shared/internal';

export const Body: React.FunctionComponent = observer(() =>
    d_home_btn.HomeBtn.show_home_btn ? (
        <a
            className={x.cls(['home_btn', d_home_btn.Position.position])}
            title={ext.msg('go_to_home_page_title')}
            aria-label='Home button'
            style={{ display: 'none' }}
            tabIndex={0}
            onClick={s_home_btn.HomeBtn.open_default_new_tab_page}
        >
            <svg.Home />
        </a>
    ) : null,
);
