import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

export class SectionContent {
    private static i0: SectionContent;

    public static i(): SectionContent {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<this, 'backgrounds_section_content_is_visible'>(this, {
            backgrounds_section_content_is_visible: observable,
            set_backgrounds_section_content_visibility: action,
        });
    }

    private backgrounds_section_content_is_visible: boolean = true;

    backgrounds_section_content_is_visible_computed = computedFn(function (
        this: SectionContent,
        { section_name }: { section_name: string },
    ): boolean {
        if (section_name === 'backgrounds' && !this.backgrounds_section_content_is_visible) {
            return false;
        }

        return true;
    });

    public set_backgrounds_section_content_visibility = ({
        is_visible,
    }: {
        is_visible: boolean;
    }): void =>
        err(() => {
            this.backgrounds_section_content_is_visible = is_visible;
        }, 'cnt_1420');
}
