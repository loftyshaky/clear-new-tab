//> render options page ui t

//>1 remove no_tr css t

//^

'use strict';

import 'normalize.css';

import x from 'x';

import react from 'react';
import react_dom from 'react-dom';

export const run_everything = async All_type => {
    let All;

    if (!ed) {
        x.error(2);

        const background = await x.get_background();
        await background.set_default_settings('options');
        await x.get_ed();
    }

    switch (All_type) {
        case 'options':
            All = require('options_components/All').All;

            break;

        case 'new_tab':
            All = require('new_tab_components/All').All;

            break;
    }

    //> render options page ui t
    react_dom.render(
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
        }
    );

    x.localize(document);
    //< render options page ui t
}