import { d_settings } from '@loftyshaky/shared/shared';
import { init } from 'dependencies/internal';

(async () => {
    await d_settings.Main.i().set_from_storage();
    await show_unable_to_access_settings_error({});

    await init();
})();
