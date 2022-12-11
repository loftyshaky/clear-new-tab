import React, { useEffect, useState, MouseEvent } from 'react';
import { observer } from 'mobx-react';

import { s_tab_index } from '@loftyshaky/shared';
import { svg, i_db } from 'shared/internal';
import { c_backgrounds, c_dnd, d_backgrounds, d_dnd, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { index, background, dragged, style } = props;
    const [background_thumbnail, set_background_thumbnail] = useState('');
    const bacground_fade_in_cls: string = d_backgrounds.Cache.i().background_fade_in_cls({
        background_id: background.id,
    });

    useEffect(() => {
        d_backgrounds.BackgroundAnimation.i().push_already_animated_id_deferred({
            id: background.id,
        });

        const set_background_thumbnail_2 = (): Promise<void> =>
            err_async(async () => {
                const background_thumbnail_2: string =
                    await d_backgrounds.Main.i().get_background_thumbnail_by_id({
                        id: background.id,
                    });

                set_background_thumbnail(background_thumbnail_2);
            }, 'cnt_1444');

        set_background_thumbnail_2();
    }, [background]);

    return (background as any).type === 'drop_zone' ? (
        <c_dnd.DropZone
            style={{
                width: x.px(
                    d_backgrounds.Dnd.i().dragged_background_dim({
                        dim: 'width',
                    }),
                ),
                height: x.px(
                    d_backgrounds.Dnd.i().dragged_background_dim({
                        dim: 'height',
                    }),
                ),
            }}
            on_mouse_up={(): void => {
                d_dnd.Main.i().drop();
            }}
        />
    ) : (
        <span
            className={x.cls([
                'background',
                background.type,
                d_backgrounds.BackgroundAnimation.i().animated_cls({ id: background.id }),
                d_backgrounds.BackgroundDeletion.i().deleted_cls({
                    id: background.id,
                }),
                d_dnd.Main.i().dragged_item_cls({
                    dragged,
                }),
                d_dnd.Main.i().cursor_default_cls,
            ])}
            title={d_backgrounds.Main.i().developer_info({ background })}
            style={{
                ...style,
                width: x.px(d_backgrounds.Main.i().get_dim({ background, dim: 'width' })),
                height: x.px(d_backgrounds.Main.i().get_dim({ background, dim: 'height' })),
            }}
        >
            {background.type.includes('color') ? (
                <c_backgrounds.ThumbnailW background_id={background.id}>
                    <div
                        className={x.cls(['color_thumbnail', bacground_fade_in_cls])}
                        style={{
                            backgroundColor: d_backgrounds.Main.i().thumbnail_src({
                                id: background.id,
                                background_thumbnail,
                            }),
                        }}
                    />
                </c_backgrounds.ThumbnailW>
            ) : (
                <c_backgrounds.ThumbnailW background_id={background.id}>
                    <img
                        className={x.cls(['img_thumbnail', bacground_fade_in_cls])}
                        src={d_backgrounds.Main.i().thumbnail_src({
                            id: background.id,
                            background_thumbnail,
                        })}
                        alt='Background'
                        draggable='false'
                    />
                </c_backgrounds.ThumbnailW>
            )}
            <div
                className={x.cls([
                    'ui',
                    d_backgrounds.CurrentBackground.i().selected_cls({ id: background.id }),
                ])}
                role='button'
                tabIndex={0}
                onClick={(): void => {
                    d_backgrounds.CurrentBackground.i().select({ background });
                }}
                onMouseDown={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.i().start_drag({ background_to_move: background }, e);
                }}
                onMouseMove={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.i().create_drop_zone(
                        { hovering_over_background: background },
                        e,
                    );
                }}
                onKeyDown={s_tab_index.Main.i().simulate_click_on_enter}
            >
                <c_backgrounds.OverlayItemInfo
                    name='background_index'
                    text={d_backgrounds.Main.i().get_img_i({ i: index })}
                />
                {background.type.includes('color') ? undefined : (
                    <c_backgrounds.OverlayItemInfo
                        name='background_dims'
                        text={`${(background as i_db.FileBackground).width}x${
                            (background as i_db.FileBackground).height
                        }`}
                    />
                )}
                <c_backgrounds.OverlayItemInfo
                    name='background_type'
                    text={ext.msg(`background_type_${background.type}_text`)}
                />
                <c_backgrounds.Actions background={background} />
                <button
                    className={x.cls([
                        'btn',
                        'delete_background_btn',
                        d_dnd.Main.i().pointer_events_none_cls,
                    ])}
                    onClick={(e: MouseEvent): void => {
                        d_backgrounds.BackgroundDeletion.i().trigger_delete(
                            { ids: [background.id], deleting_background_with_delete_button: true },
                            e,
                        );
                    }}
                    type='button'
                >
                    <svg.Close />
                </button>
            </div>
        </span>
    );
});
