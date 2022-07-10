import React from 'react';
import ReactDOM from 'react-dom/client';

import { c_sandbox, d_custom_code } from 'sandbox/internal';

export const init = (): void => {
    const root = document.body.querySelector('.root');

    if (root) {
        ReactDOM.createRoot(root).render(<c_sandbox.Body />);
    }

    window.addEventListener('message', d_custom_code.Msgs.i().listen);
};
