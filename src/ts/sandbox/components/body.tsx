import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useRef } from 'react';

import { d_custom_code, s_custom_code } from 'sandbox/internal';

export const Body: React.FunctionComponent = observer(() => {
    const sandbox_ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        s_custom_code.Js.run({ sandbox_el: sandbox_ref.current });
    });

    return (
        <div className='sandbox' ref={sandbox_ref}>
            <div
                className='html'
                dangerouslySetInnerHTML={{
                    __html: d_custom_code.CustomCode.custom_code.html
                        ? d_custom_code.CustomCode.custom_code.html
                        : '',
                }}
            />
            <style type='text/css'>{d_custom_code.CustomCode.custom_code.css}</style>
        </div>
    );
});
