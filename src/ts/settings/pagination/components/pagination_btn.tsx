import React from 'react';
import { observer } from 'mobx-react';

import { d_pagination, p_pagination } from 'settings/internal';

export const PaginationBtn: React.FunctionComponent<p_pagination.PaginationBtn> = observer(
    (props) => {
        const { name, on_click_page, page_btn_content, is_active, is_disabled } = props;

        return (
            <button
                className={x.cls([
                    'btn',
                    'pagination_btn',
                    d_pagination.Page.page_is_active_cls({ is_active }),
                    d_pagination.Page.page_is_disabled_cls({ is_disabled }),
                ])}
                type='button'
                title={ext.msg(`${name}_title`)}
                disabled={is_active || is_disabled}
                onClick={() => {
                    d_pagination.Page.change({ page: on_click_page });
                }}
                onKeyDown={() => undefined}
            >
                {page_btn_content}
            </button>
        );
    },
);
