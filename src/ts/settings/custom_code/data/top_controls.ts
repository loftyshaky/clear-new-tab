import { s_utils } from '@loftyshaky/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { svg } from 'shared/internal';
import { d_custom_code } from 'settings/internal';

export class TopControls {
    private static i0: TopControls;

    public static i(): TopControls {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public top_controls: o_inputs.IconBtn[] | i_inputs.IconBtns = [];

    public init = (): void =>
        err(() => {
            this.top_controls = [
                new o_inputs.IconBtn({
                    name: 'show_code_editor_help',
                    Svg: svg.Help,
                    event_callback: d_custom_code.Help.i().change_help_visibility,
                }),
                new o_inputs.IconBtn({
                    name: 'close_code_editor',
                    Svg: svg.Close,
                    event_callback: () =>
                        d_custom_code.Visibility.i().change({ is_visible: false }),
                }),
            ];

            this.top_controls = s_utils.Main.i().to_object({
                arr: this.top_controls as o_inputs.IconBtn[],
            });
        }, 'cnt_1188');
}
