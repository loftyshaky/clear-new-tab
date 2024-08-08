import { d_custom_code } from 'sandbox/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public listen = (e: MessageEvent): void => {
        const msg_str: string = e.data.command;

        if (msg_str === 'set_custom_code') {
            d_custom_code.CustomCode.set_custom_code({ custom_code: e.data.value });
        }
    };
}

export const Msgs = Class.get_instance();
