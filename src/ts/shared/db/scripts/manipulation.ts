import { db, d_backgrounds, i_db } from 'shared/internal';

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

    public get_backgrounds = (): Promise<i_db.Background[]> =>
        err_async(async () => {
            const backgrounds: i_db.Background[] = await db.backgrounds.toArray();
            const backgrounds_sorted = d_backgrounds.Main.i().sort_backgrounds({
                backgrounds,
            });

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

    public update_background = ({ background }: { background: i_db.Background }): Promise<void> =>
        err_async(async () => {
            await db.backgrounds.update(background.id as any, background);
        }, 'cnt_56461');

    public update_backgrounds = ({
        backgrounds,
    }: {
        backgrounds: i_db.Background[];
    }): Promise<void> =>
        err_async(async () => {
            await db.transaction('rw', db.backgrounds, db.background_files, async () => {
                await Promise.all(
                    backgrounds.map(
                        async (background: i_db.Background): Promise<void> =>
                            err_async(async () => {
                                await db.backgrounds.update(background.id as any, background);
                            }, 'cnt_45678'),
                    ),
                );
            });
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

    public clear_all_tables = (): Promise<void> =>
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
}
