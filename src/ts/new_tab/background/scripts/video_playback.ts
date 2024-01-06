import { d_background } from 'new_tab/internal';

export class VideoPlayback {
    private static i0: VideoPlayback;

    public static i(): VideoPlayback {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public video_els: HTMLVideoElement[] = [];

    private is_visible_video = ({
        background_container_i,
    }: {
        background_container_i: number;
    }): boolean =>
        err(
            () => background_container_i === d_background.Main.i().background_container_i,
            'cnt_1071',
        );

    public set_video_speed = ({
        video_speed,
        video_els,
    }: {
        video_speed: number;
        video_els: HTMLVideoElement[];
    }): void =>
        err(() => {
            video_els.forEach((video_el: HTMLVideoElement): void =>
                err(() => {
                    video_el.playbackRate = video_speed;
                }, 'cnt_1401'),
            );
        }, 'cnt_1072');

    public set_video_volume = ({
        video_volume,
        video_els,
    }: {
        video_volume: number;
        video_els: HTMLVideoElement[] | undefined;
    }): void =>
        err(() => {
            if (n(video_els)) {
                if (n(video_els[0])) {
                    video_els[0].volume = video_volume;
                }

                video_els.forEach((video_el: HTMLVideoElement, i: number): void =>
                    err(() => {
                        if (i !== 0) {
                            video_el.volume = 0;
                        }
                    }, 'cnt_1399'),
                );
            }
        }, 'cnt_1072');

    public play_or_pause_current_video = ({
        play_status,
        background_container_i,
        video_els,
        video_speed,
        is_visible_video_comparison_bool = true,
    }: {
        play_status: 'play' | 'pause';
        background_container_i: number;
        video_els: HTMLVideoElement[] | undefined;
        video_speed: number;
        is_visible_video_comparison_bool?: boolean;
    }): void =>
        err(() => {
            if (n(video_els)) {
                const is_visible_video: boolean = this.is_visible_video({
                    background_container_i,
                });

                if (is_visible_video === is_visible_video_comparison_bool && video_speed !== 0) {
                    video_els.forEach((video_el: HTMLVideoElement): void =>
                        err(() => {
                            this.restart_video({ video_el });

                            video_el[play_status]();
                        }, 'cnt_1392'),
                    );
                }
            }
        }, 'cnt_1074');

    private restart_video = ({ video_el }: { video_el: HTMLVideoElement }): void =>
        err(() => {
            if (document.hidden) {
                video_el.currentTime = 0;
            }
        }, 'cnt_1395');

    public set_video_els = ({
        video_el,
        repeated_video_els,
    }: {
        video_el: HTMLVideoElement | undefined;
        repeated_video_els: HTMLVideoElement[] | undefined;
    }): void =>
        err(() => {
            if (n(video_el) && n(repeated_video_els)) {
                this.video_els = [video_el, ...repeated_video_els].filter((item): boolean =>
                    err(() => n(item), 'cnt_1393'),
                );
            }
        }, 'cnt_1399');
}
