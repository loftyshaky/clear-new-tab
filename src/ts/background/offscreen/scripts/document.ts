import type { t } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public create = (): Promise<void> =>
        err_async(async () => {
            if (env.browser !== 'firefox') {
                const offscreen_document_already_exists: boolean = await (
                    we as t.AnyRecord
                ).offscreen.hasDocument();

                if (!offscreen_document_already_exists) {
                    await (we as t.AnyRecord).offscreen.createDocument({
                        url: 'offscreen.html',
                        reasons: ['DOM_PARSER'],
                        justification: 'Run URL.createObjectURL.',
                    });
                }
            }
        }, 'cnt_1478');
}

export const Document = Class.get_instance();
