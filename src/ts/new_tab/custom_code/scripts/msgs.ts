import { s_custom_code, s_db, i_db } from 'shared/internal';

export class Msgs {
    private static i0: Msgs;

    public static i(): Msgs {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public custom_code: i_db.CustomCode = s_custom_code.Main.i().default_custom_code;

    public send_set_custom_code_msg = (): Promise<void> =>
        err_async(async () => {
            const sandbox = s<HTMLIFrameElement>('.sandbox');
            const custom_code: i_db.CustomCode = await s_db.Manipulation.i().get_custom_code();

            if (n(sandbox) && n(sandbox.contentWindow)) {
                sandbox.contentWindow.postMessage(
                    {
                        command: 'set_custom_code',
                        value: custom_code,
                    },
                    '*',
                );
            }
        }, 'cnt_77664');
}
