//> render options page ui t

//>1 remove no_tr css t

//^

import 'normalize.css';

import x from 'x';

import React from 'react';
import ReactDOM from 'react-dom';

export const run_everything = async All_type => {
    let All;

    if (!ed) {
        x.error(2, 'error_alert_2');

        const background = await x.get_background();
        await background.set_default_settings('options');
        await x.get_ed();
        await x.send_message_to_background_c({ message: 'load_imgs' });
    }

    switch (All_type) {
        case 'options':
            ({ All } = require('options/components/All')); // eslint-disable-line global-require

            break;

        case 'new_tab':
            ({ All } = require('new_tab/components/All').All); // eslint-disable-line global-require

            break;

        // no default
    }

    //> render options page ui t
    ReactDOM.render(
        <All />,
        s('#root'),
        async () => {
            //>1 remove no_tr css t
            await x.delay(500);

            const no_tr = sb(document.head, '.no_tr');

            if (no_tr) {
                x.remove(no_tr);
            }
            //<1 remove no_tr css t
        },
    );

    x.localize(document);
    //< render options page ui t
};
