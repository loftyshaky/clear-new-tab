class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public default_custom_code = { html: '', css: '', js: '' };
}

export const CustomCode = Class.get_instance();
