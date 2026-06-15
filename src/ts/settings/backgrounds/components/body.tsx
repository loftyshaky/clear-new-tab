import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import {
    c_backgrounds,
    c_pagination,
    c_settings,
    d_backgrounds,
    d_pagination,
    d_scrollable,
    s_scrollable,
} from 'settings/internal';
import type { i_db } from 'shared_clean/internal';

export const Body: React.FunctionComponent = observer(() => {
    const scrollable_ref = useRef<HTMLDivElement>(null);
    const { height } = d_backgrounds.Scrollable;
    const { page_backgrounds, page } = d_pagination.Page;
    const { scroll_backgrounds_scrollable_to_top, scroll_backgrounds_scrollable_to_bottom } =
        d_scrollable.Scrollable;

    useEffect(() => {
        void height;
        void page;
        void scroll_backgrounds_scrollable_to_bottom;

        d_backgrounds.Scrollable.calculate_height({
            auto_scroll_enabled: s_scrollable.Scrollable.auto_scroll_enabled,
        });
        s_scrollable.Scrollable.set_scroll_position({
            scrollable_type: 'backgrounds',
            position: scroll_backgrounds_scrollable_to_top ? 'top' : 'bottom',
        });

        if (
            n(scrollable_ref.current) &&
            n(d_scrollable.Scrollable.set_scroll_position_resize_observer)
        ) {
            d_scrollable.Scrollable.set_scroll_position_resize_observer.observe(
                scrollable_ref.current,
            );
        }
    }, [
        height,
        page,
        scroll_backgrounds_scrollable_to_top,
        scroll_backgrounds_scrollable_to_bottom,
    ]);

    return (
        <div className='sections custom backgrounds'>
            <c_settings.Section section_name='backgrounds'>
                <div
                    className='scrollable'
                    style={{ height: d_backgrounds.Scrollable.height }}
                    ref={scrollable_ref}
                >
                    {page_backgrounds.map((background: i_db.Background, i: number) => (
                        <c_backgrounds.Background
                            key={d_backgrounds.Backgrounds.key({
                                background_id: background.id,
                            })}
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
