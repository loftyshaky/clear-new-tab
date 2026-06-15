import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { c_background, c_home_btn, d_background, type p_new_tab } from 'new_tab/internal';

export const Body: React.FunctionComponent<p_new_tab.Body> = observer((props) => {
    void d_background.Background.background_container_i;

    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    return (
        <>
            <c_home_btn.Body />
            <c_background.BackgrountContainer background_container_i={0} />
            <c_background.BackgrountContainer background_container_i={1} />
        </>
    );
});
