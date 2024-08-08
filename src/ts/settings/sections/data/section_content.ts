import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<this, 'backgrounds_section_content_is_visible'>(this, {
            backgrounds_section_content_is_visible: observable,
            set_backgrounds_section_content_visibility: action,
        });
    }

    private backgrounds_section_content_is_visible: boolean = true;

    backgrounds_section_content_is_visible_computed = computedFn(function (
        this: Class,
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

export const SectionContent = Class.get_instance();
