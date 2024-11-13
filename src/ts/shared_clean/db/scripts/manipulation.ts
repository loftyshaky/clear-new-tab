import chunk from 'lodash/chunk';

import { db, s_custom_code, s_i, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public save_backgrounds = ({
        backgrounds,
        background_thumbnails,
        background_files,
    }: {
        backgrounds: i_db.Background[];
        background_thumbnails: i_db.BackgroundThumbnail[];
        background_files: i_db.BackgroundFile[];
    }): Promise<void> =>
        err_async(async () => {
            const chunk_size: number = 10;
            let d_progress_ref: any;

            if (page === 'settings') {
                const { d_progress } = await import('shared/internal');

                d_progress_ref = d_progress;
            }

            await db.transaction(
                'rw',
                db.backgrounds,
                db.background_thumbnails,
                db.background_files,
                async (): Promise<void> => {
                    let i: number = 0;
                    const backgrounds_chunked = chunk(backgrounds, chunk_size);
                    const background_thumbnails_chunked = chunk(background_thumbnails, chunk_size);
                    const background_files_chunked = chunk(background_files, chunk_size);

                    // eslint-disable-next-line no-restricted-syntax
                    for await (const backgrounds_chunked_chunk of backgrounds_chunked) {
                        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
                        backgrounds_chunked_chunk;

                        await db.backgrounds.bulkAdd(backgrounds_chunked[i]);
                        await db.background_thumbnails.bulkAdd(background_thumbnails_chunked[i]);
                        await db.background_files.bulkAdd(background_files_chunked[i]);

                        if (n(d_progress_ref)) {
                            d_progress_ref.ProgressVal.increment_progress({
                                increment_amount: backgrounds_chunked[i].length,
                            });
                        }

                        i += 1;
                    }
                },
            );
        }, 'cnt_1324');

    public save_tasks = ({ tasks }: { tasks: i_db.Task[] }): Promise<void> =>
        err_async(async () => {
            await db.tasks.bulkAdd(tasks);
        }, 'cnt_1325');

    public save_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): Promise<void> =>
        err_async(async () => {
            await (db.custom_code as any).update('custom_code', custom_code);
        }, 'cnt_1326');

    public replace_alarm_data = ({
        alarm_data,
    }: {
        alarm_data: i_db.AlarmDataItem[];
    }): Promise<void> =>
        err_async(async () => {
            await db.transaction('rw', db.alarm_data, async () => {
                await db.alarm_data.clear();

                await db.alarm_data.bulkAdd(alarm_data);
            });
        }, 'cnt_1327');

    public get_backgrounds = (): Promise<i_db.Background[]> =>
        err_async(async () => {
            const backgrounds: i_db.Background[] = await db.backgrounds.toArray();
            const backgrounds_sorted = s_i.I.sort_by_i_ascending({
                data: backgrounds,
            }) as i_db.Background[];

            return backgrounds_sorted;
        }, 'cnt_1328');

    public get_background_thumbnails = (): Promise<i_db.BackgroundThumbnail[]> =>
        err_async(async () => {
            const backgrounds_thumbnails: i_db.BackgroundThumbnail[] =
                await db.background_thumbnails.toArray();

            return backgrounds_thumbnails;
        }, 'cnt_1329');

    public get_background_files = (): Promise<i_db.BackgroundFile[]> =>
        err_async(async () => {
            const backgrounds: i_db.BackgroundFile[] = await db.background_files.toArray();

            return backgrounds;
        }, 'cnt_1330');

    public get_background = ({ id }: { id: string | number }): Promise<i_db.Background> =>
        err_async(async () => {
            const background: i_db.Background = await (db.backgrounds.get as any)(id);

            return background;
        }, 'cnt_1331');

    public get_background_thumbnail = ({ id }: { id: string }): Promise<i_db.BackgroundThumbnail> =>
        err_async(async () => {
            const background_thumbnail: i_db.BackgroundThumbnail = await (
                db.background_thumbnails.get as any
            )(id);

            return background_thumbnail;
        }, 'cnt_1332');

    public get_background_file = ({ id }: { id: string | number }): Promise<i_db.BackgroundFile> =>
        err_async(async () => {
            const background_file: i_db.BackgroundFile = await (db.background_files.get as any)(id);

            return background_file;
        }, 'cnt_1333');

    public get_tasks = (): Promise<i_db.Task[]> =>
        err_async(async () => {
            const tasks: i_db.Task[] = await db.tasks.toArray();

            const tasks_sorted = s_i.I.sort_by_i_ascending({
                data: tasks,
            }) as i_db.Task[];

            return tasks_sorted;
        }, 'cnt_1334');

    public get_alarm_data = (): Promise<i_db.AlarmDataItem[]> =>
        err_async(async () => db.alarm_data.toArray(), 'cnt_1335');

    public get_custom_code = (): Promise<i_db.CustomCode> =>
        err_async(async () => {
            const custom_code: i_db.CustomCode = await (db.custom_code as any).get('custom_code');

            return custom_code;
        }, 'cnt_1336');

    public update_background = ({ background }: { background: i_db.Background }): Promise<void> =>
        err_async(async () => {
            await db.backgrounds.update(background.id as any, background);
        }, 'cnt_1337');

    public update_task = ({ task }: { task: i_db.Task }): Promise<void> =>
        err_async(async () => {
            await db.tasks.update(task.id as any, task);
        }, 'cnt_1338');

    public delete_background = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            await db.transaction(
                'rw',
                db.backgrounds,
                db.background_thumbnails,
                db.background_files,
                async () => {
                    await db.backgrounds.delete(id as any);
                    await db.background_thumbnails.delete(id as any);
                    await db.background_files.delete(id as any);
                },
            );
        }, 'cnt_1339');

    public delete_backgrounds = ({ ids }: { ids: string[] }): Promise<void> =>
        err_async(async () => {
            await db.transaction(
                'rw',
                db.backgrounds,
                db.background_thumbnails,
                db.background_files,
                async () => {
                    await db.backgrounds.bulkDelete(ids as any);
                    await db.background_thumbnails.bulkDelete(ids as any);
                    await db.background_files.bulkDelete(ids as any);
                },
            );
        }, 'cnt_1340');

    public delete_task = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            await db.tasks.delete(id as any);
        }, 'cnt_1341');

    public delete_tasks = ({ ids }: { ids: string[] }): Promise<void> =>
        err_async(async () => {
            await db.tasks.bulkDelete(ids as any);
        }, 'cnt_1342');

    public clear_all_background_tables = (): Promise<void> =>
        err_async(async () => {
            await db.transaction(
                'rw',
                db.backgrounds,
                db.background_thumbnails,
                db.background_files,
                async () => {
                    await db.backgrounds.clear();
                    await db.background_thumbnails.clear();
                    await db.background_files.clear();
                },
            );
        }, 'cnt_1343');

    public clear_task_table = (): Promise<void> =>
        err_async(async () => {
            await db.tasks.clear();
        }, 'cnt_1344');

    public reset_custom_code_table = (): Promise<void> =>
        err_async(async () => {
            await this.save_custom_code({
                custom_code: s_custom_code.CustomCode.default_custom_code,
            });
        }, 'cnt_1345');
}

export const Manipulation = Class.get_instance();
