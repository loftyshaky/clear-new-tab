import Dexie from 'dexie';

import { i_db } from 'shared/internal';

export class Main extends Dexie {
    public backgrounds: Dexie.Table<i_db.Background, number>;

    public constructor() {
        super('clear-new-tab');

        this.version(1).stores({
            backgrounds: 'id++, position',
        });

        this.backgrounds = this.table('backgrounds');
    }

    public init_db = (): void =>
        err(() => {
            this.open();
        }, 'cnt_1121');
}

export const db = new Main();
