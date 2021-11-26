import { t } from '@loftyshaky/shared';
import { p_backgrounds } from 'settings/internal';

export interface OverlayItemBtn extends p_backgrounds.OverlayItemInfo {
    on_click: t.CallbackVoid;
}
