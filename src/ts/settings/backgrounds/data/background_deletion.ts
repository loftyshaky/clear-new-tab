import reject from 'lodash/reject';
import { MouseEvent } from 'react';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { vars, s_db, s_i, i_db } from 'shared_clean/internal';
import { s_preload_color } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_browser_theme,
    d_protecting_screen,
    d_scheduler,
    d_sections,
    s_scrollable,
    d_pagination,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<Class, 'deleting_background'>(this, {
            deleting_background: observable,
            trigger_delete: action,
            delete_all_backgrounds: action,
        });
    }

    public deletion_reason: 'delete_all_backgrounds' | 'restore_back_up' = 'delete_all_backgrounds';
    private deleting_background: boolean = false;
    private background_to_delete_ids: string[] = [];

    public deleted_cls = computedFn(function (this: Class, { id }: { id: string }): string {
        return this.deleting_background && this.background_to_delete_ids.includes(id)
            ? 'deleted'
            : '';
    });

    public trigger_delete = (
        {
            ids,
            deleting_background_with_delete_button = false,
        }: { ids: string[]; deleting_background_with_delete_button?: boolean },
        e?: MouseEvent,
    ): Promise<void> =>
        err_async(async () => {
            if (n(e)) {
                e.stopPropagation();
            }

            d_protecting_screen.Visibility.show();

            this.background_to_delete_ids = ids;
            this.deleting_background = true;

            await x.delay(data.settings.prefs.transition_duration + vars.item_deletion_delay);

            await this.delete({ ids, deleting_background_with_delete_button });

            if (deleting_background_with_delete_button) {
                d_protecting_screen.Visibility.hide();
            }

            const deleting_selected_background: boolean = ids.some((id: string): boolean =>
                err(
                    () => id === d_backgrounds.CurrentBackground.selected_background_id,
                    'cnt_1100',
                ),
            );

            if (deleting_selected_background) {
                d_background_settings.SettingsContext.react_to_global_selection();
            }
        }, 'cnt_1101');

    private delete = ({
        ids,
        deleting_background_with_delete_button = false,
    }: {
        ids: string[];
        deleting_background_with_delete_button?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            let current_background_i: number = 0;
            let deleted_background_i: number = 0;

            if (deleting_background_with_delete_button) {
                current_background_i = s_i.I.find_i_of_item_with_id({
                    id: data.settings.prefs.current_background_id,
                    items: d_backgrounds.Backgrounds.backgrounds,
                });
                deleted_background_i = s_i.I.find_i_of_item_with_id({
                    id: ids[0],
                    items: d_backgrounds.Backgrounds.backgrounds,
                });
            }

            await s_db.Manipulation.delete_backgrounds({ ids });

            runInAction(() =>
                err(() => {
                    d_backgrounds.Backgrounds.backgrounds = reject(
                        d_backgrounds.Backgrounds.backgrounds,
                        (background: i_db.Background) => ids.includes(background.id),
                    );
                    d_pagination.Page.page_backgrounds = reject(
                        d_pagination.Page.page_backgrounds,
                        (background: i_db.Background) => ids.includes(background.id),
                    );
                }, 'cnt_1102'),
            );
            if (deleting_background_with_delete_button && n(deleted_background_i)) {
                const last_theme_background: i_db.Background | undefined =
                    d_backgrounds.Backgrounds.backgrounds.find(
                        (background: i_db.Background): boolean =>
                            err(() => n(background.theme_id), 'cnt_1103'),
                    );

                if (data.settings.prefs.mode === 'theme_background' && n(last_theme_background)) {
                    if (n(last_theme_background)) {
                        await d_backgrounds.CurrentBackground.set_background_as_current({
                            id: last_theme_background.id,
                        });
                    }
                } else {
                    await d_backgrounds.CurrentBackground.decrement_current_background({
                        current_background_i,
                        deleted_background_i,
                    });
                }
            }

            await d_scheduler.TaskDeletion.delete_from_background_id({
                background_ids: ids,
            });

            d_backgrounds.BackgroundAnimation.remove_already_animated_ids({ ids });
            await this.react_to_all_background_deletion();

            await d_pagination.Page.set_last_if_page_empty();

            runInAction(() =>
                err(() => {
                    this.deleting_background = false;
                }, 'cnt_1104'),
            );
        }, 'cnt_1105');

    public delete_all_backgrounds = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (globalThis.confirm(ext.msg('delete_all_backgrounds_confirm'))) {
                d_protecting_screen.Visibility.show();

                this.deletion_reason = 'delete_all_backgrounds';

                d_sections.SectionContent.set_backgrounds_section_content_visibility({
                    is_visible: false,
                });
            }
        }, 'cnt_1106');

    public delete_all_backgrounds_transition_end_callback = (): Promise<void> =>
        err_async(async () => {
            if (!d_sections.Restore.restoring_from_back_up_pagination) {
                d_sections.SectionContent.set_backgrounds_section_content_visibility({
                    is_visible: true,
                });
            }

            d_backgrounds.BackgroundAnimation.remove_all_already_animated_ids();

            if (this.deletion_reason === 'delete_all_backgrounds') {
                d_backgrounds.Backgrounds.backgrounds = [];
                d_pagination.Page.page_backgrounds = [];

                await s_db.Manipulation.clear_all_background_tables();
                await d_scheduler.TaskDeletion.delete_all_tasks();
                await this.react_to_all_background_deletion();
            } else if (this.deletion_reason === 'restore_back_up') {
                await d_backgrounds.Backgrounds.set_backgrounds({
                    backgrounds: d_sections.Restore.restored_backgrounds,
                });

                await s_db.Manipulation.save_tasks({
                    tasks: d_sections.Restore.restored_tasks,
                });
                await d_scheduler.Tasks.set_tasks_from_arg({
                    tasks: d_sections.Restore.restored_tasks,
                });

                await d_browser_theme.Backgrounds.refresh_theme_backgrounds();

                s_scrollable.Scrollable.set_scroll_position({
                    scrollable_type: 'backgrounds',
                });
            }

            d_background_settings.SettingsContext.react_to_global_selection();
            d_protecting_screen.Visibility.hide();
        }, 'cnt_1107');

    private react_to_all_background_deletion = (): Promise<void> =>
        err_async(async () => {
            if (d_backgrounds.Backgrounds.backgrounds.length === 0) {
                // eslint-disable-next-line max-len
                await d_backgrounds.CurrentBackground.set_current_and_future_background_id_to_default();

                s_preload_color.Storage.set_preload_color();

                ext.send_msg({ msg: 'get_background', force_update: true });
            }
        }, 'cnt_1426');
}

export const BackgroundDeletion = Class.get_instance();
