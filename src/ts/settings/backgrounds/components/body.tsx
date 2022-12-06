import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Collection } from 'react-virtualized';

import {
    c_settings,
    c_backgrounds,
    c_pagination,
    d_backgrounds,
    d_dnd,
    d_pagination,
    d_virtualized_list,
    s_virtualized_list,
} from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => {
    d_backgrounds.Dnd.i().collection_ref = useRef<any>(null);

    const CollectionAny = Collection as any;
    const { width, height } = d_backgrounds.VirtualizedList.i();
    const { drop_zone_item, drop_zone_insert_direction } = d_dnd.Main.i(); // drop_zone_item and drop_zone_insert_direction need to be here and in useEffect, otherwise drop zone and backgrounds render with incorrect width
    const { page_backgrounds } = d_pagination.Page.i();
    const {
        scroll_backgrounds_virtualized_list_to_top,
        scroll_backgrounds_virtualized_list_to_bottom,
    } = d_virtualized_list.Main.i();

    useEffect(() => {
        s_virtualized_list.Main.i().remove_container_tab_index({
            virtualized_list_type: 'backgrounds',
        });
    }, []);

    useEffect(() => {
        d_backgrounds.Dnd.i().collection_ref.current.recomputeCellSizesAndPositions();

        d_virtualized_list.Main.i().set_backgrounds_scroll_position({ position: 'top' });
        d_virtualized_list.Main.i().set_backgrounds_scroll_position({ position: 'bottom' });
    }, [
        width,
        height,
        drop_zone_item,
        drop_zone_insert_direction,
        scroll_backgrounds_virtualized_list_to_top,
        scroll_backgrounds_virtualized_list_to_bottom,
    ]);

    return (
        <div className='sections custom backgrounds'>
            <c_settings.Section section_name='backgrounds'>
                <CollectionAny
                    cellCount={page_backgrounds.length}
                    cellRenderer={({ index, key, style }: any) => (
                        <c_backgrounds.Background
                            key={key}
                            index={index}
                            style={style}
                            background={page_backgrounds[index]}
                            dragged={false}
                        />
                    )}
                    cellSizeAndPositionGetter={
                        d_backgrounds.VirtualizedList.i().cell_size_and_position_getter
                    }
                    width={d_backgrounds.VirtualizedList.i().width}
                    height={d_backgrounds.VirtualizedList.i().height}
                    ref={d_backgrounds.Dnd.i().collection_ref}
                />
                <c_backgrounds.DraaggedBackground />
                <c_pagination.Body />
            </c_settings.Section>
        </div>
    );
});
