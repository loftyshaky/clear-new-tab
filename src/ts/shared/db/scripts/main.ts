import Dexie from 'dexie';

import { i_db } from 'shared/internal';

export class Main extends Dexie {
    public backgrounds: Dexie.Table<i_db.Background, number>;
    public background_thumbnails: Dexie.Table<i_db.BackgroundThumbnail, number>;
    public background_files: Dexie.Table<i_db.BackgroundFile, number>;
    public tasks: Dexie.Table<i_db.Task, number>;
    public alarm_data: Dexie.Table<i_db.AlarmDataItem, number>;

    public constructor() {
        super('clear-new-tab');

        this.version(1).stores({
            backgrounds: 'id, i',
            background_thumbnails: 'id',
            background_files: 'id',
            tasks: 'id',
            alarm_data: 'id',
        });

        this.backgrounds = this.table('backgrounds');
        this.background_thumbnails = this.table('background_thumbnails');
        this.background_files = this.table('background_files');
        this.tasks = this.table('tasks');
        this.alarm_data = this.table('alarm_data');
    }

    public init_db = (): void =>
        err(() => {
            this.open();
        }, 'cnt_1121');
}

export const db = new Main();
