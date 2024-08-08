class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public id: string | undefined;

    public set_id = (): void =>
        err(() => {
            const id: string | null = new URL(globalThis.location.href).searchParams.get(
                'preview_background_id',
            );

            this.id = n(id) ? id : undefined;
        }, 'cnt_1476');
}

export const Preview = Class.get_instance();
