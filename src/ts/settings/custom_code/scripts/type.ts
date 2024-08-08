import { i_custom_code } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_type_from_mode = ({ mode }: { mode: i_custom_code.Mode }): i_custom_code.Type =>
        err(() => {
            let type: i_custom_code.Type = 'css';

            if (mode === 'xml') {
                type = 'html';
            } else if (mode === 'javascript') {
                type = 'js';
            }

            return type;
        }, 'cnt_1204');

    public get_mode_from_type = ({ type }: { type: i_custom_code.Type }): i_custom_code.Mode =>
        err(() => {
            let mode: i_custom_code.Mode = 'css';

            if (type === 'html') {
                mode = 'xml';
            } else if (type === 'js') {
                mode = 'javascript';
            }

            return mode;
        }, 'cnt_1205');
}

export const Type = Class.get_instance();
