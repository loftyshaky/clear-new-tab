import { d_custom_code } from 'sandbox/internal';

export class Msgs {
    private static i0: Msgs;

    public static i(): Msgs {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public listen = (e: MessageEvent): void => {
        const msg_str: string = e.data.command;

        if (msg_str === 'set_custom_code') {
            d_custom_code.Main.i().set_custom_code({ custom_code: e.data.value });
        }
    };
}
