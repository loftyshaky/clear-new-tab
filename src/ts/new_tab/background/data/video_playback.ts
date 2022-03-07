import { makeObservable, observable, action } from 'mobx';

export class VideoPlayback {
    private static i0: VideoPlayback;

    public static i(): VideoPlayback {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            is_playing: observable,
            set_play_status: action,
        });
    }

    public is_playing: boolean = true;

    public set_play_status = ({ is_playing }: { is_playing: boolean }): void =>
        err(() => {
            this.is_playing = is_playing;
        }, 'cnt_86545');
}
