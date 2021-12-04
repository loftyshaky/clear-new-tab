import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';

import { s_db, i_db } from 'shared/internal';
import { d_sections } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            backgrounds: observable,
            merge_backgrounds: action,
            update_backgrounds: action,
            delete_all_backgrounds: action,
        });
    }

    public backgrounds: i_db.Background[] = [];

    public set_backgrounds = (): Promise<void> =>
        err(async () => {
            const backgrounds: i_db.Background[] = await s_db.Manipulation.i().get_backgrounds();

            runInAction(() =>
                err(() => {
                    this.backgrounds = backgrounds;

                    this.backgrounds.sort((a: i_db.Background, b: i_db.Background): number =>
                        err(() => a.i - b.i, 'cnt_64367'),
                    );
                }, 'cnt_64357'),
            );
        }, 'cnt_49273');

    public merge_backgrounds = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');

    public update_backgrounds = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');

    public delete_all_backgrounds = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(ext.msg('delete_all_backgrounds_confirm'))) {
                d_sections.SectionContent.i().backgrounds_section_content_is_visible = false;
            }
        }, 'cnt_65656');

    public delete_all_backgrounds_transition_end_callback = (): Promise<void> =>
        err_async(async () => {
            this.backgrounds = [];
            d_sections.SectionContent.i().backgrounds_section_content_is_visible = true;

            await s_db.Manipulation.i().clear_all_tables();
        }, 'cnt_45345');
}
