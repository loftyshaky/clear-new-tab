import { s_db, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reset_val: number = 0;
    private last_current_background_id: string | number = Infinity;
    public current_background: i_db.Background | undefined;
    public current_background_file: i_db.BackgroundFile | undefined;
    private obj_url_dict: { [index: string]: string } = {};

    public set_current_background_data = ({
        current_background_id,
        force,
    }: {
        current_background_id: string | number;
        force: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (current_background_id !== this.last_current_background_id || force) {
                this.last_current_background_id = current_background_id;

                const background: i_db.Background = await s_db.Manipulation.get_background({
                    id: current_background_id,
                });
                const background_file: i_db.BackgroundFile =
                    await s_db.Manipulation.get_background_file({
                        id: current_background_id,
                    });

                if (n(background_file) && typeof background_file.background !== 'string') {
                    background_file.background = n(this.obj_url_dict[current_background_id])
                        ? this.obj_url_dict[current_background_id]
                        : URL.createObjectURL(
                              // URL.createObjectURL can't be called in service worker
                              (background_file as i_db.BackgroundFile).background as File,
                          );

                    this.obj_url_dict[current_background_id] = background_file.background;
                    const obj_url_dict_keys: string[] = Object.keys(this.obj_url_dict);

                    if (obj_url_dict_keys.length > 1) {
                        const leading_obj_url = this.obj_url_dict[obj_url_dict_keys[0]];

                        delete this.obj_url_dict[obj_url_dict_keys[0]];

                        URL.revokeObjectURL(leading_obj_url);
                    }
                }

                this.current_background = background;
                this.current_background_file = background_file;
            }
        }, 'cnt_1473');

    public set_current_background_data_from_empty = ({
        current_background_id,
    }: {
        current_background_id: string | number;
    }): Promise<void> =>
        err_async(async () => {
            await this.set_current_background_data({ current_background_id, force: true });
        }, 'cnt_1477');
}

export const CurrentBackground = Class.get_instance();
