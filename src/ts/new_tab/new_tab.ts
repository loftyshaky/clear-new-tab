import { init_shared, d_settings } from '@loftyshaky/shared';
import { init } from 'new_tab/internal';

(async () => {
    ext.force_local_storage_f();
    await d_settings.Main.i().set_from_storage();
    await show_unable_to_access_settings_error({});

    init_shared();
    await init();
})();
