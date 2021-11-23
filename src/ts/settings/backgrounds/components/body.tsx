import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Collection } from 'react-virtualized';

import { c_settings, d_backgrounds } from 'settings/internal';

export const Backgrounds: React.FunctionComponent = observer(() => {
    const collection_ref = useRef<any>(null);
    const { width, height } = d_backgrounds.VirtualizedList.i();

    useEffect(() => {
        collection_ref.current.recomputeCellSizesAndPositions();
    }, [width, height]);

    return (
        <div className='sections custom backgrounds'>
            <c_settings.Section section_name='backgrounds'>
                <Collection
                    cellCount={d_backgrounds.Main.i().backgrounds.length}
                    cellRenderer={({ index, key, style }) => (
                        <span key={key} className='background' style={style}>
                            <img
                                src={d_backgrounds.Main.i().backgrounds[index].thumbnail}
                                alt='Background'
                            />
                        </span>
                    )}
                    cellSizeAndPositionGetter={
                        d_backgrounds.VirtualizedList.i().cell_size_and_position_getter
                    }
                    width={d_backgrounds.VirtualizedList.i().width}
                    height={d_backgrounds.VirtualizedList.i().height}
                    ref={collection_ref}
                />
            </c_settings.Section>
        </div>
    );
});
