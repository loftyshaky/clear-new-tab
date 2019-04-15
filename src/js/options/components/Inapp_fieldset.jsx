import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as inapp from 'options/inapp';

export class Inapp_fieldset extends React.Component {
    componentDidMount() {
        try {
            this.add_mouse_up_event_to_link();

        } catch (er) {
            err(er, 293);
        }
    }


    componentDidUpdate() {
        try {
            this.add_mouse_up_event_to_link();

        } catch (er) {
            err(er, 319);
        }
    }

    try_to_buy = product_id => {
        try {
            analytics.send_inapp_event('tried_to_buy', product_id);

            inapp.buy_product(product_id);

        } catch (er) {
            err(er, 305);
        }
    };

    add_mouse_up_event_to_link = () => {
        x.bind(s('.inapp_clear_new_tab_for_firefox_link'), 'mouseup', analytics.send_links_event.bind(null, 'inapp', 'clear_new_tab_for_link', 'firefox'));
    };

    render() {
        return (
            <fieldset className="input_fieldset inapp_fieldset">
                <legend
                    className="inapp_legend"
                    data-text="inapp_legend_text"
                />
                <div className="inapp_w">
                    {/* eslint-disable-next-line react/no-danger */}
                    <p dangerouslySetInnerHTML={{ __html: x.msg(`products_purchasing_overview_${inapp.ob.products_purchasing_overview}_text`) }} />

                    {
                        inapp.ob.products_purchasing_overview === 'can_buy' ? (
                            <table className="products_table">
                                <thead>
                                    <tr>
                                        <Th msg="products_table_feature_header_text" />
                                        <Th msg="products_table_price_header_text" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        inapp.ob.products_to_display.map(product => {
                                            const slideshow_product = inapp.ob.products_to_display.find(item => {
                                                try {
                                                    return item.sku === 'slideshow';

                                                } catch (er) {
                                                    err(er, 304);
                                                }

                                                return undefined;
                                            });

                                            const product_is_not_purchasable = !product.sku.match(inapp.con.all_regexp) && (product.purchased || inapp.mut.full_license_tier_to_offer === 1 || (product.sku === 'slide' && !slideshow_product.purchased));

                                            return (
                                                <tr
                                                    key={product.key}
                                                    className={x.cls(['products_table_row', product_is_not_purchasable ? 'products_table_row_purchased' : null])}
                                                    tabIndex={product_is_not_purchasable ? null : '0'}
                                                    onClick={product_is_not_purchasable ? null : this.try_to_buy.bind(null, product.sku)}
                                                >
                                                    <td className="products_table_cell">
                                                        <div className="products_table_row_title">{product.localeData[0].title}</div>
                                                        <div className="products_table_row_description">{product.localeData[0].description}</div>
                                                    </td>
                                                    <td className="products_table_cell products_table_price_cell">
                                                        {product.purchased ? x.msg('products_table_purchased_text') : `${product.prices[0].valueMicros / 1000000} ${product.prices[0].currencyCode}`}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        )
                            : null
                    }
                </div>
            </fieldset>
        );
    }
}

const Th = props => {
    const { msg } = props;

    return (
        <th className="products_table_cell">{x.msg(msg)}</th>
    );
};

observer(Inapp_fieldset);
