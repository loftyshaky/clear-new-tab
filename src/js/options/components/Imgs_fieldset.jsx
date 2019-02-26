import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';
import Pagination from 'react-js-pagination';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tab_focus from 'js/tab_focus';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as img_loading from 'options/img_loading';
import * as img_selection from 'options/img_selection';
import * as img_deletion from 'options/img_deletion';
import * as pagination from 'options/pagination';
import * as moving from 'options/moving';
import * as prevent_scrolling from 'js/prevent_scrolling';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import * as changing_imgs_fieldset_width from 'options/changing_imgs_fieldset_width';
import * as scrolling from 'options/scrolling';
import * as ui_state from 'options/ui_state';
import * as img_i from 'options/img_i';
import * as enter_click from 'js/enter_click';
import * as file_types from 'js/file_types';

import { Tr } from 'js/components/Tr';

import cross_svg from 'svg/cross';
import arrow_left from 'svg/arrow_left';
import arrow_right from 'svg/arrow_right';
import first_page from 'svg/first_page';
import last_page from 'svg/last_page';

export class Imgs_fieldset extends React.Component {
    constructor(props) {
        super(props);

        this.imgs_w = React.createRef();
    }

    async componentWillMount() {
        try {
            total_number_of_imgs.set_total_number_of_imgs();

        } catch (er) {
            err(er, 76);
        }
    }

    componentDidMount() {
        try {
            const pagination_el = s('.pagination');

            img_loading.load_page('first_load', 0);

            img_i.mut.img_w_tr_nodes = this.imgs_w.current.getElementsByClassName('img_w_tr');

            scrolling.mut.imgs_fieldset = ref.imgs_fieldset.current;
            this.resize_imgs_binded = changing_imgs_fieldset_width.resize_imgs.bind(null, this.imgs_w.current);

            window.requestAnimationFrame(() => {
                this.resize_imgs_binded();
                scrolling.show_or_hide_imgs_fieldset_fillers();
            });

            x.bind(window, 'resize', this.resize_imgs_binded);
            x.bind(pagination_el, 'mousedown', pagination.send_click_to_pagination_btn);
            x.bind(pagination_el, 'keyup', enter_click.simulate_click_on_enter);

        } catch (er) {
            err(er, 77);
        }
    }

    componentDidUpdate() {
        try {
            scrolling.show_or_hide_imgs_fieldset_fillers();
            pagination.add_and_remove_tabindex_to_pagination_els();

        } catch (er) {
            err(er, 78);
        }
    }

    change_page = page => {
        try {
            img_loading.load_page('load_page', page);

        } catch (er) {
            err(er, 79);
        }
    }

