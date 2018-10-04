//^

"use strict";

import dexie from 'dexie';

export let db;

export const init_db = () => {
    db = new dexie("Clear New Tab");

    db.version(1).stores({
        ed: "id",
        imgs: "id, position_id"
    });
}

init_db();