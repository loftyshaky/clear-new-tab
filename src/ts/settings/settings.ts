import '@loftyshaky/shared/ext';
import { init_shared, d_settings } from '@loftyshaky/shared';
import { init } from 'settings/internal';

(async () => {
    await d_settings.Main.i().set_from_storage();

    init_shared();
    await init();
})();
