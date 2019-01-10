//^

import Dexie from 'dexie';

export let db; // eslint-disable-line import/no-mutable-exports

export const init_db = () => {
    db = new Dexie('Clear New Tab');

    db.version(1).stores({
        ed: 'id',
        imgs: 'id, position_id',
    });
};

init_db();
