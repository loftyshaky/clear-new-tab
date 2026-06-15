import type { JSX } from 'react';

import { observer } from 'mobx-react-lite';

import { c_pagination, d_pagination, type p_pagination } from 'settings/internal';
export const Body: React.FunctionComponent = observer(() => {
    return (
        <div className={x.cls(['pagination', d_pagination.Page.pagination_visibility_cls])}>
            {d_pagination.Pagination.pagination_btns.map(
                (pagination_btn: p_pagination.PaginationBtn): JSX.Element => (
                    <c_pagination.PaginationBtn
                        key={pagination_btn.page_btn_content}
                        {...pagination_btn}
                    />
                ),
            )}
        </div>
    );
});
