import React from 'react';
import { observer } from 'mobx-react';

import { svg } from 'shared/internal';
import { d_home_btn, s_home_btn } from 'new_tab/internal';

export const Body: React.FunctionComponent = observer(() =>
    data.settings.home_btn_is_visible ? (
        <a
            className={x.cls(['home_btn', d_home_btn.Position.i().position])}
            href='chrome://new-tab-page'
            title={ext.msg('go_to_home_page_title')}
            style={{ display: 'none' }}
            tabIndex={0}
            onClick={s_home_btn.Main.i().open_default_new_tab_page}
        >
            <svg.Home />
        </a>
    ) : null,
);
