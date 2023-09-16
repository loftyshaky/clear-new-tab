import { i_db } from 'shared/internal';

export class Thumbnail {
    private static i0: Thumbnail;

    public static i(): Thumbnail {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
