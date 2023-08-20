import { s_db, i_db } from 'shared/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public reset_val: number = 0;
    private last_current_background_id: string | number = Infinity;
    public current_background: i_db.Background | undefined;
    public current_background_file: i_db.BackgroundFile | undefined;

    public set_current_background_data = ({
        current_background_id,
    }: {
        current_background_id: string | number;
    }): Promise<void> =>
        err_async(async () => {
            if (current_background_id !== this.last_current_background_id) {
                this.last_current_background_id = current_background_id;

                const background: i_db.Background = await s_db.Manipulation.i().get_background({
                    id: current_background_id,
                });
                const background_file: i_db.BackgroundFile =
                    await s_db.Manipulation.i().get_background_file({
                        id: current_background_id,
                    });

                background_file.background = URL.createObjectURL(
                    // URL.createObjectURL can't be called in service worker
                    (background_file as i_db.BackgroundFile).background as File,
                );

                this.current_background = background;
                this.current_background_file = background_file;
            }
        }, 'cnt_1473');
}
