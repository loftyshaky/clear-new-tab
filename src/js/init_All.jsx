'use_strict';

import React from 'react';
import ReactDOM from 'react-dom';

import x from 'x';

import 'normalize.css';

export const run_everything = async All_type => {
    try {
        let All;

        switch (All_type) {
            case 'options':
                ({ All } = require('options/components/All')); // eslint-disable-line global-require

                break;

            case 'new_tab':
                ({ All } = require('new_tab/components/All')); // eslint-disable-line global-require

                break;

            // no default
        }

        //> render options page ui
        ReactDOM.render(
            <All />,
            s('#root'),
            async () => {
                try {
                    //>1 remove no_tr css
                    await x.delay(500);

                    const no_tr = sb(document.head, '.no_tr');

                    if (no_tr) {
                        x.remove(no_tr);
                    }
                    //<1 remove no_tr css

                } catch (er) {
                    err(er, 170);
                }
            },
        );

        x.localize(document);
        //< render options page ui

    } catch (er) {
        err(er, 169);
    }
};
