
import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';
import Pagination from 'react-js-pagination';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tab_focus from 'js/tab_focus';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as background_loading from 'options/background_loading';
import * as background_selection from 'options/background_selection';
import * as background_deletion from 'options/background_deletion';
import * as pagination from 'options/pagination';
import * as moving from 'options/moving';
import * as prevent_scrolling from 'js/prevent_scrolling';
import * as total_number_of_backgrounds from 'js/total_number_of_backgrounds';
import * as changing_backgrounds_fieldset_width from 'options/changing_backgrounds_fieldset_width';
import * as scrolling from 'options/scrolling';
import * as ui_state from 'options/ui_state';
import * as background_i from 'options/background_i';
import * as enter_click from 'js/enter_click';
import * as file_types from 'js/file_types';

import { Tr } from 'js/components/Tr';

import cross_svg from 'svg/cross';
import arrow_left from 'svg/arrow_left';
import arrow_right from 'svg/arrow_right';
import first_page from 'svg/first_page';
import last_page from 'svg/last_page';

export class Backgrounds_fieldset extends React.Component {
    constructor(props) {
        super(props);

        this.backgrounds_w = React.createRef();
    }

    async componentWillMount() {
        try {
            total_number_of_backgrounds.set_total_number_of_backgrounds();

        } catch (er) {
            err(er, 76);
        }
    }

    componentDidMount() {
        try {
            const pagination_el = s('.pagination');

            background_loading.load_page('first_load', 0);

            background_i.mut.background_w_tr_nodes = this.backgrounds_w.current.getElementsByClassName('background_w_tr');

            scrolling.mut.backgrounds_fieldset = ref.backgrounds_fieldset.current;
            this.resize_backgrounds_binded = changing_backgrounds_fieldset_width.resize_backgrounds.bind(null, this.backgrounds_w.current);

            window.requestAnimationFrame(() => {
                this.resize_backgrounds_binded();
                scrolling.show_or_hide_backgrounds_fieldset_fillers();
            });

            x.bind(window, 'resize', this.resize_backgrounds_binded);
            x.bind(pagination_el, 'mousedown', pagination.send_click_to_pagination_btn);
            x.bind(pagination_el, 'keyup', enter_click.simulate_click_on_enter);
            ref.backgrounds_fieldset.current.addEventListener('wheel', prevent_scrolling.prevent_scrolling, { passive: false });

        } catch (er) {
            err(er, 77);
        }
    }

    componentDidUpdate() {
        try {
            scrolling.show_or_hide_backgrounds_fieldset_fillers();
            pagination.add_and_remove_tabindex_to_pagination_els();

        } catch (er) {
            err(er, 78);
        }
    }

    change_page = page => {
        try {
            background_loading.load_page('load_page', page);

        } catch (er) {
            err(er, 79);
        }
    }

    render() {
        return (
            <div
                className="backgrounds_w"
                ref={this.backgrounds_w}
            >
                <div
                    className="backgrounds"
                    style={{ width: changing_backgrounds_fieldset_width.ob.backgrounds_width }}
                >
                    <div
                        className="backgrounds_legend"
                    >
                        {x.msg('backgrounds_legend_text')}
                        <div className="backgrounds_legend_line" />
                    </div>

                    <div className={x.cls(['backgrounds_fieldset_filler', 'backgrounds_fieldset_filler_top', scrolling.ob.backgrounds_fieldset_filler_top_none_cls])} />
                    <fieldset
                        className="backgrounds_fieldset"
                        onScroll={scrolling.show_or_hide_backgrounds_fieldset_fillers}
                        ref={ref.backgrounds_fieldset}
                    >
                        <Tr
                            attr={{
                                className: 'backgrounds_w_2',
                            }}
                            tag="div"
                            name="gen"
                            state={background_deletion.ob.show_backgrounds_w_2}
                            tr_end_callbacks={[background_deletion.delete_all_images_tr_end]}
                        >
                            <div
                                className="backgrounds_w_3"
                                style={{ counterReset: `counter ${background_loading.ob.css_counter_offset}` }}
                            >
                                <Backgrounds
                                    backgrounds={populate_storage_with_images_and_display_them.ob.backgrounds}
                                />
                            </div>
                        </Tr>
                    </fieldset>
                    <div className={x.cls(['backgrounds_fieldset_filler', 'backgrounds_fieldset_filler_bottom', scrolling.ob.backgrounds_fieldset_filler_bottom_none_cls])} />
                </div>
                <div className="pagination_w" style={{ width: changing_backgrounds_fieldset_width.ob.backgrounds_width }}>
                    <Pagination
                        activePage={pagination.ob.active_page}
                        itemsCountPerPage={populate_storage_with_images_and_display_them.con.backgrounds_per_page}
                        totalItemsCount={total_number_of_backgrounds.ob.number_of_backgrounds}
                        itemClass="btn pagination_btn"
                        prevPageText={<Svg src={arrow_left} />}
                        nextPageText={<Svg src={arrow_right} />}
                        firstPageText={<Svg src={first_page} />}
                        lastPageText={<Svg src={last_page} />}
                        onChange={this.change_page}
                    />
                </div>
            </div>
        );
    }
}

