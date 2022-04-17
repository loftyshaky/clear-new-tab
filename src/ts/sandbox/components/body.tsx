import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import { d_custom_code, s_custom_code } from 'sandbox/internal';

export const Body: React.FunctionComponent = observer(() => {
    const sandbox_ref = useRef<any>(null);

    useEffect(() => {
        s_custom_code.Js.i().run({ sandbox_el: sandbox_ref.current });
    });

    return (
        <div className='sandbox' ref={sandbox_ref}>
            <div
                className='html'
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: d_custom_code.Main.i().custom_code.html! }}
            />
            <style type='text/css'>{d_custom_code.Main.i().custom_code.css}</style>
        </div>
    );
});
