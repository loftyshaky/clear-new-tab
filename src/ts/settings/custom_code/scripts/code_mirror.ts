import CodeMirrorLib, { Editor } from 'codemirror';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/plugins/html';
import parserPostcss from 'prettier/plugins/postcss';
import parserBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';

import { t } from '@loftyshaky/shared/shared';
import { d_custom_code, s_custom_code, i_custom_code } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public init_calls: t.CallbackVoid[] = [];
    private monde_mirror_insts: Editor[] = [];
    private theme_dict: { [index: string]: string } = {
        light: 'mdn-like',
        dark: 'material-palenight',
        very_dark: 'material-ocean',
        lavender: 'mdn-like',
        aqua: 'mdn-like',
    };

    private attempted_to_save_code_val_count: number = 0;
    private prettier_options: t.AnyRecord = {
        singleQuote: true,
        tabWidth: 2,
        printWidth: 100,
        semi: true,
        trailingComma: 'all',
        endOfLine: 'auto',
    };

    public init = ({
        type,
        editor_el,
    }: {
        type: i_custom_code.Type;
        editor_el: HTMLDivElement | undefined;
    }): void =>
        err(() => {
            if (n(editor_el)) {
                const mode: i_custom_code.Mode = s_custom_code.Type.get_mode_from_type({
                    type,
                });
                const code_mirror_inst: Editor = CodeMirrorLib(editor_el, {
                    mode: { ...{ name: mode }, ...(mode === 'xml' && { htmlMode: true }) },
                    lineWrapping: true,
                    lineNumbers: true,
                    value: ' ',
                });
                code_mirror_inst.on('change', (inst: any) => {
                    if (this.attempted_to_save_code_val_count >= 3) {
                        const val: string = inst.getValue();

                        s_custom_code.Db.save_val_debounce({
                            type,
                            val,
                        });
                    }

                    this.attempted_to_save_code_val_count += 1;
                });

                this.monde_mirror_insts.push(code_mirror_inst);

                this.set_theme({ code_mirror_inst });
            }
        }, 'cnt_1190');

    public init_all = (): void =>
        err(() => {
            this.init_calls.forEach((init_call: t.CallbackVoid): void =>
                err(() => {
                    init_call();
                }, 'cnt_1191'),
            );
        }, 'cnt_1192');

    private set_theme = ({ code_mirror_inst }: { code_mirror_inst: Editor }): void =>
        err(() => {
            code_mirror_inst.setOption('theme', this.theme_dict[data.settings.options_page_theme]);
        }, 'cnt_1193');

    public change_theme = (): void =>
        err(() => {
            this.monde_mirror_insts.forEach((code_mirror_inst: Editor): void =>
                err(() => {
                    this.set_theme({ code_mirror_inst });
                }, 'cnt_1194'),
            );
        }, 'cnt_1195');

    public set_vals = (): void =>
        err(() => {
            if (d_custom_code.Visibility.is_visible) {
                this.monde_mirror_insts.forEach((code_mirror_inst: Editor): void =>
                    err(() => {
                        const type: i_custom_code.Type = this.get_type({
                            code_mirror_inst,
                        });

                        (code_mirror_inst as any).doc.setValue(
                            d_custom_code.CustomCode.custom_code[type],
                        );
                    }, 'cnt_1196'),
                );
            }
        }, 'cnt_1197');

    public format = (): void =>
        err(() => {
            this.monde_mirror_insts.forEach(
                (code_mirror_inst: Editor): Promise<void> =>
                    err_async(
                        async () => {
                            const type: i_custom_code.Type = this.get_type({ code_mirror_inst });
                            const custom_code = d_custom_code.CustomCode.custom_code[type];

                            if (n(custom_code)) {
                                let formatted_code: string = '';

                                if (type === 'html') {
                                    formatted_code = await prettier.format(custom_code, {
                                        parser: 'html',
                                        plugins: [parserHtml],
                                        ...this.prettier_options,
                                    });
                                } else if (type === 'css') {
                                    formatted_code = await prettier.format(custom_code, {
                                        parser: 'css',
                                        plugins: [parserPostcss],
                                        ...this.prettier_options,
                                    });
                                } else if (type === 'js') {
                                    formatted_code = await prettier.format(custom_code, {
                                        parser: 'babel',
                                        plugins: [parserBabel, prettierPluginEstree],
                                        ...this.prettier_options,
                                    });
                                }

                                code_mirror_inst.setOption('value', '');
                                code_mirror_inst.setOption('value', formatted_code);
                                s_custom_code.Db.save_val({ type, val: formatted_code });
                            }
                        },
                        'cnt_1198',
                        { silent: true },
                    ),
            );
        }, 'cnt_1199');

    private get_type = ({ code_mirror_inst }: { code_mirror_inst: Editor }): i_custom_code.Type =>
        err(
            () =>
                s_custom_code.Type.get_type_from_mode({
                    mode: (code_mirror_inst as any).options.mode.name,
                }),

            'cnt_1200',
        );
}

export const CodeMirror = Class.get_instance();
