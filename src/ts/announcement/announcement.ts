import { d_settings } from '@loftyshaky/shared/shared';
import { init } from 'announcement/internal';

(async () => {
    ext.force_local_storage_f();
    await d_settings.Main.i().set_from_storage();
    await show_unable_to_access_settings_error({});

    await init();
})();
