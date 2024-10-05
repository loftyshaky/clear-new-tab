import merge from 'lodash/merge';
import random from 'lodash/random';
import { makeObservable, observable, computed, action } from 'mobx';

import { i_db } from 'shared_clean/internal';
import { d_background, s_background } from 'new_tab/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            z_index_plus_1_cls: observable,
            img_no_tr_cls: observable,
            video_no_tr_cls: observable,
            img_is_visible_cls: observable,
            video_is_visible_cls: observable,
            videos_load_video_is_visible_cls: computed,
            set_classes: action,
            init_vars: action,
        });
    }

    public no_tr: boolean = false;

    private slide_directions: string[] = [
        'from_right_to_left',
        'from_left_to_right',
        'from_top_to_bottom',
        'from_bottom_to_top',
    ];

    public z_index_plus_1_cls: string[] = ['', ''];
    public img_no_tr_cls: string[] = ['no_tr', 'no_tr'];
    public video_no_tr_cls: string[] = ['no_tr', 'no_tr'];
    public img_is_visible_cls: string[] = ['opacity_0', 'opacity_0'];
    public video_is_visible_cls: string[] = ['opacity_0', 'opacity_0'];
    public background_is_sliding_cls: string[] = [];
    public background_is_no_effect_cls: string[] = [];

    public get videos_load_video_is_visible_cls() {
        return d_background.VideoReapeat.loaded_videos_count >=
            d_background.VideoReapeat.total_videos_count
            ? ''
            : 'opacity_0';
    }

    public init_vars = (): void =>
        err(() => {
            this.background_is_sliding_cls = merge({}, d_background.Background.default_val_3);
            this.background_is_no_effect_cls = merge({}, d_background.Background.default_val_3);
        }, 'cnt_1526');

    public set_classes = (): void =>
        err(() => {
            const { background_file, background_container_i, opposite_background_container_i } =
                d_background.Background;
            const is_img_or_color =
                s_background.Type.is_img({ background_container_i }) ||
                s_background.Type.is_color({ background_container_i });
            const is_img_or_color_opposite =
                s_background.Type.is_img({
                    background_container_i: opposite_background_container_i,
                }) ||
                s_background.Type.is_color({
                    background_container_i: opposite_background_container_i,
                });
            const is_video = s_background.Type.is_video({ background_container_i });
            const is_video_opposite = s_background.Type.is_video({
                background_container_i: opposite_background_container_i,
            });
            const is_crossfade_background_change_effect: boolean =
                data.settings.prefs.background_change_effect === 'crossfade';
            const is_no_effect_background_change_effect: boolean =
                data.settings.prefs.background_change_effect === 'no_effect';

            this.z_index_plus_1_cls[background_container_i] = '';
            this.z_index_plus_1_cls[opposite_background_container_i] = 'z_index_plus_1';

            this.img_no_tr_cls[background_container_i] = 'no_tr';
            this.img_no_tr_cls[opposite_background_container_i] = this.get_no_tr_cls({
                is_background: is_img_or_color_opposite,
            });
            this.video_no_tr_cls[background_container_i] = 'no_tr';
            this.video_no_tr_cls[opposite_background_container_i] = this.get_no_tr_cls({
                is_background: is_video_opposite,
            });

            this.img_is_visible_cls[background_container_i] = is_img_or_color ? '' : 'opacity_0';
            this.img_is_visible_cls[opposite_background_container_i] =
                is_crossfade_background_change_effect || is_no_effect_background_change_effect
                    ? 'opacity_0'
                    : '';
            this.video_is_visible_cls[background_container_i] = is_video ? '' : 'opacity_0';
            this.video_is_visible_cls[opposite_background_container_i] =
                is_crossfade_background_change_effect || is_no_effect_background_change_effect
                    ? 'opacity_0'
                    : '';

            this.background_is_sliding_cls[background_container_i] = '';
            this.background_is_sliding_cls[opposite_background_container_i] =
                this.select_slide_direction();

            this.background_is_no_effect_cls[background_container_i] = '';
            this.background_is_no_effect_cls[opposite_background_container_i] =
                is_no_effect_background_change_effect ? 'no_effect' : '';

            if (n(background_file[background_container_i])) {
                const new_object_url_background_id: string = (
                    background_file[background_container_i] as i_db.BackgroundFile
                ).id;

                this.no_tr =
                    d_background.Background.current_object_url_background_id ===
                    new_object_url_background_id;
            }
        }, 'cnt_1051');

    get_no_tr_cls = ({ is_background }: { is_background: boolean }): string =>
        err(() => {
            const active_cls: string = 'no_tr';

            if (this.no_tr) {
                return active_cls;
            }

            return is_background ? '' : 'no_tr';
        }, 'cnt_1052');

    public select_slide_direction = (): string =>
        err(() => {
            if (data.settings.prefs.background_change_effect === 'slide') {
                if (data.settings.prefs.slide_direction === 'random') {
                    const random_slide_direction_i: number = random(
                        0,
                        this.slide_directions.length - 1,
                    );

                    return this.slide_directions[random_slide_direction_i];
                }

                return data.settings.prefs.slide_direction;
            }

            return '';
        }, 'cnt_1053');
}

export const Classes = Class.get_instance();
