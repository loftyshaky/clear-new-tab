import React from 'react';
import { render } from 'react-dom';

import { c_sandbox, d_custom_code } from 'sandbox/internal';

export const init = (): void => {
    render(<c_sandbox.Body />, document.body.querySelector('.root'));

    window.addEventListener('message', d_custom_code.Msgs.i().listen);
};
