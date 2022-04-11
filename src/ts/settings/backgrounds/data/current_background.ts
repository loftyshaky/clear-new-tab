import _ from 'lodash';
import { makeObservable, observable, action, toJS } from 'mobx';
import { computedFn } from 'mobx-utils';

import { d_backgrounds as d_backgrounds_shared, s_i, i_db } from 'shared/internal';
import { d_background_settings, d_backgrounds, d_scheduler } from 'settings/internal';

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
            deselect: action,
            set_current_background_i: action,
            set_background_as_current: action,
            reset_current_background_id: action,
        });
    }

    public selected_background_id: string | undefined = undefined;

    public select = ({ background }: { background: i_db.Background }): void =>
        err(() => {
            if (
                !d_backgrounds.Dnd.i().lock_background_selection &&
                !d_scheduler.Visibility.i().is_visible
            ) {
                this.selected_background_id = background.id;

                d_background_settings.SettingsType.i().react_to_background_selection({
                    background,
                });
            }

            if (d_scheduler.Visibility.i().is_visible) {
                d_scheduler.Tasks.i().set_background_id({ background_id: background.id });
            }
        }, 'cnt_96436');

    public deselect = (): void =>
        err(() => {
            if (!d_backgrounds.Dnd.i().lock_background_selection) {
                this.selected_background_id = undefined;
            }
        }, 'cnt_53645');

    selected_cls = computedFn(function (this: CurrentBackground, { id }: { id: string }): string {
        if (n(this.selected_background_id)) {
            if (id === this.selected_background_id) {
                return 'selected';
            }
        }

        return '';
    });

    public set_current_background_i = (): void =>
        err(() => {
            const no_backgrounds_exist: boolean = d_backgrounds.Main.i().backgrounds.length === 0;

            if (no_backgrounds_exist) {
                data.ui.current_background_i = 1;
            } else {
                const i_of_background_with_current_id: number = s_i.Main.i().find_i_of_item_with_id(
                    {
                        id: data.settings.current_background_id,
                        items: d_backgrounds.Main.i().backgrounds,
                    },
                );
                data.ui.current_background_i = i_of_background_with_current_id + 1;
            }
        }, 'cnt_56743');

    public set_background_as_current = ({
        id,
    }: {
        id: string | number | undefined;
    }): Promise<void> =>
        err_async(async () => {
            data.settings.current_background_id = id;

            this.set_current_background_i();

            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: {
                    current_background_id: id,
                    ...(id === 1 && { future_background_id: id }),
                    background_change_time: new Date().getTime(),
                },
                update_instantly: true,
            });

            d_backgrounds_shared.CurrentBackground.i().set_future_background_id();

            ext.send_msg({
                msg: 'get_background',
                allow_to_start_slideshow_timer: false,
                force_update: true,
            });
        }, 'cnt_64357');

    public set_selected_background_as_current = (): void =>
        err(() => {
            if (this.selected_background_id) {
                this.set_background_as_current({
                    id: this.selected_background_id,
                });
            } else {
                // eslint-disable-next-line no-alert
                alert(ext.msg('select_background_alert'));
            }
        }, 'cnt_53793');

    public set_last_uploaded_background_as_current = ({ id }: { id: string | undefined }): void =>
        err(() => {
            if (
                ['one_background', 'multiple_backgrounds'].includes(data.settings.mode) &&
                data.settings.automatically_set_last_uploaded_background_as_current
            ) {
                this.set_background_as_current({ id });
            } else if (data.settings.current_background_id === 1) {
                this.set_background_as_current({
                    id: d_backgrounds.Main.i().backgrounds[0].id,
                });
            }
        }, 'cnt_63785');

    public save_current_background_id_from_i = (): void =>
        err(() => {
            if (d_backgrounds.Main.i().backgrounds.length !== 0) {
                const background_with_current_i: i_db.Background | undefined =
                    d_backgrounds.Main.i().backgrounds[data.ui.current_background_i - 1];

                this.set_background_as_current({
                    id: n(background_with_current_i) ? background_with_current_i.id : 1,
                });
            }
        }, 'cnt_64789');

    public decrement_current_background = ({
        deleted_background_i,
        current_background_i,
    }: {
        current_background_i: number;
        deleted_background_i: number;
    }): void =>
        err(() => {
            const no_backgrounds_exist: boolean = d_backgrounds.Main.i().backgrounds.length === 0;

            if (no_backgrounds_exist) {
                this.reset_current_background_id();
            } else {
                let new_current_background_id: string | number | undefined;
                const deleting_current_background: boolean =
                    deleted_background_i === current_background_i;

                if (
                    data.settings.mode === 'multiple_backgrounds' &&
                    data.settings.shuffle_backgrounds &&
                    deleting_current_background
                ) {
                    new_current_background_id = this.get_id_of_random_background();
                } else if (deleted_background_i <= current_background_i) {
                    const there_is_bacground_after_deleted_background: boolean = n(
                        toJS(d_backgrounds.Main.i().backgrounds)[current_background_i],
                    );
                    const previous_background: i_db.Background | undefined = toJS(
                        d_backgrounds.Main.i().backgrounds,
                    )[
                        deleting_current_background && there_is_bacground_after_deleted_background
                            ? current_background_i
                            : current_background_i - 1
                    ];

                    if (n(previous_background)) {
                        new_current_background_id = previous_background.id;
                    }
                }

                if (n(new_current_background_id)) {
                    this.set_background_as_current({ id: new_current_background_id });
                }
            }
        }, 'cnt_53246');

    public reset_current_background_id = (): void =>
        err(() => {
            const reset_val: number = 1;

            data.settings.current_background_id = reset_val;
            data.ui.current_background_i = reset_val;

            this.save_current_background_id_from_i();
        }, 'cnt_64684');

    private get_id_of_random_background = (): string | number =>
        err(() => {
            let future_background_id: string | number = 0;

            while (
                future_background_id === 0 ||
                future_background_id === data.settings.current_background_id
            ) {
                future_background_id =
                    d_backgrounds.Main.i().backgrounds[
                        _.random(0, d_backgrounds.Main.i().backgrounds.length - 1)
                    ].id;
            }

            return future_background_id;
        }, 'cnt_64356');
}
