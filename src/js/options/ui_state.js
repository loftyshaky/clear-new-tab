'use_strict';

import x from 'x';

export const enable_ui = () => {
    try {
        x.remove(s('.ui_disabled'));

    } catch (er) {
        err(er, 166);
    }
};

export const disable_ui = () => {
    try {
        x.load_css('ui_disabled');

    } catch (er) {
        err(er, 167);
    }
};
