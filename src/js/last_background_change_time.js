import { db } from 'js/init_db';

export const update_last_background_change_time = async () => {
    try {
        const time = new Date().getTime();

        await db.ed.update(1, { last_background_change_time: time });

    } catch (er) {
        err(er, 12, null, true);
    }
};
