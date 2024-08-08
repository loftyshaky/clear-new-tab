import { i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public height: number = 94;

    public get_background_thumbnail_width = ({
        background,
    }: {
        background: i_db.Background;
    }): number =>
        err(
            () =>
                background.type.includes('color')
                    ? this.height
                    : (background as i_db.FileBackground).thumbnail_width,
            'cnt_1158',
        );
}

export const Thumbnail = Class.get_instance();
