import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

import { i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable<CurrentBackground, 'set_current_background_id_input_val'>(this, {
            selected_background_id: observable,
            select: action,
            set_current_background_id_input_val: action,
            set_background_as_current: action,
        });
    }

    public selected_background_id: string | undefined = undefined;

    public select = ({ background }: { background: i_db.Background }): void =>
        err(() => {
            this.selected_background_id = background.id;
        }, 'cnt_96436');

    selected_cls = computedFn(function (this: CurrentBackground, { id }: { id: string }): string {
        if (n(this.selected_background_id)) {
            if (id === this.selected_background_id) {
                return 'selected';
            }
        }

        return '';
    });

    public set_current_background_id_input_val = (): void =>
        err(() => {
            const no_backgrounds_exist: boolean = d_backgrounds.Main.i().backgrounds.length === 0;

            if (no_backgrounds_exist) {
                data.settings.current_background_id = 1;
            } else {
                const background_with_current_id: i_db.Background | undefined =
                    d_backgrounds.Main.i().backgrounds.find(
                        (background: i_db.Background): boolean =>
                            err(
                                () => background.id === data.settings.current_background_id,

                                'cnt_56846',
                            ),
                    );

                if (n(background_with_current_id)) {
                    data.settings.current_background_id = background_with_current_id.i + 1;
                }
            }
        }, 'cnt_56743');

    public set_background_as_current = ({ id }: { id: string | undefined }): void =>
        err(() => {
            data.settings.current_background_id = id;

            this.set_current_background_id_input_val();

            ext.send_msg_resp({
                msg: 'update_settings',
                settings: { current_background_id: id },
            });
        }, 'cnt_64357');

    public set_selected_background_as_current = (): void =>
        err(() => {
            if (this.selected_background_id) {
                this.set_background_as_current({ id: this.selected_background_id });
            } else {
                // eslint-disable-next-line no-alert
                alert(ext.msg('select_background_alert'));
            }
        }, 'cnt_53793');

    public set_last_uploaded_background_as_current = ({ id }: { id: string | undefined }): void =>
        err(() => {
            if (['one_background', 'multiple_backgrounds'].includes(data.settings.mode)) {
                if (data.settings.automatically_set_last_uploaded_background_as_current) {
                    this.set_background_as_current({ id });
                } else if (data.settings.current_background_id === 1) {
                    this.set_background_as_current({
                        id: d_backgrounds.Main.i().backgrounds[0].id,
                    });
                }
            }
        }, 'cnt_63785');

    public save_current_background_id_from_i = (): void =>
        err(() => {
            const background_with_current_i: i_db.Background | undefined =
                d_backgrounds.Main.i().backgrounds.find((background: i_db.Background): boolean =>
                    err(
                        () => background.i === data.settings.current_background_id - 1,
                        'cnt_56538',
                    ),
                );

            if (n(background_with_current_i)) {
                ext.send_msg_resp({
                    msg: 'update_settings',
                    settings: { current_background_id: background_with_current_i.id },
                });
            }
        }, 'cnt_64789');
}
