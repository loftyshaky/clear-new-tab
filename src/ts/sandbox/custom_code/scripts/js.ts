import { d_custom_code } from 'sandbox/internal';

export class Js {
    private static i0: Js;

    public static i(): Js {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public run = ({ sandbox_el }: { sandbox_el: HTMLDivElement | undefined }): void => {
        const sandbox_custom_script: HTMLScriptElement | null =
            document.querySelector('.sandbox script');

        if (sandbox_custom_script) {
            sandbox_custom_script.remove();
        }

        if (sandbox_el) {
            const { js } = d_custom_code.Main.i().custom_code;

            if (js) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.innerHTML = js;
                sandbox_el.appendChild(script);
            }
        }
    };
}
