import Dexie from 'dexie';

import { i_db } from 'shared_clean/internal';

export class Main extends Dexie {
    public backgrounds: Dexie.Table<i_db.Background, number>;
    public background_thumbnails: Dexie.Table<i_db.BackgroundThumbnail, number>;
    public background_files: Dexie.Table<i_db.BackgroundFile, number>;
    public tasks: Dexie.Table<i_db.Task, number>;
    public alarm_data: Dexie.Table<i_db.AlarmDataItem, number>;
    public custom_code: Dexie.Table<i_db.CustomCode, number>;

    public constructor() {
        super('clear-new-tab');

        this.version(1).stores({
            backgrounds: 'id, i',
            background_thumbnails: 'id',
            background_files: 'id',
            tasks: 'id',
            alarm_data: 'id',
            custom_code: '',
        });

        this.version(2).upgrade(async (tx) => {
            await tx
                .table('backgrounds')
                .toCollection()
                .modify((background) => {
                    background.video_speed = 'global';
                });
        });

        this.backgrounds = this.table('backgrounds');
        this.background_thumbnails = this.table('background_thumbnails');
        this.background_files = this.table('background_files');
        this.tasks = this.table('tasks');
        this.alarm_data = this.table('alarm_data');
        this.custom_code = this.table('custom_code');
    }

    public init_db = (): void =>
        err(() => {
            this.open();

            (this.custom_code as any).add(
                {
                    html: '',
                    css: '',
                    js: '',
                },
                'custom_code',
            );
        }, 'cnt_1323');
}

export const db = new Main();
