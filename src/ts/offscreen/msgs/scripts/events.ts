import type { i_error, t } from '@loftyshaky/shared/shared_clean';
import { s_backgrounds } from 'offscreen/internal';
import { s_backgrounds as s_backgrounds_shared_clean } from 'shared_clean/internal';

we.runtime.onMessage.addListener(
    (msg: t.Any): t.Any =>
        err(() => {
            const msg_str: string = msg.msg;

            if (env.browser !== 'firefox') {
                if (msg_str === 'set_current_background_data') {
                    return s_backgrounds.CurrentBackground.set_current_background_data({
                        mode: msg.mode,
                        current_background_id: msg.current_background_id,
                        future_background_id: msg.future_background_id,
                        force: msg.force,
                    })
                        .then(() => true)
                        .catch((error_obj: i_error.ErrorObj) =>
                            show_err_ribbon(error_obj, 'cnt_1489'),
                        );
                }
            }

            if (msg_str === 'get_preloaded_background_data') {
                return s_backgrounds.CurrentBackground.set_current_background_data({
                    mode: msg.mode,
                    current_background_id: msg.current_background_id,
                    future_background_id: msg.future_background_id,
                    force: msg.force,
                })
                    .then(() => ({
                        current_background: s_backgrounds.CurrentBackground.current_background,
                        current_background_file:
                            s_backgrounds.CurrentBackground.current_background_file,
                    }))
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1490'));
            }

            if (env.browser !== 'firefox') {
                if (msg_str === 'get_background_width_height_and_thumbnail') {
                    return s_backgrounds_shared_clean.Thumbnail.get_background_width_height_and_thumbnail(
                        {
                            file: msg.file,
                            file_type: msg.file_type,
                        },
                    )
                        .then((response) => response)
                        .catch((error_obj: i_error.ErrorObj) =>
                            show_err_ribbon(error_obj, 'cnt_1491'),
                        );
                }
            }

            if (env.browser !== 'firefox') {
                if (msg_str === 'append_chunk_to_background_file_base64') {
                    s_backgrounds_shared_clean.Thumbnail.append_chunk_to_background_file_base64({
                        chunk: msg.chunk,
                    });

                    return Promise.resolve(true);
                }
            }

            return false;
        }, 'cnt_1474'),
);
