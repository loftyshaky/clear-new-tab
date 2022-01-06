import React from 'react';
import { observer } from 'mobx-react';

import { d_background, s_background } from 'new_tab/internal';

export const BackgrountContainer: React.FunctionComponent<any> = observer(() => (
    <>
        {s_background.Type.i().is_video() ? (
            <div
                className={x.cls([
                    'background_container',
                    d_background.Main.i().background_position,
                ])}
                style={{
                    backgroundColor: d_background.Main.i().color_of_area_around_background,
                }}
            >
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                    src={d_background.Main.i().background}
                    style={d_background.Main.i().background_css as any}
                    loop
                    autoPlay
                />
            </div>
        ) : (
            <div
                className={x.cls(['background_container'])}
                style={d_background.Main.i().background_css as any}
            />
        )}
    </>
));
