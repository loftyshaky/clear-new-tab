import React from 'react';
import { observer } from 'mobx-react';
import Pagination from 'react-js-pagination';

import { svg, d_pagination } from 'shared/internal';

export const Body: React.FunctionComponent = observer(() => (
    <div className='pagination_w'>
        <Pagination
            activePage={d_pagination.Page.i().page}
            itemsCountPerPage={data.settings.backgrounds_per_page}
            totalItemsCount={d_pagination.Main.i().total_backgrounds}
            itemClass='btn pagination_btn'
            prevPageText={<svg.NavigateBefore />}
            nextPageText={<svg.NavigateNext />}
            firstPageText={<svg.FirstPage />}
            lastPageText={<svg.LastPage />}
            onChange={d_pagination.Page.i().change}
        />
    </div>
));
