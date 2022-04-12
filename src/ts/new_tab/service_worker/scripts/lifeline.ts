import { Runtime } from 'webextension-polyfill-ts';

export class Lifeline {
    private static i0: Lifeline;

    public static i(): Lifeline {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public lifeline: Runtime.Port | undefined;

    public connect = (): void =>
        err(() => {
            this.lifeline = we.runtime.connect({ name: 'keep_alive' });
        }, 'cnt_97654');

    public disconnect = (): void =>
        err(() => {
            this.lifeline?.disconnect();
        }, 'cnt_97654');
}
