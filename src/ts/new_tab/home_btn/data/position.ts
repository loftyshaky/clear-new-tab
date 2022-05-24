import { makeObservable, computed } from 'mobx';

export class Position {
    private static i0: Position;

    public static i(): Position {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            position: computed,
        });
    }

    public get position() {
        return `home_btn_${data.settings.home_btn_position}`;
    }
}
