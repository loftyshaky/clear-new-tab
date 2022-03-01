import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { d_backgrounds as d_backgrounds_shared, s_db, i_db } from 'shared/internal';
import { d_backgrounds, d_sections } from 'settings/internal';

export class BackgroundDeletion {
    private static i0: BackgroundDeletion;

    public static i(): BackgroundDeletion {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable<BackgroundDeletion, 'deleting_background'>(this, {
            deleting_background: observable,
            trigger_delete: action,
            delete_all_backgrounds: action,
        });
    }

    public deletion_reason: 'delete_all_backgrounds' | 'restore_back_up' = 'delete_all_backgrounds';
    private deleting_background: boolean = false;
    private background_to_delete_ids: string[] = [];

    public deleted_cls = computedFn(function (
        this: BackgroundDeletion,
        { id }: { id: string },
    ): string {
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

            this.background_to_delete_ids = ids;
            this.deleting_background = true;

            await x.delay(data.settings.transition_duration + 70);

            this.delete({ ids, deleting_background_with_delete_button });
        }, 'cnt_55355');

    private delete = ({
        ids,
        deleting_background_with_delete_button = false,
    }: {
        ids: string[];
        deleting_background_with_delete_button?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            let deleted_background_i: number | undefined;

            if (deleting_background_with_delete_button) {
                deleted_background_i =
                    d_backgrounds_shared.CurrentBackground.i().find_i_of_background_with_id({
                        id: ids[0],
                        backgrounds: d_backgrounds.Main.i().backgrounds,
                    });
            }

            runInAction(() =>
                err(() => {
                    d_backgrounds.Main.i().backgrounds = _.reject(
                        d_backgrounds.Main.i().backgrounds,
                        (background: i_db.Background) => ids.includes(background.id),
                    );
                }, 'cnt_65653'),
            );

            if (deleting_background_with_delete_button && n(deleted_background_i)) {
                const last_theme_background: i_db.Background | undefined =
                    d_backgrounds.Main.i().backgrounds.find(
                        (background: i_db.Background): boolean =>
                            err(() => n(background.theme_id), 'cnt_75467'),
                    );

                if (data.settings.mode === 'theme_background' && n(last_theme_background)) {
                    if (n(last_theme_background)) {
                        await d_backgrounds.CurrentBackground.i().set_background_as_current({
                            id: last_theme_background.id,
                        });
                    }
                } else {
                    await d_backgrounds.CurrentBackground.i().decrement_current_background({
                        deleted_background_id: ids[0],
                        deleted_background_i,
                    });
                }
            }

            await s_db.Manipulation.i().delete_backgrounds({ ids });

            runInAction(() =>
                err(() => {
                    this.deleting_background = false;
                }, 'cnt_65653'),
            );
        }, 'cnt_64356');

    public delete_all_backgrounds = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(ext.msg('delete_all_backgrounds_confirm'))) {
                this.deletion_reason = 'delete_all_backgrounds';

                d_sections.SectionContent.i().backgrounds_section_content_is_visible = false;
            }
        }, 'cnt_65656');

    public delete_all_backgrounds_transition_end_callback = (): Promise<void> =>
        err_async(async () => {
            d_sections.SectionContent.i().backgrounds_section_content_is_visible = true;

            if (this.deletion_reason === 'delete_all_backgrounds') {
                d_backgrounds.Main.i().backgrounds = [];
                d_backgrounds.Main.i().background_thumbnails = [];

                await s_db.Manipulation.i().clear_all_tables();
            } else if (this.deletion_reason === 'restore_back_up') {
                await d_backgrounds.Main.i().set_backgrounds({
                    backgrounds: d_sections.Restore.i().restored_backgrounds,
                    background_thumbnails: d_sections.Restore.i().restored_background_thumbnails,
                });
            }

            d_backgrounds.CurrentBackground.i().reset_current_background_id();
        }, 'cnt_45345');
}
