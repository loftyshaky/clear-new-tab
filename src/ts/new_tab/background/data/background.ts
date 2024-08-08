import merge from 'lodash/merge';
import clone from 'lodash/clone';
import { makeObservable, observable, computed, action } from 'mobx';

import { t, i_color } from '@loftyshaky/shared/shared';
import { d_color } from '@loftyshaky/shared/inputs';
import { i_db } from 'shared_clean/internal';
import { d_background, s_background } from 'new_tab/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            background_container_i: observable,
            background_data: observable,
            background_file: observable,
            background: observable,
            background_position: observable,
            background_repeat: observable,
            color_of_area_around_background: observable,
            video_speed: observable,
            video_volume: observable,
            background_css: observable,
            opposite_background_container_i: computed,
            init_vars: action,
        });
    }

    private background_position_dict: { [index: string]: string } = {
        top: '50% 0%',
        center: '50% 50%',
        bottom: '50% 100%',
        left_top: '0% 0%',
        left_center: '0% 50%',
        left_bottom: '0% 100%',
        right_top: '100% 0%',
        right_center: '100% 50%',
        right_bottom: '100% 100%',
    };

    private background_repeat_dict: { [index: string]: string } = {
        no_repeat: 'no-repeat',
        repeat: 'repeat',
        repeat_y: 'repeat-y',
        repeat_x: 'repeat-x',
    };

    private default_val_1: (i_db.Background | undefined)[] = [undefined, undefined];
    private default_val_2: (i_db.BackgroundFile | undefined)[] = [undefined, undefined];
    public default_val_3: string[] = ['', ''];
    public default_val_4: number[] = [1, 1];
    public default_val_5: number[] = [0, 0];
    private default_val_6: t.AnyRecord[] = [{}, {}];
    public background_container_i: number = 1;
    public background_data: (i_db.Background | undefined)[] = [];
    public background_file: (i_db.BackgroundFile | string | undefined)[] = [];

    public background: string[] = [];
    public background_position: string[] = [];
    public background_repeat: string[] = [];
    public color_of_area_around_background: string[] = [];
    public video_speed: number[] = [];
    public video_volume: number[] = [];
    public background_css: t.AnyRecord[] = [];
    public current_object_url: string = '';
    public current_object_url_background_id: string = '';

    public get opposite_background_container_i() {
        return clone(this).background_container_i === 0 ? 1 : 0;
    }

    public init_vars = (): void =>
        err(() => {
            this.background_data = merge({}, this.default_val_1);
            this.background_file = merge({}, this.default_val_2);
            this.background = merge({}, this.default_val_3);
            this.background_position = merge({}, this.default_val_3);
            this.background_repeat = merge({}, this.default_val_3);
            this.color_of_area_around_background = merge({}, this.default_val_3);
            this.video_speed = merge({}, this.default_val_4);
            this.video_volume = merge({}, this.default_val_5);
            this.background_css = merge({}, this.default_val_6);
        }, 'cnt_1525');

    public get_background = (): string =>
        err(() => {
            const background_file = this.background_file[this.background_container_i];

            if (n(background_file)) {
                if (data.settings.mode === 'random_solid_color') {
                    return this.background_file[this.background_container_i] as string;
                }

                if (
                    s_background.Type.is_img_file({
                        background_container_i: this.background_container_i,
                    }) ||
                    s_background.Type.is_video({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    const new_object_url_background_id: string = (
                        background_file as i_db.BackgroundFile
                    ).id;

                    if (new_object_url_background_id === this.current_object_url_background_id) {
                        return this.current_object_url;
                    }

                    this.current_object_url_background_id = new_object_url_background_id;
                    this.current_object_url = n(s_background.Preview.id)
                        ? URL.createObjectURL(
                              // URL.createObjectURL can't be called in service worker
                              (background_file as i_db.BackgroundFile).background as File,
                          )
                        : ((background_file as i_db.BackgroundFile).background as string);

                    return this.current_object_url;
                }

                if (
                    s_background.Type.is_color({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    this.current_object_url_background_id = 'solid_color';

                    return d_color.Color.access_from_val({
                        val: (background_file as i_db.BackgroundFile).background as i_color.Color,
                    });
                }

                if (
                    s_background.Type.is_img_link({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return (background_file as i_db.BackgroundFile).background as string;
                }
            }

            return '';
        }, 'cnt_1054');

    public get_background_position_no_dict = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];

            if (n(background_data)) {
                if (this.is_dont_resize_or_browser_background_size()) {
                    return (background_data as i_db.FileBackground).background_position === 'global'
                        ? data.settings.background_position
                        : (background_data as i_db.FileBackground).background_position;
                }

                if (
                    s_background.Type.is_video({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return (background_data as i_db.FileBackground).background_position === 'global'
                        ? data.settings.background_position
                        : (background_data as i_db.FileBackground).background_position;
                }
            }

            return '';
        }, 'cnt_1055');

    public get_background_repeat_no_dict = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];

            if (n(background_data)) {
                return (background_data as i_db.FileBackground).background_repeat === 'global'
                    ? data.settings.background_repeat
                    : (background_data as i_db.FileBackground).background_repeat;
            }

            return '';
        }, 'cnt_1056');

    public get_background_repeat = (): string =>
        err(() => this.background_repeat_dict[this.get_background_repeat_no_dict()], 'cnt_1381');

    public get_background_position = (): string =>
        err(
            () =>
                this.is_dont_resize_or_browser_background_size()
                    ? this.background_position_dict[this.get_background_position_no_dict()]
                    : this.get_background_position_no_dict(),
            'cnt_1382',
        );

    public get_color_of_area_around_background = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];
            const no_backgrounds: boolean = data.settings.current_background_id === 0;

            if (
                (n(background_data) &&
                    (s_background.Type.is_img({
                        background_container_i: this.background_container_i,
                    }) ||
                        s_background.Type.is_video({
                            background_container_i: this.background_container_i,
                        }))) ||
                no_backgrounds
            ) {
                return no_backgrounds ||
                    (background_data as i_db.FileBackground).color_of_area_around_background ===
                        'global'
                    ? d_color.Color.access_from_val({
                          val: data.settings.color_of_area_around_background,
                      })
                    : d_color.Color.access_from_val({
                          val: (background_data as i_db.FileBackground)
                              .color_of_area_around_background,
                      });
            }

            return '';
        }, 'cnt_1057');

    public get_video_val = ({ type }: { type: 'speed' | 'volume' }): number =>
        err(() => {
            if (
                s_background.Type.is_video({
                    background_container_i: this.background_container_i,
                })
            ) {
                const background_data = this.background_data[this.background_container_i];
                const key: string = `video_${type}`;

                return n(background_data) &&
                    (background_data as i_db.FileBackground)[key] === 'global'
                    ? data.settings[key]
                    : (background_data as i_db.FileBackground)[key];
            }

            return '';
        }, 'cnt_1058');

    public get_background_css = (): t.AnyRecord =>
        err(() => {
            if (data.settings.mode === 'random_solid_color') {
                const background_file = this.background_file[this.background_container_i];

                return {
                    backgroundColor: background_file,
                };
            }

            if (
                s_background.Type.is_img({
                    background_container_i: this.background_container_i,
                })
            ) {
                return {
                    background: `url("${this.background[this.background_container_i]}") ${
                        this.background_position[this.background_container_i]
                    } / ${
                        d_background.BackgroundSize.background_size[this.background_container_i]
                    } ${this.background_repeat[this.background_container_i]} ${
                        this.color_of_area_around_background[this.background_container_i]
                    }`,
                };
            }

            if (
                s_background.Type.is_video({
                    background_container_i: this.background_container_i,
                })
            ) {
                return {
                    backgroundColor:
                        this.color_of_area_around_background[this.background_container_i],
                    objectFit:
                        d_background.BackgroundSize.background_size[this.background_container_i],
                    objectPosition: this.background_position[this.background_container_i],
                    width: d_background.BackgroundSize.video_width[this.background_container_i],

                    height: d_background.BackgroundSize.video_height[this.background_container_i],
                };
            }

            if (
                s_background.Type.is_color({
                    background_container_i: this.background_container_i,
                })
            ) {
                const background_file = this.background_file[this.background_container_i];

                if (n(background_file) && n((background_file as i_db.BackgroundFile).background)) {
                    return {
                        backgroundColor: (background_file as i_db.BackgroundFile)
                            .background as string,
                    };
                }
            }

            return {};
        }, 'cnt_1059');

    public get_video_background_css = ({
        background_container_i,
    }: {
        background_container_i: number;
    }): t.AnyRecord =>
        err(() => {
            if (s_background.Type.is_video({ background_container_i })) {
                return this.background_css[background_container_i];
            }

            return {};
        }, 'cnt_1060');

    public is_dont_resize_or_browser_background_size = (): boolean =>
        err(
            () =>
                s_background.Type.is_img({
                    background_container_i: this.background_container_i,
                }) ||
                (s_background.Type.is_video({
                    background_container_i: this.background_container_i,
                }) &&
                    d_background.BackgroundSize.background_size_setting[
                        this.background_container_i
                    ].includes('browser')) ||
                d_background.BackgroundSize.background_size_setting[this.background_container_i] ===
                    'dont_resize',
            'cnt_1408',
        );
}

export const Background = Class.get_instance();
