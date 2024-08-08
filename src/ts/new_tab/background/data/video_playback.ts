import { makeObservable, observable, action } from 'mobx';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

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
        }, 'cnt_1061');
}

export const VideoPlayback = Class.get_instance();
