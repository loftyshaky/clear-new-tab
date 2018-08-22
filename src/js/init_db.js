//^

"use strict";

import dexie from 'dexie';

const db = new dexie("Clear New Tab");

db.version(1).stores({
    ed: "id",
    imgs: "id, position_id"
});

export default db;