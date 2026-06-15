import type { i_error } from '@loftyshaky/shared/shared_clean';
import type { i_db } from 'shared_clean/internal';
import { s_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public reset_val: number = 0;
    public current_background: i_db.Background | undefined;
    public current_background_file: i_db.BackgroundFile | undefined;
    public future_background: i_db.Background | undefined;
    public future_background_file: i_db.BackgroundFile | undefined;
    private obj_url_dict: { [index: string]: string } = {};

    public set_current_background_data = ({
        mode,
        current_background_id,
        future_background_id,
        force = false,
    }: {
        mode: string;
        current_background_id?: string | number;
        future_background_id?: string | number;
        force?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (
                force ||
                !n(this.current_background) ||
                ['multiple_backgrounds', 'random_solid_color'].includes(mode)
            ) {
                if (
                    n(current_background_id) &&
                    n(future_background_id) &&
                    (force || !n(this.current_background))
                ) {
                    const current_background: i_db.Background =
                        await s_db.Manipulation.get_background({
                            id: current_background_id,
                        });
                    const current_background_file: i_db.BackgroundFile =
                        await s_db.Manipulation.get_background_file({
                            id: current_background_id,
                        });
                    const future_background: i_db.Background =
                        await s_db.Manipulation.get_background({
                            id: future_background_id,
                        });
                    const future_background_file: i_db.BackgroundFile =
                        await s_db.Manipulation.get_background_file({
                            id: future_background_id,
                        });

                    this.current_background = current_background;
                    this.current_background_file = current_background_file;
                    this.future_background = future_background;
                    this.future_background_file = future_background_file;
                } else if (
                    n(this.current_background) &&
                    current_background_id !== this.current_background.id
                ) {
                    this.current_background = this.future_background;
                    this.current_background_file = this.future_background_file;

                    if (n(future_background_id)) {
                        const future_background: i_db.Background =
                            await s_db.Manipulation.get_background({
                                id: future_background_id,
                            });
                        const future_background_file: i_db.BackgroundFile =
                            await s_db.Manipulation.get_background_file({
                                id: future_background_id,
                            });

                        const future_background_promise = Promise.all([
                            s_db.Manipulation.get_background({
                                id: future_background_id,
                            }),
                            s_db.Manipulation.get_background_file({
                                id: future_background_id,
                            }),
                        ]);

                        future_background_promise
                            .then(([future_background, future_background_file]) => {
                                this.future_background = future_background;
                                this.future_background_file = future_background_file;
                            })
                            .catch((error_obj: i_error.ErrorObj) =>
                                show_err_ribbon(error_obj, 'cnt_1543'),
                            );

                        this.future_background = future_background;
                        this.future_background_file = future_background_file;
                    }
                }

                if (
                    n(this.current_background) &&
                    n(this.current_background_file) &&
                    typeof this.current_background_file.background !== 'string'
                ) {
                    this.current_background_file.background =
                        n(current_background_id) && n(this.obj_url_dict[current_background_id])
                            ? this.obj_url_dict[current_background_id]
                            : URL.createObjectURL(
                                  // URL.createObjectURL can't be called in service worker
                                  (this.current_background_file as i_db.BackgroundFile)
                                      .background as File,
                              );

                    if (n(current_background_id)) {
                        this.obj_url_dict[current_background_id] =
                            this.current_background_file.background;
                    }

                    const obj_url_dict_keys: string[] = Object.keys(this.obj_url_dict);

                    if (obj_url_dict_keys.length > 1) {
                        const leading_obj_url = this.obj_url_dict[obj_url_dict_keys[0]];

                        delete this.obj_url_dict[obj_url_dict_keys[0]];

                        URL.revokeObjectURL(leading_obj_url);
                    }
                }
            }
        }, 'cnt_1473');
}

export const CurrentBackground = Class.get_instance();
