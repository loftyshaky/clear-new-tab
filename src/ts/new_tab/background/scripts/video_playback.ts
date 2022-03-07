import { d_background } from 'new_tab/internal';

export class VideoPlayback {
    private static i0: VideoPlayback;

    public static i(): VideoPlayback {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

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
        }, 'cnt_53654');

    public pause_video = ({
        background_container_i,
        video_el,
    }: {
        background_container_i: number;
        video_el: HTMLVideoElement | undefined;
    }): void =>
        err(() => {
            if (n(video_el)) {
                const is_hidden_video: boolean =
                    background_container_i ===
                    d_background.Main.i().opposite_background_container_i;

                if (is_hidden_video) {
                    video_el.pause();
                }
            }
        }, 'cnt_86545');
}
