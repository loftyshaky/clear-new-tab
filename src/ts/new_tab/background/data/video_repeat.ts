import _ from 'lodash';
import { makeObservable, observable, action } from 'mobx';

import { i_db } from 'shared/internal';
import { d_background, i_background } from 'new_tab/internal';

export class VideoReapeat {
    private static i0: VideoReapeat;

    public static i(): VideoReapeat {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            video_repeat_positions: observable,
            loaded_videos_count: observable,
            calculate_video_repeat_positions: action,
            increment_loaded_videos_count: action,
        });
    }

    private repeated_video_positions_item_default_val: i_background.Position[] = [];

    public video_repeat_positions: i_background.Position[][] = [
        this.repeated_video_positions_item_default_val,
        this.repeated_video_positions_item_default_val,
    ];

    public single_video_repeat_positions: i_background.Position[] = _.clone(
        this.repeated_video_positions_item_default_val,
    );

    private horizontal_video_repeat_positions: i_background.Position[] = _.clone(
        this.repeated_video_positions_item_default_val,
    );

    private video_repeat_count_default_vals: i_background.VideoRepeatCount = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    private video_repeat_count: i_background.VideoRepeatCount =
        this.video_repeat_count_default_vals;

    private browser_window_width: number = 0;
    private browser_window_height: number = 0;
    private background_width: number = 0;
    private background_height: number = 0;
    private half_background_width: number = 0;
    private half_background_height: number = 0;
    private background_left_offset: number = 0;
    private background_right_offset: number = 0;
    private background_top_offset: number = 0;
    private background_bottom_offset: number = 0;
    private may_repeat_to_left: boolean = false;
    private may_repeat_to_right: boolean = false;
    private may_repeat_to_top: boolean = false;
    private may_repeat_to_bottom: boolean = false;
    private background_position_is_center_x: boolean = false;
    private background_position_is_center_y: boolean = false;
    private main_video_positioned_to_left_edge: boolean = false;
    private main_video_positioned_to_right_edge: boolean = false;
    private main_video_positioned_to_top_edge: boolean = false;
    private main_video_positioned_to_bottom_edge: boolean = false;
    private positioned_to_center: boolean = false;
    private left: number | undefined;
    private right: number | undefined;
    private top: number | undefined;
    private bottom: number | undefined;
    public total_videos_count: number = 0;
    public loaded_videos_count: number = 0;

    public calculate_video_repeat_positions = (): i_background.Position[] =>
        err(() => {
            if (data.settings.enable_video_repeat) {
                const calculate_video_repeat_positions_for_side = ({
                    dim,
                    direction,
                    modifier,
                }: {
                    dim: i_background.Dim;
                    direction: i_background.Direction;
                    modifier: number;
                }): i_background.Position[] =>
                    err(() => {
                        this.video_repeat_count[direction] = Math.floor(
                            (this[`browser_window_${dim}`] -
                                (this[
                                    `background_position_is_center_${dim === 'width' ? 'x' : 'y'}`
                                ]
                                    ? this[`browser_window_${dim}`] -
                                      this[`background_${direction}_offset`]
                                    : 0)) /
                                this[`background_${dim}`] +
                                modifier,
                        );

                        const video_repeat_positions: i_background.Position[] = Array(
                            this.video_repeat_count[direction],
                        )
                            .fill(0)
                            .map(
                                (
                                    video_repeat_count_item: number,
                                    i: number,
                                ): i_background.Position =>
                                    err(
                                        () =>
                                            this.calculate_repeated_video_position({
                                                direction,
                                                video_i: i,
                                            }),
                                        'cnt_1398',
                                    ),
                            );

                        return video_repeat_positions;
                    }, 'cnt_1384');

                const calculate_modifier = ({ axis }: { axis: 'x' | 'y' }): number =>
                    err(() => (this[`background_position_is_center_${axis}`] ? 1 : 0), 'cnt_1385');

                this.horizontal_video_repeat_positions = _.clone(
                    this.repeated_video_positions_item_default_val,
                );
                this.single_video_repeat_positions = _.clone(
                    this.repeated_video_positions_item_default_val,
                );
                this.video_repeat_count = _.clone(this.video_repeat_count_default_vals);

                const {
                    background_container_i,
                    get_background_position_no_dict,
                    get_background_repeat_no_dict,
                } = d_background.Main.i();

                this.browser_window_width = globalThis.innerWidth;
                this.browser_window_height = globalThis.innerHeight;
                const center_x: number = this.browser_window_width / 2;
                const center_y: number = this.browser_window_height / 2;

                this.background_width = (
                    d_background.Main.i().background_data[
                        background_container_i
                    ] as i_db.FileBackground
                ).width;
                this.background_height = (
                    d_background.Main.i().background_data[
                        background_container_i
                    ] as i_db.FileBackground
                ).height;
                this.half_background_width = this.background_width / 2;
                this.half_background_height = this.background_height / 2;
                const background_position: string = get_background_position_no_dict();
                const background_repeat: string = get_background_repeat_no_dict();
                const background_size: string =
                    d_background.BackgroundSize.i().get_background_size();
                this.background_position_is_center_x = ['top', 'center', 'bottom'].includes(
                    background_position,
                );
                this.background_position_is_center_y = [
                    'center',
                    'left_center',
                    'right_center',
                ].includes(background_position);

                this.background_left_offset = this.background_position_is_center_x
                    ? center_x - this.half_background_width
                    : 0;
                this.background_right_offset = this.background_position_is_center_x
                    ? center_x + this.half_background_width
                    : 0;
                this.background_top_offset = this.background_position_is_center_y
                    ? center_y - this.half_background_height
                    : 0;
                this.background_bottom_offset = this.background_position_is_center_y
                    ? center_y + this.half_background_height
                    : 0;

                this.may_repeat_to_left = [
                    'top',
                    'center',
                    'bottom',
                    'right_top',
                    'right_center',
                    'right_bottom',
                ].includes(background_position);
                this.may_repeat_to_right = [
                    'top',
                    'center',
                    'bottom',
                    'left_top',
                    'left_center',
                    'left_bottom',
                ].includes(background_position);
                this.may_repeat_to_top = [
                    'center',
                    'bottom',
                    'left_center',
                    'left_bottom',
                    'right_center',
                    'right_bottom',
                ].includes(background_position);
                this.may_repeat_to_bottom = [
                    'top',
                    'center',
                    'left_top',
                    'left_center',
                    'right_top',
                    'right_center',
                ].includes(background_position);
                this.positioned_to_center = ['center', 'left_center', 'right_center'].includes(
                    background_position,
                );

                const repeat_x: boolean = ['repeat', 'repeat_x'].includes(background_repeat);
                const repeat_y: boolean = ['repeat', 'repeat_y'].includes(background_repeat);

                if (background_size === 'dont_resize') {
                    this.calculate_main_background_position();

                    if (repeat_x) {
                        if (this.may_repeat_to_left) {
                            const left_video_repeat_positions =
                                calculate_video_repeat_positions_for_side({
                                    dim: 'width',
                                    direction: 'left',
                                    modifier: calculate_modifier({
                                        axis: 'x',
                                    }),
                                });

                            this.horizontal_video_repeat_positions.push(
                                ...left_video_repeat_positions,
                            );
                            this.single_video_repeat_positions.push(...left_video_repeat_positions);
                        }

                        if (this.may_repeat_to_right) {
                            const right_video_repeat_positions =
                                calculate_video_repeat_positions_for_side({
                                    dim: 'width',
                                    direction: 'right',
                                    modifier: 0,
                                });

                            this.horizontal_video_repeat_positions.push(
                                ...right_video_repeat_positions,
                            );
                            this.single_video_repeat_positions.push(
                                ...right_video_repeat_positions,
                            );
                        }
                    }

                    if (repeat_y) {
                        if (this.may_repeat_to_top) {
                            const top_video_repeat_positions =
                                calculate_video_repeat_positions_for_side({
                                    dim: 'height',
                                    direction: 'top',
                                    modifier: calculate_modifier({
                                        axis: 'y',
                                    }),
                                });

                            this.single_video_repeat_positions.push(...top_video_repeat_positions);
                        }

                        if (this.may_repeat_to_bottom) {
                            const bottom_video_repeat_positions =
                                calculate_video_repeat_positions_for_side({
                                    dim: 'height',
                                    direction: 'bottom',
                                    modifier: 0,
                                });

                            this.single_video_repeat_positions.push(
                                ...bottom_video_repeat_positions,
                            );
                        }
                    }
                }

                if (background_repeat === 'repeat') {
                    this.calculate_repeated_video_position_with_repeat_setting({
                        direction: 'top',
                    });
                    this.calculate_repeated_video_position_with_repeat_setting({
                        direction: 'bottom',
                    });
                }

                /*
            // eslint-disable-next-line no-console
            console.log(
                'video_repeat_count:',
                this.video_repeat_count,
                'video_repeat_positions:',
                this.single_video_repeat_positions,
                'browser_window_width:',
                this.browser_window_width,
                'background_width:',
                this.background_width,
                'half_background_width:',
                this.half_background_width,
                'background_left_offset:',
                this.background_left_offset,
                'background_right_offset:',
                this.background_right_offset,
                'browser_window_height:',
                this.browser_window_height,
                'background_height:',
                this.background_height,
                'half_background_height:',
                this.half_background_height,
                'background_top_offset:',
                this.background_top_offset,
                'background_bottom_offset:',
                this.background_bottom_offset,
            );
*/

                this.total_videos_count = this.single_video_repeat_positions.length;

                return this.single_video_repeat_positions;
            }

            return this.repeated_video_positions_item_default_val;
        }, 'cnt_1380');

    private calculate_repeated_video_position = ({
        video_i,
        direction,
    }: {
        video_i: number;
        direction: i_background.Direction;
    }): i_background.Position =>
        err(() => {
            const calculate_repeated_video_position_of_side = ({
                direction_reverse,
                dim,
                first_psition_modifier = 0,
                secondary_position_key_1,
                secondary_position_key_2,
                secondary_position_key_3,
            }: {
                direction_reverse: i_background.Direction;
                dim: i_background.Dim;
                first_psition_modifier?: number;
                secondary_position_key_1: i_background.Direction;
                secondary_position_key_2: i_background.Direction;
                secondary_position_key_3: i_background.Direction;
            }): void =>
                err(() => {
                    this[direction_reverse] =
                        this[`background_${direction}_offset`] +
                        (!is_first_repeating_video ||
                        this[`main_video_positioned_to_${direction_reverse}_edge`]
                            ? this[`background_${dim}`]
                            : 0) *
                            (video_i +
                                (this[`main_video_positioned_to_${direction_reverse}_edge`]
                                    ? 1
                                    : 0)) +
                        first_psition_modifier;

                    if (this[`main_video_positioned_to_${secondary_position_key_1}_edge`]) {
                        this[secondary_position_key_1] =
                            this[`background_${secondary_position_key_1}_offset`];
                    } else if (this[`main_video_positioned_to_${secondary_position_key_2}_edge`]) {
                        this[secondary_position_key_2] =
                            this[`background_${secondary_position_key_2}_offset`];
                    } else {
                        this[secondary_position_key_3] =
                            this[`background_${secondary_position_key_3}_offset`];
                    }
                }, 'cnt_1396');

            this.left = undefined;
            this.right = undefined;
            this.top = undefined;
            this.bottom = undefined;
            const is_first_repeating_video = video_i === 0;
            const background_position: string =
                d_background.Main.i().get_background_position_no_dict();
            this.main_video_positioned_to_left_edge = [
                'left_top',
                'left_center',
                'left_bottom',
            ].includes(background_position);
            this.main_video_positioned_to_right_edge = [
                'right_top',
                'right_center',
                'right_bottom',
            ].includes(background_position);
            this.main_video_positioned_to_top_edge = ['top', 'left_top', 'right_top'].includes(
                background_position,
            );
            this.main_video_positioned_to_bottom_edge = [
                'bottom',
                'left_bottom',
                'right_bottom',
            ].includes(background_position);

            if (direction === 'right') {
                calculate_repeated_video_position_of_side({
                    direction_reverse: 'left',
                    dim: 'width',
                    secondary_position_key_1: 'top',
                    secondary_position_key_2: 'bottom',
                    secondary_position_key_3: 'top',
                });
            } else if (direction === 'left') {
                calculate_repeated_video_position_of_side({
                    direction_reverse: 'right',
                    dim: 'width',
                    first_psition_modifier: this.main_video_positioned_to_right_edge
                        ? 0
                        : this.background_width,
                    secondary_position_key_1: 'bottom',
                    secondary_position_key_2: 'top',
                    secondary_position_key_3: 'top',
                });
            } else if (direction === 'top') {
                calculate_repeated_video_position_of_side({
                    direction_reverse: 'bottom',
                    dim: 'height',
                    first_psition_modifier: this.background_position_is_center_y
                        ? this.background_height
                        : 0,
                    secondary_position_key_1: 'right',
                    secondary_position_key_2: 'left',
                    secondary_position_key_3: 'left',
                });
            } else if (direction === 'bottom') {
                calculate_repeated_video_position_of_side({
                    direction_reverse: 'top',
                    dim: 'height',
                    secondary_position_key_1: 'left',
                    secondary_position_key_2: 'right',
                    secondary_position_key_3: 'left',
                });
            }

            return {
                left: n(this.left) ? x.px(this.left) : '',
                right: n(this.right) ? x.px(this.right) : '',
                top: n(this.top) ? x.px(this.top) : '',
                bottom: n(this.bottom) ? x.px(this.bottom) : '',
            };
        }, 'cnt_1390');

    private calculate_repeated_video_position_with_repeat_setting = ({
        direction,
    }: {
        direction: i_background.Direction;
    }): void =>
        err(() => {
            const horizontal_video_repeat_positions_cloned = _.clone(
                this.horizontal_video_repeat_positions,
            );

            Array(this.video_repeat_count[direction])
                .fill(0)
                .forEach((video_repeat_count_item: number, i: number): void =>
                    err(() => {
                        const new_video_repeat_positions =
                            horizontal_video_repeat_positions_cloned.map(
                                (item: i_background.Position): i_background.Position =>
                                    err(() => {
                                        const calculate_offset = ({
                                            modifier = 0,
                                        }: {
                                            modifier?: number;
                                        } = {}): string =>
                                            err(
                                                () =>
                                                    x.px(
                                                        this[`background_${direction}_offset`] +
                                                            this.background_height * (i + modifier),
                                                    ),
                                                'cnt_65466',
                                            );

                                        return {
                                            left: item.left,
                                            right: item.right,
                                            top:
                                                direction === 'bottom'
                                                    ? calculate_offset({
                                                          modifier: this.positioned_to_center
                                                              ? 0
                                                              : 1,
                                                      })
                                                    : '',

                                            bottom:
                                                direction === 'top'
                                                    ? calculate_offset({
                                                          modifier: this.positioned_to_center
                                                              ? 1
                                                              : 1,
                                                      })
                                                    : '',
                                        };
                                    }, 'cnt_1401'),
                            );

                        this.single_video_repeat_positions.push(...new_video_repeat_positions);
                    }, 'cnt_1398'),
                );
        }, 'cnt_1400');

    private calculate_main_background_position = (): void =>
        err(() => {
            const may_repeat_to_left_and_right: boolean =
                this.may_repeat_to_left && this.may_repeat_to_right;
            const may_repeat_to_top_and_bottom: boolean =
                this.may_repeat_to_top && this.may_repeat_to_bottom;

            const main_background_position = {
                left:
                    this.may_repeat_to_right && !may_repeat_to_left_and_right
                        ? x.px(this.background_right_offset)
                        : '',
                right:
                    this.may_repeat_to_left || may_repeat_to_left_and_right
                        ? x.px(this.background_left_offset)
                        : '',
                top:
                    this.may_repeat_to_bottom && !may_repeat_to_top_and_bottom
                        ? x.px(this.background_bottom_offset)
                        : '',
                bottom:
                    this.may_repeat_to_top || may_repeat_to_top_and_bottom
                        ? x.px(this.background_top_offset)
                        : '',
            };

            this.single_video_repeat_positions.push(main_background_position);
        }, 'cnt_1403');

    public increment_loaded_videos_count = (): void =>
        err(() => {
            this.loaded_videos_count += 1;
        }, 'cnt_1399');
}
