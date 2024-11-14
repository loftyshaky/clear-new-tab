import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import {
    c_settings,
    c_backgrounds,
    c_pagination,
    d_backgrounds,
    d_pagination,
    d_scrollable,
    s_scrollable,
} from 'settings/internal';
import { i_db } from 'shared_clean/internal';

export const Body: React.FunctionComponent = observer(() => {
    d_backgrounds.Dnd.collection_ref = useRef<any>(null);

    const { height } = d_backgrounds.Scrollable;
    const { page_backgrounds, page } = d_pagination.Page;
    const { scroll_backgrounds_scrollable_to_top, scroll_backgrounds_scrollable_to_bottom } =
        d_scrollable.Scrollable;

    useEffect(() => {
        d_backgrounds.Scrollable.calculate_height();
        s_scrollable.Scrollable.set_scroll_position({
            scrollable_type: 'backgrounds',
            position: scroll_backgrounds_scrollable_to_top ? 'top' : 'bottom',
        });
    }, [
        height,
        page,
        scroll_backgrounds_scrollable_to_top,
        scroll_backgrounds_scrollable_to_bottom,
    ]);

    return (
        <div className='sections custom backgrounds'>
            <c_settings.Section section_name='backgrounds'>
                <div className='scrollable' style={{ height: d_backgrounds.Scrollable.height }}>
                    {page_backgrounds.map((background: i_db.Background, i: number) => (
                        <c_backgrounds.Background
                            key={d_backgrounds.Backgrounds.key({ background_id: background.id })}
                            index={i}
                            background={background}
                            dragged={false}
                        />
                    ))}
                </div>
                <c_pagination.Body />
            </c_settings.Section>
        </div>
    );
});
