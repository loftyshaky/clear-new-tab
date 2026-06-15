import { observer } from 'mobx-react-lite';

import type { p_backgrounds } from 'settings/internal';

export const DropZone: React.FunctionComponent<p_backgrounds.DropZone> = observer((props) => {
    const { style } = props;

    return <div className='drop_zone' style={{ ...style }} />;
});
