import { s_data, s_db, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reset_val: number = 0;
    private background_file: i_db.BackgroundFile | undefined;
    private last_current_background_id: string | number | undefined = Infinity;
    private previous_current_background_id: string | number | undefined = Infinity;
    public current_background: i_db.Background | undefined;
    public current_background_file: i_db.BackgroundFile | undefined;
    private previous_obj_url: string | File | undefined;

    public set_current_background_data = ({
        current_background_id,
        force,
    }: {
        current_background_id: string | number | undefined;
        force: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (current_background_id !== this.last_current_background_id || force) {
                if (n(current_background_id)) {
                    this.last_current_background_id = current_background_id;
                }

                let background: i_db.Background | undefined;
                let background_file: i_db.BackgroundFile | undefined;
                let obj_url: string | undefined;

                if (n(current_background_id)) {
                    background = await s_db.Manipulation.get_background({
                        id: current_background_id,
                    });
                    background_file = await s_db.Manipulation.get_background_file({
                        id: current_background_id,
                    });
                }

                if (
                    n(background_file) &&
                    typeof background_file.background !== 'string' &&
                    n(current_background_id) &&
                    current_background_id !== this.previous_current_background_id
                ) {
                    obj_url = URL.createObjectURL(
                        // URL.createObjectURL can't be called in service worker
                        (background_file as i_db.BackgroundFile).background as File,
                    );
                    background_file.background = obj_url;
                    this.background_file = background_file;
                }

                this.current_background = background;
                this.current_background_file = this.background_file;

                if (data.switched_from_randm_solid_color_mode) {
                    s_data.Manipulation.switched_from_randm_solid_color_mode = false;
                } else if (
                    n(current_background_id) &&
                    this.previous_current_background_id !== Infinity &&
                    current_background_id !== this.previous_current_background_id
                ) {
                    URL.revokeObjectURL(this.previous_obj_url as string);
                }

                if (n(obj_url)) {
                    this.previous_obj_url = obj_url;
                }

                if (n(current_background_id)) {
                    this.previous_current_background_id = current_background_id;
                }
            }
        }, 'cnt_1473');

    public set_current_background_data_from_empty = ({
        current_background_id,
    }: {
        current_background_id: string | number;
    }): Promise<void> =>
        err_async(async () => {
            if (!n(this.current_background) || !n(this.current_background_file)) {
                await this.set_current_background_data({ current_background_id, force: true });
            }
        }, 'cnt_1477');
}

export const CurrentBackground = Class.get_instance();
