import _ from 'lodash';
import { makeObservable, observable, computed } from 'mobx';

import { t } from '@loftyshaky/shared';
import { d_color, i_color } from '@loftyshaky/shared/inputs';
import { i_db } from 'shared/internal';
import { d_background, s_background } from 'new_tab/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            background_container_i: observable,
            background_data: observable,
            background_file: observable,
            background: observable,
            background_position: observable,
            background_repeat: observable,
            color_of_area_around_background: observable,
            video_volume: observable,
            background_css: observable,
            opposite_background_container_i: computed,
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
        bottom: '50% 100%',
        repeat_y: 'repeat-y',
        repeat_x: 'repeat-x',
    };

    private default_val_1: (i_db.Background | undefined)[] = [undefined, undefined];
    private default_val_2: (i_db.BackgroundFile | undefined)[] = [undefined, undefined];
    public default_val_3: string[] = ['', ''];
    private default_val_4: t.AnyRecord[] = [{}, {}];
    public background_container_i: number = 1;
    public background_data: (i_db.Background | undefined)[] = this.default_val_1;
    public background_file: (i_db.BackgroundFile | undefined)[] = this.default_val_2;
    public background: string[] = this.default_val_3;
    public background_position: string[] = this.default_val_3;
    public background_repeat: string[] = this.default_val_3;
    public color_of_area_around_background: string[] = this.default_val_3;
    public video_volume: string[] = this.default_val_3;
    public background_css: t.AnyRecord[] = this.default_val_4;

    public get opposite_background_container_i() {
        return _.clone(this).background_container_i === 0 ? 1 : 0;
    }

    public get_background = (): string =>
        err(() => {
            const background_file = this.background_file[this.background_container_i];

            if (n(background_file)) {
                if (
                    s_background.Type.i().is_img_file({
                        background_container_i: this.background_container_i,
                    }) ||
                    s_background.Type.i().is_video({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return URL.createObjectURL(background_file.background as File);
                }

                if (
                    s_background.Type.i().is_color({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return d_color.Color.i().access_from_val({
                        val: background_file.background as i_color.Color,
                    });
                }

                if (
                    s_background.Type.i().is_img_link({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return background_file.background as string;
                }
            }

            return '';
        }, 'cnt_75354');

    public get_background_position = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];

            if (n(background_data)) {
                if (
                    s_background.Type.i().is_img({
                        background_container_i: this.background_container_i,
                    }) ||
                    (s_background.Type.i().is_video({
                        background_container_i: this.background_container_i,
                    }) &&
                        (d_background.BackgroundSize.i().background_size_setting[
                            this.background_container_i
                        ].includes('browser') ||
                            d_background.BackgroundSize.i().background_size_setting[
                                this.background_container_i
                            ] === 'dont_resize'))
                ) {
                    return (background_data as i_db.FileBackground).background_position === 'global'
                        ? this.background_position_dict[data.settings.background_position]
                        : this.background_position_dict[
                              (background_data as i_db.FileBackground).background_position
                          ];
                }

                if (
                    s_background.Type.i().is_video({
                        background_container_i: this.background_container_i,
                    })
                ) {
                    return (background_data as i_db.FileBackground).background_position === 'global'
                        ? data.settings.background_position
                        : (background_data as i_db.FileBackground).background_position;
                }
            }

            return '';
        }, 'cnt_75646');

    public get_background_repeat = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];

            if (
                n(background_data) &&
                s_background.Type.i().is_img({
                    background_container_i: this.background_container_i,
                })
            ) {
                return (background_data as i_db.FileBackground).background_repeat === 'global'
                    ? this.background_repeat_dict[data.settings.background_repeat]
                    : this.background_repeat_dict[
                          (background_data as i_db.FileBackground).background_repeat
                      ];
            }

            return '';
        }, 'cnt_75384');

    public get_color_of_area_around_background = (): string =>
        err(() => {
            const background_data = this.background_data[this.background_container_i];

            if (
                n(background_data) &&
                (s_background.Type.i().is_img({
                    background_container_i: this.background_container_i,
                }) ||
                    s_background.Type.i().is_video({
                        background_container_i: this.background_container_i,
                    }))
            ) {
                return (background_data as i_db.FileBackground).color_of_area_around_background ===
                    'global'
                    ? d_color.Color.i().access_from_val({
                          val: data.settings.color_of_area_around_background,
                      })
                    : d_color.Color.i().access_from_val({
                          val: (background_data as i_db.FileBackground)
                              .color_of_area_around_background,
                      });
            }

            return '';
        }, 'cnt_84625');

    public get_video_volume = (): string =>
        err(() => {
            if (
                s_background.Type.i().is_video({
                    background_container_i: this.background_container_i,
                })
            ) {
                const background_data = this.background_data[this.background_container_i];

                return n(background_data) &&
                    (background_data as i_db.FileBackground).video_volume === 'global'
                    ? data.settings.video_volume
                    : (background_data as i_db.FileBackground).video_volume;
            }

            return '';
        }, 'cnt_84625');

    public get_background_css = (): any =>
        err(() => {
            if (
                s_background.Type.i().is_img({
                    background_container_i: this.background_container_i,
                })
            ) {
                return {
                    background: `url("${this.background[this.background_container_i]}") ${
                        this.background_position[this.background_container_i]
                    } / ${
                        d_background.BackgroundSize.i().background_size[this.background_container_i]
                    } ${this.background_repeat[this.background_container_i]} ${
                        this.color_of_area_around_background[this.background_container_i]
                    }`,
                };
            }

            if (
                s_background.Type.i().is_video({
                    background_container_i: this.background_container_i,
                })
            ) {
                return {
                    backgroundColor:
                        this.color_of_area_around_background[this.background_container_i],
                    objectFit:
                        d_background.BackgroundSize.i().background_size[
                            this.background_container_i
                        ],
                    objectPosition: this.background_position[this.background_container_i],
                    width: d_background.BackgroundSize.i().video_width[this.background_container_i],
                    height: d_background.BackgroundSize.i().video_height[
                        this.background_container_i
                    ],
                };
            }

            if (
                s_background.Type.i().is_color({
                    background_container_i: this.background_container_i,
                })
            ) {
                const background_file = this.background_file[this.background_container_i];

                if (n(background_file) && n(background_file.background)) {
                    return {
                        backgroundColor: background_file.background as string,
                    };
                }
            }

            return {};
        }, 'cnt_84625');

    public get_video_background_css = ({
        background_container_i,
    }: {
        background_container_i: number;
    }): any =>
        err(() => {
            if (s_background.Type.i().is_video({ background_container_i })) {
                return this.background_css[background_container_i];
            }

            return {};
        }, 'cnt_65435');
}