class Backgrounds extends React.Component {
    constructor(props) {
        super(props);

        this.set_background_placeholder_refs = this.set_background_placeholder_refs.bind(this);

        this.background_placeholder_refs = {};
        this.background_w_trs = [];

        this.mut = {
            broken_backgrounds_ids: [],
        };
    }

    set_background_placeholder_refs(id, background_placeholder) {
        try {
            this.background_placeholder_refs[id] = background_placeholder;

        } catch (er) {
            err(er, 80);
        }
    }

    delete_broken_backgrounds = async () => {
        try {
            if (this.mut.broken_backgrounds_ids.length > 0) {
                background_deletion.delete_broken_backgrounds(this.mut.broken_backgrounds_ids);

                this.mut.broken_backgrounds_ids = [];
            }

        } catch (er) {
            err(er, 81);
        }
    }

    background_load_callback = async (id, e) => {
        try {
            if (e) {
                const e_type = e.type;

                await x.delay(0);

                if (populate_storage_with_images_and_display_them.ob.backgrounds.length !== 0) { // prevent bug when deleting all images when solid color image present
                    background_loading.mut.backgrounds_loaded++;

                    const number_of_backgrounds_to_load = populate_storage_with_images_and_display_them.ob.backgrounds.length - populate_storage_with_images_and_display_them.mut.previous_number_of_backgrounds;

                    if (e_type === 'error') { // when broken image loaded
                        this.mut.broken_backgrounds_ids.push(id);

                        background_loading.change_background_to_background_error(populate_storage_with_images_and_display_them.ob.backgrounds.find(background => background.id === id));
                    }

                    if ((populate_storage_with_images_and_display_them.mut.previous_number_of_backgrounds === populate_storage_with_images_and_display_them.con.backgrounds_per_page && background_loading.mut.backgrounds_loaded === populate_storage_with_images_and_display_them.con.backgrounds_per_page) || (populate_storage_with_images_and_display_them.mut.previous_number_of_backgrounds !== populate_storage_with_images_and_display_them.con.backgrounds_per_page && background_loading.mut.backgrounds_loaded >= number_of_backgrounds_to_load)) {
                        background_loading.mut.backgrounds_loaded = 0;

                        if (populate_storage_with_images_and_display_them.mut.scroll_to === 'bottom') {
                            ref.backgrounds_fieldset.current.scrollTop = ref.backgrounds_fieldset.current.scrollHeight;

                        } else if (populate_storage_with_images_and_display_them.mut.scroll_to === 'top') {
                            ref.backgrounds_fieldset.current.scrollTop = 0;
                        }

                        background_loading.hide_loading_screen();
                        scrolling.show_or_hide_backgrounds_fieldset_fillers();
                        ui_state.enable_ui();
                        this.delete_broken_backgrounds();
                    }

                    background_loading.show_loaded_background(this.background_placeholder_refs[id]);
                }
            }

        } catch (er) {
            err(er, 82);
        }
    }

    //> show transparency background checkerboard
    hide_background_placeholder = id => {
        try {
            background_loading.hide_background_placeholder(this.background_placeholder_refs[id]);

        } catch (er) {
            err(er, 83);
        }
    }
    //< show transparency background checkerboard

