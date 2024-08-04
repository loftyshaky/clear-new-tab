import debounce from 'lodash/debounce';
import random from 'lodash/random';
import { makeObservable, observable, action, toJS } from 'mobx';
import { computedFn } from 'mobx-utils';

import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { i_db } from 'shared_clean/internal';
import { d_backgrounds as d_backgrounds_shared } from 'shared/internal';
import { d_background_settings, d_backgrounds, d_scheduler, d_sections } from 'settings/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            selected_background_id: observable,
            select: action,
            deselect: action,
            reset_current_background_id: action,
            set_current_and_future_background_id_to_default: action,
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

                d_background_settings.SettingsContext.i().react_to_background_selection({
                    background,
                });
            }

            if (d_scheduler.Visibility.i().is_visible) {
                d_scheduler.Tasks.i().set_background_id({ background_id: background.id });
            }

            d_inputs.NestedInput.i().set_all_parents_disbled_vals({
                sections: d_sections.Main.i().sections as i_inputs.Sections,
                set_to_all_sections: true,
            });
        }, 'cnt_1109');

    public deselect = (): void =>
        err(() => {
            if (!d_backgrounds.Dnd.i().lock_background_selection) {
                this.selected_background_id = undefined;

                d_inputs.NestedInput.i().set_all_parents_disbled_vals({
                    sections: d_sections.Main.i().sections as i_inputs.Sections,
                    set_to_all_sections: true,
                });
            }
        }, 'cnt_1110');

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
            d_backgrounds_shared.CurrentBackground.i().set_current_background_i({
                backgrounds: d_backgrounds.Main.i().backgrounds,
            });
        }, 'cnt_1481');

    public set_background_as_current = ({
        id,
    }: {
        id: string | number | undefined;
    }): Promise<void> =>
        err_async(async () => {
            d_backgrounds_shared.CurrentBackground.i().set_background_as_current({
                id,
                backgrounds: d_backgrounds.Main.i().backgrounds,
            });
        }, 'cnt_1482');

    public set_selected_background_as_current = (): void =>
        err(() => {
            if (this.selected_background_id) {
                this.set_background_as_current({
                    id: this.selected_background_id,
                });
            } else {
                show_notification({
                    error_msg_key: 'set_background_as_current_notification',
                    hide_delay: 8000,
                });
            }
        }, 'cnt_1113');

    public set_last_uploaded_background_as_current = ({
        id,
    }: {
        id: string | undefined;
    }): Promise<void> =>
        err_async(async () => {
            if (
                ['one_background', 'multiple_backgrounds'].includes(data.settings.mode) &&
                data.settings.automatically_set_last_uploaded_background_as_current
            ) {
                this.set_background_as_current({ id });
            } else if (
                data.settings.current_background_id ===
                d_backgrounds_shared.CurrentBackground.i().reset_val
            ) {
                await this.set_current_background_id_to_id_of_first_background();
            }
        }, 'cnt_1114');

    public save_current_background_id_from_i = debounce(
        (): void =>
            err(() => {
                if (d_backgrounds.Main.i().backgrounds.length !== 0) {
                    const background_with_current_i: i_db.Background | undefined =
                        d_backgrounds.Main.i().backgrounds[data.ui.current_background_i - 1];

                    this.set_background_as_current({
                        id: n(background_with_current_i)
                            ? background_with_current_i.id
                            : d_backgrounds_shared.CurrentBackground.i().reset_val,
                    });

                    if (n(background_with_current_i)) {
                        d_background_settings.SettingsContext.i().react_to_background_selection({
                            background: background_with_current_i,
                        });
                    }
                }
            }, 'cnt_1115'),
        200,
    );

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
        }, 'cnt_1116');

    public reset_current_background_id = (): void =>
        err(() => {
            data.settings.current_background_id =
                d_backgrounds_shared.CurrentBackground.i().reset_val;
            data.ui.current_background_i = d_backgrounds_shared.CurrentBackground.i().reset_val;

            this.save_current_background_id_from_i();
        }, 'cnt_1117');

    public set_current_and_future_background_id_to_default = (): Promise<void> =>
        err_async(async () => {
            data.settings.current_background_id =
                d_backgrounds_shared.CurrentBackground.i().reset_val;
            data.settings.future_background_id =
                d_backgrounds_shared.CurrentBackground.i().reset_val;
            data.ui.current_background_i = d_backgrounds_shared.CurrentBackground.i().reset_val;

            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: data.settings,
                update_instantly: true,
            });
        }, 'cnt_1423');

    public set_current_background_id_to_id_of_first_background = (): Promise<void> =>
        err_async(async () => {
            if (d_backgrounds.Main.i().backgrounds.length !== 0) {
                await d_backgrounds.CurrentBackground.i().set_background_as_current({
                    id: d_backgrounds.Main.i().backgrounds[0].id,
                });
            }
        }, 'cnt_1425');

    private get_id_of_random_background = (): string | number =>
        err(() => {
            let future_background_id: string | number = 0;

            while (
                future_background_id === 0 ||
                future_background_id === data.settings.current_background_id
            ) {
                future_background_id =
                    d_backgrounds.Main.i().backgrounds[
                        random(0, d_backgrounds.Main.i().backgrounds.length - 1)
                    ].id;
            }

            return future_background_id;
        }, 'cnt_1118');
}
