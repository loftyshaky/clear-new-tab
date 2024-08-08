import React, { useEffect, useLayoutEffect, useState, MouseEvent } from 'react';
import { observer } from 'mobx-react';

import { s_tab_index } from '@loftyshaky/shared/shared';
import { i_db } from 'shared_clean/internal';
import { svg } from 'shared/internal';
import { c_backgrounds, c_dnd, d_backgrounds, d_dnd, p_backgrounds } from 'settings/internal';

export const Background: React.FunctionComponent<p_backgrounds.Background> = observer((props) => {
    const { index, background, dragged, style } = props;
    const [background_thumbnail, set_background_thumbnail] = useState('');
    const bacground_fade_in_cls: string = d_backgrounds.Cache.background_fade_in_cls({
        background_id: background.id,
    });

    useLayoutEffect(() => {
        d_backgrounds.Cache.set_prop_of_background_thumbnail_cache_item({
            background_id: background.id,
            key: 'placeholder_color',
            val: x.pastel_color(),
        });
    });

    useEffect(() => {
        d_backgrounds.BackgroundAnimation.push_already_animated_id_deferred({
            id: background.id,
        });

        const set_background_thumbnail_2 = (): Promise<void> =>
            err_async(async () => {
                const background_thumbnail_2: string =
                    await d_backgrounds.Backgrounds.get_background_thumbnail_by_id({
                        id: background.id,
                    });

                set_background_thumbnail(background_thumbnail_2);
            }, 'cnt_1444');

        set_background_thumbnail_2();
    });

    return (background as any).type === 'drop_zone' ? (
        <c_dnd.DropZone
            style={{
                width: x.px(
                    d_backgrounds.Dnd.dragged_background_dim({
                        dim: 'width',
                    }),
                ),
                height: x.px(
                    d_backgrounds.Dnd.dragged_background_dim({
                        dim: 'height',
                    }),
                ),
            }}
            on_mouse_up={(): void => {
                d_dnd.Dnd.drop();
            }}
        />
    ) : (
        <span
            className={x.cls([
                'background',
                background.type,
                d_backgrounds.BackgroundAnimation.animated_cls({ id: background.id }),
                d_backgrounds.BackgroundDeletion.deleted_cls({
                    id: background.id,
                }),
                d_dnd.Dnd.dragged_item_cls({
                    dragged,
                }),
                d_dnd.Dnd.cursor_default_cls,
            ])}
            title={d_backgrounds.Backgrounds.developer_info({ background })}
            style={{
                ...style,
                width: x.px(d_backgrounds.Backgrounds.get_dim({ background, dim: 'width' })),
                height: x.px(d_backgrounds.Backgrounds.get_dim({ background, dim: 'height' })),
            }}
        >
            {background.type.includes('color') ? (
                <c_backgrounds.ThumbnailW background_id={background.id}>
                    <div
                        className={x.cls(['color_thumbnail', bacground_fade_in_cls])}
                        style={{
                            backgroundColor: d_backgrounds.Backgrounds.thumbnail_src({
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
                        src={d_backgrounds.Backgrounds.thumbnail_src({
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
                    d_backgrounds.CurrentBackground.selected_cls({ id: background.id }),
                ])}
                role='button'
                tabIndex={0}
                onClick={(): void => {
                    d_backgrounds.CurrentBackground.select({ background });
                }}
                onMouseDown={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.start_drag({ background_to_move: background }, e);
                }}
                onMouseMove={(e: MouseEvent): void => {
                    d_backgrounds.Dnd.create_drop_zone({ hovering_over_background: background }, e);
                }}
                onKeyDown={s_tab_index.TabIndex.simulate_click_on_enter}
            >
                <c_backgrounds.OverlayItemInfo
                    name='background_index'
                    text={d_backgrounds.Backgrounds.get_img_i({ i: index })}
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
                        d_dnd.Dnd.pointer_events_none_cls,
                    ])}
                    aria-label='Delete background'
                    onClick={(e: MouseEvent): void => {
                        d_backgrounds.BackgroundDeletion.trigger_delete(
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
