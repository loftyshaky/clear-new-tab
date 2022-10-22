import { d_background } from 'new_tab/internal';

export class VideoPlayback {
    private static i0: VideoPlayback;

    public static i(): VideoPlayback {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

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
        video_el,
    }: {
        video_speed: number;
        video_el: HTMLVideoElement | undefined;
    }): void =>
        err(() => {
            if (n(video_el)) {
                video_el.playbackRate = video_speed;
            }
        }, 'cnt_1072');

    public set_video_volume = ({
        video_volume,
        video_el,
    }: {
        video_volume: number;
        video_el: HTMLVideoElement | undefined;
    }): void =>
        err(() => {
            if (n(video_el)) {
                video_el.volume = video_volume;
            }
        }, 'cnt_1072');

    public pause_hidden_video = ({
        background_container_i,
        video_el,
    }: {
        background_container_i: number;
        video_el: HTMLVideoElement | undefined;
    }): void =>
        err(() => {
            if (n(video_el)) {
                const is_visible_video: boolean = this.is_visible_video({ background_container_i });

                if (!is_visible_video) {
                    video_el.pause();
                }
            }
        }, 'cnt_1073');

    public play_or_pause_current_video = ({
        play_status,
        background_container_i,
        video_el,
    }: {
        play_status: 'play' | 'pause';
        background_container_i: number;
        video_el: HTMLVideoElement | undefined;
    }): void =>
        err(() => {
            if (n(video_el)) {
                const is_visible_video: boolean = this.is_visible_video({
                    background_container_i,
                });

                if (is_visible_video) {
                    video_el[play_status]();
                }
            }
        }, 'cnt_1074');
}
