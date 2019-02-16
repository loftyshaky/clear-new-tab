'use_strict';

import Dexie from 'dexie';

export let db; // eslint-disable-line import/no-mutable-exports

export const init_db = () => {
    try {
        db = new Dexie('Clear New Tab');

        db.version(1).stores({
            ed: 'id',
            imgs: 'id',
            imgsd: 'id, position_id',
        });

    } catch (er) {
        err(er, 171);
    }
};

init_db();
