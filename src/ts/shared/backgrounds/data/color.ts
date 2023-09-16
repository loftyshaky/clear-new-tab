import { t } from '@loftyshaky/shared';
import { s_db, s_i, i_db } from 'shared/internal';

export class Color {
    private static i0: Color;

    public static i(): Color {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public create_solid_color_background = ({
        color,
        theme_id,
        backgrounds = [],
        update_current_background_id = true,
        merge_backgrounds,
        set_current_background_id_to_id_of_first_background,
        set_last_uploaded_background_as_current,
        show_protecting_screen,
        hide_protecting_screen,
        allow_animation,
        forbid_animation,
        upload_success,
    }: {
        color: string;
        backgrounds?: i_db.Background[];
        theme_id?: string;
        update_current_background_id?: boolean;
        merge_backgrounds?: t.CallbackVariadicAny;
        set_current_background_id_to_id_of_first_background?: t.CallbackVoid;
        set_last_uploaded_background_as_current?: t.CallbackVariadicVoid;
        set_progress_max?: t.CallbackVariadicVoid;
        increment_progress?: t.CallbackVariadicVoid;
        show_protecting_screen?: t.CallbackVariadicVoid;
        hide_protecting_screen?: t.CallbackVoid;
        allow_animation?: t.CallbackVoid;
        forbid_animation?: t.CallbackVoid;
        upload_success?: t.CallbackVoid;
        upload_error?: t.CallbackVariadicVoid;
    }): Promise<i_db.Background[] | undefined> =>
        err_async(async () => {
            let new_backgrounds: i_db.Background[] = [];

            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'show_protecting_screen' });
            } else if (n(show_protecting_screen)) {
                show_protecting_screen();
            }

            const no_backgrounds_before_upload: boolean = backgrounds.length === 0;
            const id: string = x.unique_id();
            new_backgrounds = [
                {
                    id,
                    theme_id,
                    i: s_i.Main.i().get_next_i({
                        items: backgrounds,
                    }),
                    type: 'color',
                },
            ];

            const new_background_thumbnails: i_db.BackgroundThumbnail[] = [
                {
                    id,
                    background: color,
                },
            ];

            const new_background_files: i_db.BackgroundFile[] = [
                {
                    id,
                    background: color,
                },
            ];

            await s_db.Manipulation.i().save_backgrounds({
                backgrounds: new_backgrounds,
                background_thumbnails: new_background_thumbnails,
                background_files: new_background_files,
            });

            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'allow_animation' });
            } else if (n(allow_animation)) {
                allow_animation();
            }

            if (page === 'settings' && n(merge_backgrounds)) {
                new_backgrounds = merge_backgrounds({
                    backgrounds: new_backgrounds,
                });
            }

            if (
                update_current_background_id &&
                n(set_current_background_id_to_id_of_first_background)
            ) {
                if (no_backgrounds_before_upload) {
                    // eslint-disable-next-line max-len
                    await set_current_background_id_to_id_of_first_background();
                } else if (n(set_last_uploaded_background_as_current)) {
                    // eslint-disable-next-line max-len
                    await set_last_uploaded_background_as_current({
                        id,
                    });
                }
            }

            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'forbid_animation' });
                await ext.send_msg_resp({ msg: 'upload_success' });
                await ext.send_msg_resp({ msg: 'hide_protecting_screen' });
            } else if (n(forbid_animation) && n(upload_success) && n(hide_protecting_screen)) {
                forbid_animation();
                upload_success();
                hide_protecting_screen();
            }

            return new_backgrounds;
        }, 'cnt_1108');
}
