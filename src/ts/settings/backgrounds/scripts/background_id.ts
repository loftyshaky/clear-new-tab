class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public copy_to_clipboard = ({ background_id }: { background_id: string }): Promise<void> =>
        err_async(async () => {
            await navigator.clipboard.writeText(background_id);
        }, 'cnt_1145');
}

export const BackgroundId = Class.get_instance();