    render() {
        return (
            <div
                className="imgs_w"
                ref={this.imgs_w}
            >
                <div
                    className="imgs"
                    style={{ width: changing_imgs_fieldset_width.ob.imgs_width }}
                >
                    <div
                        className="imgs_legend"
                    >
                        {x.msg('imgs_legend_text')}
                        <div className="imgs_legend_line" />
                    </div>

                    <div className={x.cls(['imgs_fieldset_filler', 'imgs_fieldset_filler_top', scrolling.ob.imgs_fieldset_filler_top_none_cls])} />
                    <fieldset
                        className="imgs_fieldset"
                        onWheel={prevent_scrolling.prevent_scrolling.bind(ref.imgs_fieldset.current)}
                        onScroll={scrolling.show_or_hide_imgs_fieldset_fillers}
                        ref={ref.imgs_fieldset}
                    >
                        <Tr
                            attr={{
                                className: 'imgs_w_2',
                            }}
                            tag="div"
                            name="gen"
                            state={img_deletion.ob.show_imgs_w_2}
                            tr_end_callbacks={[img_deletion.delete_all_images_tr_end]}
                        >
                            <div
                                className="imgs_w_3"
                                style={{ counterReset: `counter ${img_loading.ob.css_counter_offset}` }}
                            >
                                <Imgs
                                    imgs={populate_storage_with_images_and_display_them.ob.imgs}
                                />
                            </div>
                        </Tr>
                    </fieldset>
                    <div className={x.cls(['imgs_fieldset_filler', 'imgs_fieldset_filler_bottom', scrolling.ob.imgs_fieldset_filler_bottom_none_cls])} />
                </div>
                <div className="pagination_w" style={{ width: changing_imgs_fieldset_width.ob.imgs_width }}>
                    <Pagination
                        activePage={pagination.ob.active_page}
                        itemsCountPerPage={populate_storage_with_images_and_display_them.con.imgs_per_page}
                        totalItemsCount={total_number_of_imgs.ob.number_of_imgs}
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

class Imgs extends React.Component {
    constructor(props) {
        super(props);

        this.set_img_w_refs = this.set_img_w_refs.bind(this);

        this.img_w_refs = {};
        this.img_w_trs = [];

        this.mut = {
            broken_imgs_ids: [],
        };
    }

    set_img_w_refs(id, img) {
        try {
            this.img_w_refs[id] = img;

        } catch (er) {
            err(er, 80);
        }
    }

    delete_broken_imgs = async () => {
        try {
            if (this.mut.broken_imgs_ids.length > 0) {
                await img_deletion.delete_img(this.mut.broken_imgs_ids[0]);

                this.mut.broken_imgs_ids.shift();
            }

        } catch (er) {
            err(er, 81);
        }
    }

    img_load_callback = async (id, e) => {
        try {
            if (e) {
                const e_type = e.type;

                await x.delay(0);

                if (populate_storage_with_images_and_display_them.ob.imgs.length !== 0) { // prevent bug when deleting all images when solid color image present
                    img_loading.mut.imgs_loaded++;

                    const number_of_imgs_to_load = populate_storage_with_images_and_display_them.ob.imgs.length - populate_storage_with_images_and_display_them.mut.previous_number_of_imgs;

                    if (e_type === 'error') { // when broken image loaded
                        this.mut.broken_imgs_ids.push(id);
                    }

                    if ((populate_storage_with_images_and_display_them.mut.previous_number_of_imgs === populate_storage_with_images_and_display_them.con.imgs_per_page && img_loading.mut.imgs_loaded === populate_storage_with_images_and_display_them.con.imgs_per_page) || (populate_storage_with_images_and_display_them.mut.previous_number_of_imgs !== populate_storage_with_images_and_display_them.con.imgs_per_page && img_loading.mut.imgs_loaded >= number_of_imgs_to_load)) {
                        img_loading.mut.imgs_loaded = 0;

                        if (populate_storage_with_images_and_display_them.mut.scroll_to === 'bottom') {
                            ref.imgs_fieldset.current.scrollTop = ref.imgs_fieldset.current.scrollHeight;

                        } else if (populate_storage_with_images_and_display_them.mut.scroll_to === 'top') {
                            ref.imgs_fieldset.current.scrollTop = 0;
                        }

                        img_loading.hide_loading_screen();
                        scrolling.show_or_hide_imgs_fieldset_fillers();
                        ui_state.enable_ui();
                        this.delete_broken_imgs();
                    }

                    img_loading.show_loaded_img(this.img_w_refs[id]);
                }
            }

        } catch (er) {
            err(er, 82);
        }
    }

    //> show transparency background checkerboard
    show_checkerboard = id => {
        try {
            img_loading.show_checkerboard(this.img_w_refs[id]);

        } catch (er) {
            err(er, 83);
        }
    }
    //< show transparency background checkerboard

    render() {
        return (
            <React.Fragment>
                {
                    populate_storage_with_images_and_display_them.ob.imgs.map((img, i) => (
                        <Tr
                            attr={{
                                className: 'img_w_tr',
                            }}
                            tag="span"
                            name="img"
                            state={img.show_delete}
                            tr_end_callbacks={[img_deletion.delete_img_tr_end_callback, this.delete_broken_imgs]}
                            key={img.key}
                            tr_ref={node => { this.img_w_trs[i] = node; }}
                        >
                            <span
                                className={x.cls(['img_w', img.selected ? 'selected_img' : null])}
                                role="button"
                                tabIndex="0"
                                style={{
                                    backgroundColor: img.placeholder_color,
                                    backgroundRepeat: '14px 14px',
                                    backgroundSize: '14px 14px',
                                }}
                                onClick={img_selection.select_img.bind(null, img.id)}
                                onMouseDown={e => moving.start_drag(this.img_w_trs[i], e)}
                                onMouseMove={e => moving.create_drop_area(this.img_w_trs[i], 'options', e)}
                                onKeyUp={enter_click.simulate_click_on_enter}
                                onTransitionEnd={this.show_checkerboard.bind(null, img.id)}
                                ref={img_ref => this.set_img_w_refs(img.id, img_ref)}
                            >
                                <Img_inner_w
                                    i={i}
                                    img={img}
                                    img_w_trs={this.img_w_trs}
                                    img_load_callback={this.img_load_callback}
                                    delete_img={() => img_deletion.delete_img(img.id)}
                                />
                            </span>
                        </Tr>
                    ))
                }
            </React.Fragment>
        );
    }
}

const Img_inner_w = observer(props => {
    const { i, img, img_w_trs, img_load_callback, delete_img } = props;

    return (
        <div className="img_inner_w">
            <div className="img_inner_w_2 opacity_0" style={{ opacity: img_loading.mut.img_inner_w_2_mounts_transparent ? null : 1 }}>
                <Img
                    i={i}
                    img={img}
                    img_w_trs={img_w_trs}
                    img_load_callback={img_load_callback}
                    delete_img={delete_img}
                />
            </div>
        </div>
    );
});

class Img extends React.Component {
    constructor(props) {
        super(props);

        ({
            img: this.img,
            img_load_callback: this.img_load_callback,
            delete_img: this.delete_img,
        } = this.props);

        this.is_img = file_types.con.files[this.img.type] || file_types.con.types[this.img.type] === 'links';

        this.img_el = this.is_img
            ? (
                <img
                    className="img"
                    draggable="false"
                    src={this.img.img}
                    alt="Background"
                    onLoad={this.img_load_callback.bind(null, this.img.id)}
                    onError={this.img_load_callback.bind(null, this.img.id)}
                />
            )
            : (
                <div
                    className="solid_color_img"
                    style={{ backgroundColor: this.img.img }}
                    ref={this.img_load_callback.bind(null, this.img.id)}
                />
            );
    }

    //> open image in new tab when clicking on preview button
    preview_img = id => {
        try {
            analytics.send_options_imgs_event('previewed');

            x.send_message_to_background({ message: 'open_preview_img_tab', img_id: id });

        } catch (er) {
            err(er, 84);
        }
    }
    //< open image in new tab when clicking on preview button

    img_btn_on_keyup = e => {
        try {
            e.stopPropagation();

            enter_click.simulate_click_on_enter(e);

        } catch (er) {
            err(er, 224);
        }
    }

    render() {
        const { i, img_w_trs } = this.props;

        return (
            <React.Fragment>
                <div className="img_cover" />
                <div className="img_info_and_btns">
                    {this.is_img ? <div className="img_size img_info">{this.img.img_size}</div> : null}
                    <div className="img_type img_info">{x.msg(`img_type_${this.img.type}_text`)}</div>
                    <div
                        role="button"
                        className="move_img_btn img_btn img_info"
                        tabIndex="0"
                        onClick={() => moving.prompt_to_move(img_w_trs[i])}
                        onKeyUp={this.img_btn_on_keyup}
                    >
                        {x.msg('move_img_text')}
                    </div>
                    <div
                        role="button"
                        className="img_preview_btn img_btn img_info"
                        tabIndex="0"
                        onClick={this.preview_img.bind(null, this.img.id)}
                        onKeyUp={this.img_btn_on_keyup}
                    >
                        {x.msg('img_preview_text')}
                    </div>
                </div>
                {this.img_el}
                <button
                    type="button"
                    className="delete_img_btn"
                    onClick={this.delete_img}
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
    imgs_fieldset: React.createRef(),
};

observer(Imgs_fieldset);
observer(Imgs);
observer(Img);
