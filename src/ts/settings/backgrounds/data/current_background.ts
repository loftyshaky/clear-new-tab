import _ from 'lodash';
import { makeObservable, observable, action, toJS } from 'mobx';
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
        makeObservable<CurrentBackground, 'set_current_background_i'>(this, {
            selected_background_id: observable,
            select: action,
            set_current_background_i: action,
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

    public find_i_of_background_with_id = ({ id }: { id: string }): number =>
        err(
            () =>
                d_backgrounds.Main.i().backgrounds.findIndex(
                    (background: i_db.Background): boolean =>
                        err(() => background.id === id, 'cnt_56538'),
                ),
            'cnt_54723',
        );

    public set_current_background_i = (): void =>
        err(() => {
            const no_backgrounds_exist: boolean = d_backgrounds.Main.i().backgrounds.length === 0;

            if (no_backgrounds_exist) {
                data.ui.current_background_i = 1;
            } else {
                const i_of_background_with_current_id: number = this.find_i_of_background_with_id({
                    id: data.settings.current_background_id,
                });
                data.ui.current_background_i = i_of_background_with_current_id + 1;
            }
        }, 'cnt_56743');

    public set_background_as_current = ({ id }: { id: string | undefined }): void =>
        err(() => {
            data.settings.current_background_id = id;

            this.set_current_background_i();

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
            const background_with_current_i: i_db.Background =
                d_backgrounds.Main.i().backgrounds[data.ui.current_background_i - 1];

            ext.send_msg_resp({
                msg: 'update_settings',
                settings: { current_background_id: background_with_current_i.id },
            });
        }, 'cnt_64789');

    public decrement_current_background = ({
        deleted_background_id,
        deleted_background_i,
    }: {
        deleted_background_id: string;
        deleted_background_i: number;
    }): void =>
        err(() => {
            const no_backgrounds_exist: boolean = d_backgrounds.Main.i().backgrounds.length === 0;

            if (no_backgrounds_exist) {
                data.settings.current_background_id = 1;

                ext.send_msg({
                    msg: 'update_settings',
                    settings: { current_background_id: 1 },
                });
            } else if (data.settings.current_background_id === deleted_background_id) {
                let new_current_background_id: string | undefined;

                if (
                    data.settings.mode === 'multiple_backgrounds' &&
                    data.settings.shuffle_backgrounds
                ) {
                    new_current_background_id = this.get_id_of_random_background();
                } else {
                    const next_background: i_db.Background | undefined = toJS(
                        d_backgrounds.Main.i().backgrounds,
                    )[deleted_background_i];
                    const previous_background: i_db.Background | undefined = toJS(
                        d_backgrounds.Main.i().backgrounds,
                    )[deleted_background_i - 1];

                    if (n(next_background)) {
                        new_current_background_id = next_background.id;
                    } else if (n(previous_background)) {
                        new_current_background_id = previous_background.id;
                    }
                }

                data.settings.current_background_id = new_current_background_id;

                ext.send_msg({
                    msg: 'update_settings',
                    settings: { current_background_id: new_current_background_id },
                });
            }
        }, 'cnt_53246');

    private get_id_of_random_background = (): string =>
        err(
            () =>
                d_backgrounds.Main.i().backgrounds[
                    _.random(0, d_backgrounds.Main.i().backgrounds.length - 1)
                ].id,
            'cnt_64356',
        );
}
