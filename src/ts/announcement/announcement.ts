import { d_settings } from '@loftyshaky/shared';
import { init } from 'announcement/internal';

(async () => {
    await d_settings.Main.i().set_from_storage();

    await init();
})();
