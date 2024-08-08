class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public create = (): Promise<void> =>
        err_async(async () => {
            const offscreen_document_already_exists: boolean = await we.offscreen.hasDocument();

            if (!offscreen_document_already_exists) {
                await we.offscreen.createDocument({
                    url: 'offscreen.html',
                    reasons: ['DOM_PARSER'],
                    justification: 'Run URL.createObjectURL.',
                });
            }
        }, 'cnt_1478');
}

export const Document = Class.get_instance();