    render() {
        return (
            <React.Fragment>
                {
                    populate_storage_with_images_and_display_them.ob.backgrounds.map((background, i) => (
                        <Tr
                            attr={{
                                className: 'background_w_tr',
                            }}
                            tag="span"
                            name="background"
                            state={background.show_delete}
                            tr_end_callbacks={[background_deletion.delete_background_tr_end_callback]}
                            key={background.key}
                            tr_ref={node => { this.background_w_trs[i] = node; }}
                        >
                            <span
                                className="background_placeholder opacity_1"
                                style={{
                                    backgroundColor: background.placeholder_color,
                                    backgroundRepeat: '14px 14px',
                                    backgroundSize: '14px 14px',
                                    opacity: background_loading.mut.background_inner_w_2_mounts_with_background_placeholder_hidden ? '0.001' : null,
                                }}
                                onTransitionEnd={this.hide_background_placeholder.bind(null, background.id)}
                                ref={background_placeholder => this.set_background_placeholder_refs(background.id, background_placeholder)}
                            />
                            <span
                                className={x.cls(['background_w', background.selected ? 'selected_background' : null])}
                                role="button"
                                tabIndex="0"
                                onClick={background_selection.select_background.bind(null, background.id)}
                                onMouseDown={e => moving.start_drag(this.background_w_trs[i], e)}
                                onMouseMove={e => moving.create_drop_area(this.background_w_trs[i], 'options', e)}
                                onKeyUp={enter_click.simulate_click_on_enter}
                            >
                                <Background_inner_w
                                    i={i}
                                    background={background}
                                    background_w_trs={this.background_w_trs}
                                    background_load_callback={this.background_load_callback}
                                    delete_background={() => background_deletion.delete_background(background.id)}
                                />
                            </span>
                        </Tr>
                    ))
                }
            </React.Fragment>
        );
    }
}

const Background_inner_w = observer(props => {
    const { i, background, background_w_trs, background_load_callback, delete_background } = props;

    return (
        <div className="background_inner_w">
            <div className="background_inner_w_2">
                <Background
                    i={i}
                    background={background}
                    background_w_trs={background_w_trs}
                    background_load_callback={background_load_callback}
                    delete_background={delete_background}
                />
            </div>
        </div>
    );
});

class Background extends React.Component {
    constructor(props) {
        super(props);

        ({
            background: this.background,
            background_load_callback: this.background_load_callback,
            delete_background: this.delete_background,
        } = this.props);

        this.is_file_or_link = file_types.con.files[this.background.type] || file_types.con.types[this.background.type] === 'links';
    }

    //> open image in new tab when clicking on preview button
    preview_background = id => {
        try {
            analytics.send_options_backgrounds_event('previewed');

            x.send_message_to_background({ message: 'open_preview_background_tab', background_id: id });

        } catch (er) {
            err(er, 84);
        }
    }
    //< open image in new tab when clicking on preview button

    background_btn_on_keyup = e => {
        try {
            e.stopPropagation();

            enter_click.simulate_click_on_enter(e);

        } catch (er) {
            err(er, 224);
        }
    }

    render() {
        const { i, background_w_trs } = this.props;

        const background_el = this.is_file_or_link
            ? (
                <img
                    className="background"
                    draggable="false"
                    src={this.background.background}
                    alt=""
                    onLoad={this.background_load_callback.bind(null, this.background.id)}
                    onError={this.background_load_callback.bind(null, this.background.id)}
                    ref={this.background_el}
                />
            )
            : (
                <div
                    className="solid_color_img"
                    style={{ backgroundColor: this.background.background }}
                    ref={this.background_load_callback.bind(null, this.background.id)}
                />
            );

        return (
            <React.Fragment>
                <div className="background_cover" />
                <div className="background_info_and_btns">
                    {this.is_file_or_link ? <div className="background_size background_info">{this.background.background_size}</div> : null}
                    <div className="background_type background_info">{x.msg(`background_type_${this.background.type}_text`)}</div>
                    <div
                        role="button"
                        className="move_background_btn background_btn background_info"
                        tabIndex="0"
                        onClick={() => moving.prompt_to_move(background_w_trs[i])}
                        onKeyUp={this.background_btn_on_keyup}
                    >
                        {x.msg('move_background_text')}
                    </div>
                    <div
                        role="button"
                        className="background_preview_btn background_btn background_info"
                        tabIndex="0"
                        onClick={this.preview_background.bind(null, this.background.id)}
                        onKeyUp={this.background_btn_on_keyup}
                    >
                        {x.msg('background_preview_text')}
                    </div>
                </div>
                {background_el}
                <button
                    type="button"
                    className="delete_background_btn"
                    onClick={this.delete_background}
                    onKeyUp={e => e.stopPropagation()}
                    onFocus={tab_focus.focus_last_el_in_analytics_privacy_dialog_caller}
                >
                    <Svg src={cross_svg} />
                </button>
            </React.Fragment>
        );
    }
}

const ref = {
    backgrounds_fieldset: React.createRef(),
};

observer(Backgrounds_fieldset);
observer(Backgrounds);
observer(Background);
