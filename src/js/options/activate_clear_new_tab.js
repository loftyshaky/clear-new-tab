import { db } from 'js/init_db';

export const activate_clear_new_tab = async () => {
    try {
        await db.ed.update(1, { premium: true });

    } catch (er) {
        err(er, 308);
    }
};
