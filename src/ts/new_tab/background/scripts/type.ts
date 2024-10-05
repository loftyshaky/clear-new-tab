import { i_db } from 'shared_clean/internal';
import { d_background } from 'new_tab/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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
                d_background.Background.background_data[background_container_i];

            return (
                data.settings.prefs.mode !== 'random_solid_color' &&
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
                d_background.Background.background_data[background_container_i];

            return (
                data.settings.prefs.mode !== 'random_solid_color' &&
                n(background_data) &&
                background_data.type === 'img_link'
            );
        }, 'cnt_1067');

    public is_img = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(
            () =>
                data.settings.prefs.mode !== 'random_solid_color' &&
                (this.is_img_file({ background_container_i }) ||
                    this.is_img_link({ background_container_i })),
            'cnt_1068',
        );

    public is_color = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Background.background_data[background_container_i];

            return (
                data.settings.prefs.mode === 'random_solid_color' ||
                (n(background_data) && background_data.type.includes('color'))
            );
        }, 'cnt_1069');

    public is_video = ({ background_container_i }: { background_container_i: number }): boolean =>
        err(() => {
            const background_data: i_db.Background | undefined =
                d_background.Background.background_data[background_container_i];

            return (
                data.settings.prefs.mode !== 'random_solid_color' &&
                n(background_data) &&
                background_data.type.includes('video')
            );
        }, 'cnt_1070');
}

export const Type = Class.get_instance();
