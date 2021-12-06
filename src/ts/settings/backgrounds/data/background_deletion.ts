import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { s_db, i_db } from 'shared/internal';
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
            delete: action,
            delete_all_backgrounds: action,
        });
    }

    private deleting_background: boolean = false;
    private background_to_delete_id: string = '';

    public deleted_cls = computedFn(function (
        this: BackgroundDeletion,
        { id }: { id: string },
    ): string {
        return this.deleting_background && id === this.background_to_delete_id ? 'deleted' : '';
    });

    public trigger_delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            this.background_to_delete_id = id;
            this.deleting_background = true;

            await x.delay(data.settings.transition_duration + 70);

            this.delete({ id });
        }, 'cnt_55355');

    public delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            const deleted_background_i: number =
                d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                    id,
                });

            runInAction(() =>
                err(() => {
                    d_backgrounds.Main.i().backgrounds = _.reject(
                        d_backgrounds.Main.i().backgrounds,
                        (background: i_db.Background) => background.id === id,
                    );
                }, 'cnt_65653'),
            );

            await d_backgrounds.CurrentBackground.i().decrement_current_background({
                deleted_background_id: id,
                deleted_background_i,
            });

            await d_backgrounds.CurrentBackground.i().set_current_background_i();

            await s_db.Manipulation.i().delete_background({ id });

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
                d_sections.SectionContent.i().backgrounds_section_content_is_visible = false;
            }
        }, 'cnt_65656');

    public delete_all_backgrounds_transition_end_callback = (): Promise<void> =>
        err_async(async () => {
            d_backgrounds.Main.i().backgrounds = [];
            d_sections.SectionContent.i().backgrounds_section_content_is_visible = true;

            d_backgrounds.CurrentBackground.i().reset_current_background_id();

            await s_db.Manipulation.i().clear_all_tables();
        }, 'cnt_45345');
}
