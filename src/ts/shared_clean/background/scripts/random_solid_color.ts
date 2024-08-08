import { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public generate = (): Promise<string> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (settings.color_type === 'all') {
                const letters = '0123456789ABCDEF';
                let color = '#';

                for (let i = 0; i < 6; i += 1) {
                    color += letters[Math.floor(Math.random() * 16)];
                }

                return color;
            }

            if (settings.color_type === 'pastel') {
                return `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${
                    70 + 10 * Math.random()
                }%)`;
            }

            return '';
        }, 'cnt_1314');
}

export const RandomSolidColor = Class.get_instance();
