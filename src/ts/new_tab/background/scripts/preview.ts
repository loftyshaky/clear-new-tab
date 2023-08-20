export class Preview {
    private static i0: Preview;

    public static i(): Preview {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
