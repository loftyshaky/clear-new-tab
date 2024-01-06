export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public create_document = (): Promise<void> =>
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
