import React from 'react';
import { observer } from 'mobx-react';
import { c_background, c_home_btn, d_background } from 'new_tab/internal';

export const Body: React.FunctionComponent = observer(() => {
    // eslint-disable-next-line no-unused-expressions
    d_background.Main.i().background_container_i;

    return (
        <>
            <c_home_btn.Body />
            <c_background.BackgrountContainer background_container_i={0} />
            <c_background.BackgrountContainer background_container_i={1} />
        </>
    );
});
