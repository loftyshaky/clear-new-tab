import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Collection } from 'react-virtualized';

import {
    c_settings,
    c_backgrounds,
    d_backgrounds,
    d_dnd,
    s_virtualized_list,
} from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => {
    d_backgrounds.Dnd.i().collection_ref = useRef<any>(null);
    const { width, height } = d_backgrounds.VirtualizedList.i();
    const { drop_zone_item, drop_zone_insert_direction } = d_dnd.Main.i(); // drop_zone_item and drop_zone_insert_direction need to be here and in useEffect, otherwise drop zone and backgrounds render with incorrect width
    const { backgrounds } = d_backgrounds.Main.i();

    useEffect(() => {
        s_virtualized_list.VirtualizedList.i().remove_container_tab_index({
            virtualized_list_type: 'backgrounds',
        });
    }, []);

    useEffect(() => {
        d_backgrounds.Dnd.i().collection_ref.current.recomputeCellSizesAndPositions();
    }, [backgrounds, width, height, drop_zone_item, drop_zone_insert_direction]);

    return (
        <div className='sections custom backgrounds'>
            <c_settings.Section section_name='backgrounds'>
                <Collection
                    cellCount={d_backgrounds.Main.i().backgrounds.length}
                    cellRenderer={({ index, key, style }) => (
                        <c_backgrounds.Background
                            key={key}
                            index={index}
                            style={style}
                            background={d_backgrounds.Main.i().backgrounds[index]}
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
            </c_settings.Section>
        </div>
    );
});
