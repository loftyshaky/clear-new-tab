import { i_data } from '@loftyshaky/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_sections } from 'settings/internal';

export class TextBtns {
    private static i0: TextBtns;

    public static i(): TextBtns {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public decide_set_img_as_current_btn_visibility = ({
        input,
    }: {
        input: i_inputs.Input;
    }): boolean =>
        err(() => {
            const val: i_data.Val = d_inputs.Val.i().access({ input });

            if (n(val)) {
                return d_sections.Val.i().validate_current_background_i({ val: val as i_data.Val });
            }

            return true;
        }, 'cnt_1141');

    public decide_paste_background_btn_visibility = (): boolean =>
        err(() => data.settings.paste_btn_is_visible, 'cnt_1141');
}
