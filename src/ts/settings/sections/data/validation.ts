import { i_data } from '@loftyshaky/shared/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_backgrounds, d_pagination } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public validate_input = ({ input }: { input: i_inputs.Input }): boolean =>
        err(() => {
            const val: i_data.Val = d_inputs.Val.access({ input }) as number;

            if (typeof val === 'string') {
                if (input.name === 'paste_background') {
                    return false;
                }

                if (input.name === 'current_background_id') {
                    return !this.validate_current_background_i({ val });
                }

                if (input.name === 'video_speed') {
                    return !this.validate_video_speed({ val });
                }

                if (input.name === 'transition_duration') {
                    return d_inputs.Val.validate_input({ input });
                }

                if (input.name === 'one_backup_file_size_in_bytes') {
                    return val < 52428800 || val > 419430400;
                }

                if (input.name === 'backgrounds_per_page') {
                    return (
                        val < d_pagination.Page.backgrounds_per_page_min_val ||
                        val > d_pagination.Page.backgrounds_per_page_max_val
                    );
                }

                if (input.name === 'year') {
                    return !(
                        (/^2\d{3}$/.test(val) && +val >= new Date().getFullYear()) ||
                        val === ''
                    );
                }

                if (input.name === 'time') {
                    return !(/^(2[0-3]|[0-1][\d]):[0-5][\d]:[0-5][\d]$/.test(val) || val === '');
                }

                return !/^1$|^0$|^(0\.[0-9]{1,2}|1\.00?)$/.test(val);
            }

            return false;
        }, 'cnt_1289');

    private validate_current_background_i = ({ val }: { val: i_data.Val }): boolean =>
        err(() => {
            const i: number = (val as number) - 1;

            return (
                /^(?!0)\d+$/.test(val as string) &&
                i <= d_backgrounds.Backgrounds.backgrounds.length - 1
            );
        }, 'cnt_1294');

    private validate_video_speed = ({ val }: { val: i_data.Val }): boolean =>
        err(
            () =>
                n(val) &&
                /^[+-]?\d+(\.\d+)?$/.test(val as string) &&
                (val === '0' || (+val >= 0.1 && +val <= 16)),
            'cnt_1294',
        );
}

export const Validation = Class.get_instance();
