import { i_db } from 'shared/internal';
import { d_background } from 'new_tab/internal';

export class Type {
    private static i0: Type;

    public static i(): Type {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public is_img_file = ({
        background_container_i,
    }: {
        background_container_i: number;
    }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Main.i().background_data[background_container_i];

            return (
                data.settings.mode !== 'random_solid_color' &&
                n(background_data) &&
                background_data.type.includes('img_file')
            );
        }, 'cnt_1066');

    public is_img_link = ({
        background_container_i,
    }: {
        background_container_i: number;
    }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Main.i().background_data[background_container_i];

            return (
                data.settings.mode !== 'random_solid_color' &&
                n(background_data) &&
                background_data.type === 'img_link'
            );
        }, 'cnt_1067');

    public is_img = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(
            () =>
                data.settings.mode !== 'random_solid_color' &&
                (this.is_img_file({ background_container_i }) ||
                    this.is_img_link({ background_container_i })),
            'cnt_1068',
        );

    public is_color = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Main.i().background_data[background_container_i];

            return (
                data.settings.mode === 'random_solid_color' ||
                (n(background_data) && background_data.type.includes('color'))
            );
        }, 'cnt_1069');

    public is_video = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Main.i().background_data[background_container_i];

            return (
                data.settings.mode !== 'random_solid_color' &&
                n(background_data) &&
                background_data.type.includes('video')
            );
        }, 'cnt_1070');
}
