import type { i_db } from 'shared_clean/internal';
import { s_custom_code, s_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public custom_code: i_db.CustomCode = s_custom_code.CustomCode.default_custom_code;

    public send_set_custom_code_msg = (): Promise<void> =>
        err_async(async () => {
            const custom_code: i_db.CustomCode = await s_db.Manipulation.get_custom_code();
            const has_custom_code: boolean = Object.values(custom_code).some(
                (custom_code_item: string): boolean =>
                    err(() => custom_code_item !== '', 'cnt_1541'),
            );

            if (n(has_custom_code)) {
                x.remove(sa('.sandbox'));

                const sandbox: HTMLIFrameElement = x.create('iframe', 'sandbox');
                sandbox.sandbox =
                    'allow-scripts allow-top-navigation allow-popups allow-modals allow-pointer-lock';
                sandbox.style.border = '0';
                sandbox.src = 'sandbox.html';

                x.bind(sandbox, 'load', (): void =>
                    err(() => {
                        if (n(sandbox) && n(sandbox.contentWindow)) {
                            sandbox.contentWindow.postMessage(
                                {
                                    command: 'set_custom_code',
                                    value: custom_code,
                                },
                                '*',
                            );
                        }
                    }, 'cnt_1075'),
                );

                x.append(document.body, sandbox);
            }
        }, 'cnt_1076');
}

export const Msgs = Class.get_instance();
