import _ from 'lodash';
import { makeObservable, observable, computed, runInAction, autorun } from 'mobx';

import { d_color, i_color } from '@loftyshaky/shared/inputs';
import { s_db, i_db } from 'shared/internal';
import { d_background, s_background } from 'new_tab/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable<this, 'background'>(this, {
            current_background_data: observable,
            current_background_file: observable,
            background: computed,
            background_position: computed,
            background_repeat: computed,
            color_of_area_around_background: computed,
            video_volume: computed,
            background_css: computed,
        });
    }

    public current_background_data: i_db.Background | undefined = undefined;
    public current_background_file: i_db.BackgroundFile | undefined = undefined;

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

    public get background() {
        if (n(this.current_background_file)) {
            if (s_background.Type.i().is_img_file() || s_background.Type.i().is_video()) {
                return URL.createObjectURL(this.current_background_file.background as File);
            }

            if (s_background.Type.i().is_color()) {
                return d_color.Color.i().access_from_val({
                    val: this.current_background_file.background as i_color.Color,
                });
            }

            if (s_background.Type.i().is_img_link()) {
                return this.current_background_file.background as string;
            }
        }

        return '';
    }

    public get background_position() {
        if (n(this.current_background_data)) {
            if (
                s_background.Type.i().is_img() ||
                (s_background.Type.i().is_video() &&
                    d_background.BackgroundSize.i().background_size_setting.includes('browser'))
            ) {
                return (this.current_background_data as i_db.FileBackground).background_position ===
                    'global'
                    ? this.background_position_dict[data.settings.background_position]
                    : this.background_position_dict[
                          (this.current_background_data as i_db.FileBackground).background_position
                      ];
            }

            if (s_background.Type.i().is_video()) {
                return (this.current_background_data as i_db.FileBackground).background_position ===
                    'global'
                    ? data.settings.background_position
                    : (this.current_background_data as i_db.FileBackground).background_position;
            }
        }

        return '';
    }

    public get background_repeat() {
        if (s_background.Type.i().is_img()) {
            return n(this.current_background_data) &&
                (this.current_background_data as i_db.FileBackground).background_repeat === 'global'
                ? this.background_repeat_dict[data.settings.background_repeat]
                : this.background_repeat_dict[
                      (this.current_background_data as i_db.FileBackground).background_repeat
                  ];
        }

        return '';
    }

    public get color_of_area_around_background() {
        if (s_background.Type.i().is_img() || s_background.Type.i().is_video()) {
            return n(this.current_background_data) &&
                (this.current_background_data as i_db.FileBackground)
                    .color_of_area_around_background === 'global'
                ? d_color.Color.i().access_from_val({
                      val: data.settings.color_of_area_around_background,
                  })
                : d_color.Color.i().access_from_val({
                      val: (this.current_background_data as i_db.FileBackground)
                          .color_of_area_around_background,
                  });
        }

        return '';
    }

    public get video_volume() {
        if (s_background.Type.i().is_video()) {
            return n(this.current_background_data) &&
                (this.current_background_data as i_db.FileBackground).video_volume === 'global'
                ? data.settings.video_volume
                : (this.current_background_data as i_db.FileBackground).video_volume;
        }

        return '';
    }

    public get background_css() {
        if (s_background.Type.i().is_img()) {
            return {
                background: `url("${this.background}") ${this.background_position} / ${
                    d_background.BackgroundSize.i().background_size
                } ${this.background_repeat} ${this.color_of_area_around_background}`,
            };
        }

        if (s_background.Type.i().is_video()) {
            return {
                backgroundColor: this.color_of_area_around_background,
                objectFit: d_background.BackgroundSize.i().background_size,
                objectPosition: this.background_position,
                width: d_background.BackgroundSize.i().video_width,
                height: d_background.BackgroundSize.i().video_height,
            };
        }

        if (s_background.Type.i().is_color()) {
            if (n(this.current_background_file) && n(this.current_background_file.background)) {
                return {
                    backgroundColor: this.current_background_file.background as string,
                };
            }
        }

        return {};
    }

    public update_background = (): Promise<void> =>
        err_async(async () => {
            const current_background_data: i_db.Background =
                await s_db.Manipulation.i().get_background({
                    id: data.settings.current_background_id,
                });

            const current_background_file: i_db.BackgroundFile =
                await s_db.Manipulation.i().get_background_file({
                    id: data.settings.current_background_id,
                });

            if (!_.isEqual(this.current_background_data, current_background_data)) {
                URL.revokeObjectURL(this.background);
            }

            runInAction(() =>
                err(() => {
                    this.current_background_data = current_background_data;
                    this.current_background_file = current_background_file;
                }, 'cnt_84755'),
            );

            d_background.BackgroundSize.i().determine_background_size();
        }, 'cnt_75465');

    public change_background_autorun = (): void =>
        err(() => {
            autorun(this.update_background);
        }, 'cnt_75465');
}
