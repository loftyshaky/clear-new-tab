import _ from 'lodash';
import JSZip from 'jszip';

import { t } from '@loftyshaky/shared';
import { s_browser_theme, i_browser_theme } from 'settings/internal';

export class Crx {
    private static i0: Crx;

    public static i(): Crx {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    /* eslint-disable @typescript-eslint/naming-convention */
    private position_dict: { [index: string]: string } = {
        top: 'top',
        center: 'center',
        bottom: 'bottom',
        'left top': 'left_top',
        'top left': 'left_top',
        'left center': 'left_center',
        'center left': 'left_center',
        'left bottom': 'left_bottom',
        'bottom left': 'left_bottom',
        'right top': 'right_top',
        'top right': 'right_top',
        'right center': 'right_center',
        'center right': 'right_center',
        'right bottom': 'right_bottom',
        'bottom right': 'right_bottom',
    };

    repeat_dict: { [index: string]: string } = {
        'no-repeat': 'no_repeat',
        repeat: 'repeat',
        'repeat-y': 'repeat_y',
        'repeat-x': 'repeat_x',
    };
    /* eslint-disable @typescript-eslint/naming-convention */

    //> purpose of this arrays is to exclude developers mistakes. Ex: ntp_background_alignment set to "middle" instead of "center" (https://chrome.google.com/webstore/detail/%D0%B1%D0%B5%D0%B3%D1%83%D1%89%D0%B0%D1%8F-%D0%BB%D0%B8%D1%81%D0%B8%D1%87%D0%BA%D0%B0/pcogoppjgcggbmflbmiihnbbdcbnbkjp)
    private positions: string[] = Object.keys(this.position_dict);
    private repeats: string[] = Object.keys(this.repeat_dict);
    private sizes: string[] = [
        'dont_resize',
        'cover_screen',
        'cover_browser',
        'fit_screen',
        'fit_browser',
        'stretch_screen',
        'stretch_browser',
    ];
    //<

    public get = ({ theme_id }: { theme_id: string }): Promise<ArrayBuffer | undefined> =>
        err_async(
            async () => {
                const chrome_crx_url: string = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=9999.0.9999.0&acceptformat=crx2,crx3&x=id%3D${theme_id}%26uc`;
                const edge_crx_url: string = `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&prod=chromiumcrx&prodchannel=&x=id%3D${theme_id}%26installsource%3Dondemand%26uc`;
                let response = await fetch(chrome_crx_url);

                if (!response.ok) {
                    response = await fetch(edge_crx_url);
                }

                if (!response.ok) {
                    throw_err('CRX download error.');
                }

                if (n(response)) {
                    const theme_package = await response.arrayBuffer();

                    return theme_package;
                }

                return undefined;
            },
            'cnt_1163',
            { silent: true, exit: true },
        );

    public read_manifest = ({
        theme_package,
    }: {
        theme_package: ArrayBuffer;
    }): Promise<t.AnyRecord> =>
        err_async(async () => {
            const theme_package_data: t.AnyRecord = await JSZip.loadAsync(theme_package);
            const clear_new_tab_video_file_name: string | undefined =
                s_browser_theme.ThemeFile.i().clear_new_tab_video_file_names.find(
                    (file_name: string): void =>
                        err(() => theme_package_data.files[file_name], 'cnt_1164'),
                );
            const manifest = await theme_package_data.file('manifest.json').async('string');
            const manifest_obj = JSON.parse(manifest.trim()); // trim fixes bug with some themes. ex: https://chrome.google.com/webstore/detail/sexy-girl-chrome-theme-ar/pkibpgkliocdchedibhioiibdiddomac
            const theme_obj = manifest_obj.theme;

            const img_file_name: string | undefined = _.get(theme_obj, [
                'images',
                'theme_ntp_background',
            ]);
            const size_manifest: string = _.get(theme_obj, ['clear_new_tab', 'size'], '');
            const position_manifest: string = _.get(
                theme_obj,
                ['properties', 'ntp_background_alignment'],
                '',
            );
            const repeat_manifest: string = _.get(
                theme_obj,
                ['properties', 'ntp_background_repeat'],
                '',
            );

            const color_of_area_around_background_manifest = _.get(
                theme_obj,
                ['colors', 'ntp_background'],
                '',
            );
            const video_volume_manifest: number = _.get(
                theme_obj,
                ['clear_new_tab', 'video_volume'],
                Infinity,
            );

            const background_size: string = this.sizes.includes(size_manifest)
                ? size_manifest
                : 'global';
            const background_position: string = this.positions.includes(position_manifest)
                ? this.position_dict[position_manifest]
                : this.position_dict.center;
            const background_repeat: string = this.repeats.includes(repeat_manifest)
                ? this.repeat_dict[repeat_manifest]
                : this.repeat_dict['no-repeat'];
            const color_of_area_around_background = n(color_of_area_around_background_manifest)
                ? this.rgb_to_hex({ val: color_of_area_around_background_manifest })
                : '#ffffff';
            const video_volume: string | number =
                video_volume_manifest !== Infinity &&
                video_volume_manifest >= 0 &&
                video_volume_manifest <= 100
                    ? +video_volume_manifest
                    : 'global';
            const theme_background_info: i_browser_theme.ThemeBackgroundInfo = {
                theme_package_data,
                clear_new_tab_video_file_name,
                img_file_name,
                background_props: {
                    background_size,
                    background_position,
                    background_repeat,
                    color_of_area_around_background,
                    video_volume,
                },
            };

            return theme_background_info;
        }, 'cnt_1165');

    public rgb_to_hex = ({ val }: { val: number[] }): string =>
        err(
            () =>
                `#${val
                    .map((sub_val: number): string =>
                        err(() => {
                            const hex = sub_val.toString(16);

                            return hex.length === 1 ? `0${hex}` : hex;
                        }, 'cnt_1166'),
                    )
                    .join('')}`,
            'cnt_1167',
        );
}
