import { s_utils } from '@loftyshaky/shared/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { svg } from 'shared/internal';
import { d_scheduler } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public top_controls: o_inputs.IconBtn[] | i_inputs.IconBtns = [];

    public init = (): void =>
        err(() => {
            this.top_controls = [
                new o_inputs.IconBtn({
                    name: 'show_scheduler_help',
                    Svg: svg.Help,
                    event_callback: d_scheduler.Help.change_help_visibility,
                }),
                new o_inputs.IconBtn({
                    name: 'close_scheduler',
                    Svg: svg.Close,
                    event_callback: () => d_scheduler.Visibility.change({ is_visible: false }),
                }),
            ];

            this.top_controls = s_utils.Utils.to_object({
                arr: this.top_controls as o_inputs.IconBtn[],
            });
        }, 'cnt_1262');
}

export const TopControls = Class.get_instance();
