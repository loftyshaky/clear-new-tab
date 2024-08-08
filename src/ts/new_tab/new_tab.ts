import { init_shared, d_settings } from '@loftyshaky/shared/shared';
import { init } from 'new_tab/internal';

(async () => {
    ext.force_local_storage_f();
    await d_settings.Settings.set_from_storage();
    await show_unable_to_access_settings_error({});

    init_shared();
    await init();
})();
