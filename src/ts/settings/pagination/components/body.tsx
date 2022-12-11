import React from 'react';
import { observer } from 'mobx-react';

import { c_pagination, d_pagination, p_pagination } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => (
    <div className={x.cls(['pagination', d_pagination.Page.i().pagination_visibility_cls])}>
        {d_pagination.Main.i().pagination_btns.map(
            (page: p_pagination.PaginationBtn, i: number): JSX.Element => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <c_pagination.PaginationBtn key={i} {...page} />
            ),
        )}
    </div>
));
