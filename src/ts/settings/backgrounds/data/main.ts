import { makeObservable, observable, action } from 'mobx';

import { i_db } from 'shared/internal';

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
            update_backgrounds_data: action,
        });
    }

    public backgrounds: i_db.Backgrounds[] = [
        {
            id: x.id(),
            background: undefined,
            theme_id: undefined,
            i: 0,
            type: 'img',
            thumbnail: '',
            width: 1920,
            height: 1080,
            background_size: 'global',
            background_positon: 'global',
            background_repeat: 'global',
            color_of_area_around_background: 'global',
            video_volume: 'global',
        },
        {
            id: x.id(),
            background: undefined,
            theme_id: undefined,
            i: 1,
            type: 'img',
            thumbnail: '',
            width: 1920,
            height: 1080,
            background_size: 'global',
            background_positon: 'global',
            background_repeat: 'global',
            color_of_area_around_background: 'global',
            video_volume: 'global',
        },
    ];

    public update_backgrounds_data = ({ backgrounds }: { backgrounds: i_db.Backgrounds[] }): void =>
        err(() => {
            this.backgrounds = backgrounds;
        }, 'cnt_49273');
}
