class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public open = ({ background_id }: { background_id: string }): void =>
        err(() => {
            void ext.send_msg({ msg: 'open_background_preview', background_id });
        }, 'cnt_1150');
}

export const Preview = Class.get_instance();
