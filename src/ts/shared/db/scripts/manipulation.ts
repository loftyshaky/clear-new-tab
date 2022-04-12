import { db, s_i, i_db } from 'shared/internal';

export class Manipulation {
    private static i0: Manipulation;

    public static i(): Manipulation {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
            await db.transaction(
                'rw',
                db.backgrounds,
                db.background_thumbnails,
                db.background_files,
                async (): Promise<void> => {
                    await db.backgrounds.bulkAdd(backgrounds);
                    await db.background_thumbnails.bulkAdd(background_thumbnails);
                    await db.background_files.bulkAdd(background_files);
                },
            );
        }, 'cnt_64358');

    public save_tasks = ({ tasks }: { tasks: i_db.Task[] }): Promise<void> =>
        err_async(async () => {
            await db.tasks.bulkAdd(tasks);
        }, 'cnt_64358');

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
        }, 'cnt_64358');

    public get_backgrounds = (): Promise<i_db.Background[]> =>
        err_async(async () => {
            const backgrounds: i_db.Background[] = await db.backgrounds.toArray();
            const backgrounds_sorted = s_i.Main.i().sort_by_i_ascending({
                data: backgrounds,
            }) as i_db.Background[];

            return backgrounds_sorted;
        }, 'cnt_94527');

    public get_background_thumbnails = (): Promise<i_db.BackgroundThumbnail[]> =>
        err_async(async () => {
            const backgrounds_thumbnails: i_db.BackgroundThumbnail[] =
                await db.background_thumbnails.toArray();

            return backgrounds_thumbnails;
        }, 'cnt_54256');

    public get_background_files = (): Promise<i_db.BackgroundFile[]> =>
        err_async(async () => {
            const backgrounds: i_db.BackgroundFile[] = await db.background_files.toArray();

            return backgrounds;
        }, 'cnt_54256');

    public get_background = ({ id }: { id: string }): Promise<i_db.Background> =>
        err_async(async () => {
            const background: i_db.Background = await (db.backgrounds.get as any)(id);

            return background;
        }, 'cnt_57438');

    public get_background_thumbnail = ({ id }: { id: string }): Promise<i_db.BackgroundThumbnail> =>
        err_async(async () => {
            const background_thumbnail: i_db.BackgroundThumbnail = await (
                db.background_thumbnails.get as any
            )(id);

            return background_thumbnail;
        }, 'cnt_89376');

    public get_background_file = ({ id }: { id: string }): Promise<i_db.BackgroundFile> =>
        err_async(async () => {
            const background_file: i_db.BackgroundFile = await (db.background_files.get as any)(id);

            return background_file;
        }, 'cnt_89376');

    public get_tasks = (): Promise<i_db.Task[]> =>
        err_async(async () => {
            const tasks: i_db.Task[] = await db.tasks.toArray();

            const tasks_sorted = s_i.Main.i().sort_by_i_ascending({
                data: tasks,
            }) as i_db.Task[];

            return tasks_sorted;
        }, 'cnt_94527');

    public get_alarm_data = (): Promise<i_db.AlarmDataItem[]> =>
        err_async(async () => db.alarm_data.toArray(), 'cnt_94527');

    public update_background = ({ background }: { background: i_db.Background }): Promise<void> =>
        err_async(async () => {
            await db.backgrounds.update(background.id as any, background);
        }, 'cnt_56461');

    public update_task = ({ task }: { task: i_db.Task }): Promise<void> =>
        err_async(async () => {
            await db.tasks.update(task.id as any, task);
        }, 'cnt_56461');

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
        }, 'cnt_94527');

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
        }, 'cnt_94584');

    public delete_task = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            await db.tasks.delete(id as any);
        }, 'cnt_94527');

    public delete_tasks = ({ ids }: { ids: string[] }): Promise<void> =>
        err_async(async () => {
            await db.tasks.bulkDelete(ids as any);
        }, 'cnt_94584');

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
        }, 'cnt_74365');

    public clear_task_table = (): Promise<void> =>
        err_async(async () => {
            await db.tasks.clear();
        }, 'cnt_74645');
}
