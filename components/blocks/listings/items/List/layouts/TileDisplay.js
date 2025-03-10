import React, {useContext, useEffect} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {formatDate, isNotEmpty} from "@/truvoicer-base/library/utils";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import Slider from "react-slick";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {SESSION_USER, SESSION_USER_EMAIL, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import Link from "next/link";
import {connect} from "react-redux";

const TileDisplay = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemsContext = useContext(ListingsItemsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const filtersPosition = props.data?.filters_position || "right";

    const defaultSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        arrows: false
        // nextArrow: templateManager.render(<NextArrow/>),
        // prevArrow: templateManager.render(<PrevArrow/>),
    };

    function getItems() {
        let items = {
            featured: [],
            hot: [],
            bottom: [],
            bottom2: [],
        };
        if (!itemsContext?.items?.length) {
            return items;
        }
        const split = Math.ceil(itemsContext.items.length / 4);
        items.featured = itemsContext.items.slice(0, split);
        items.hot = itemsContext.items.slice(split, split * 2);
        items.bottom = itemsContext.items.slice(split * 2, split * 3);
        items.bottom2 = itemsContext.items.slice(split * 3);
        return items;
    }
    function getFeaturedBackgroundProps(item) {
        if (!isNotEmpty(item?.item_image)) {
            return {
                className: 'item no-image',
            };

        }
        return {
            className: 'item with-image',
            style: {
                 backgroundImage: `url(${item?.item_image || ''})`
            }
        };
    }
    function getPostOverlayClasses(item) {
        if (!isNotEmpty(item?.item_image)) {
            return 'post-overaly-style contentTop hot-post-top no-image clearfix';

        }
        return 'post-overaly-style contentTop hot-post-top with-image clearfix';
    }
    function getLinkProps(item) {
        return listingsManager.getListingsEngine().getListingsItemLinkProps({
            displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
            category: props.searchCategory,
            item,
            trackData: {
                dataLayerName: "listItemClick",
                dataLayer: {
                    provider: item.provider,
                    category: props.searchCategory,
                    item_id: item.item_id,
                    user_id: props.user[SESSION_USER_ID] || "unregistered",
                    user_email: props.user[SESSION_USER_EMAIL] || "unregistered",
                },
            }
        })
    }
    const items = getItems();
    return (
        <section className="featured-post-area">
            <div className="container section-block">
                <div className="row">
                    <div className="col-lg-7 col-md-12 pad-r">
                        <div id="featured-slider" className="owl-carousel owl-theme featured-slider">
                            <Slider {...defaultSettings}>
                                {items.featured.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div {...getFeaturedBackgroundProps(item)}>
                                                <div className="featured-post">
                                                    <div className="post-content">
                                                        <a className="post-cat" href="#">Health</a>
                                                        <h2 className="post-title title-extra-large">
                                                            <Link {...getLinkProps(item)}>
                                                                {item?.item_title || ''}
                                                            </Link>
                                                        </h2>
                                                        <span
                                                            className="post-date">{formatDate(item?.item_date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>

                        </div>
                    </div>

                    <div className="col-lg-5 col-md-12 pad-l">
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...defaultSettings}>
                                    {items.hot.map((item, index) => {
                                        const linkProps = getLinkProps(item);
                                        return (
                                            <div key={index}
                                                 className={getPostOverlayClasses(item)}>
                                                <div className="post-thumb">
                                                    <Link {...linkProps}>
                                                        <img className="img-fluid"
                                                             src={item?.item_image || ''}
                                                             alt=""/>
                                                    </Link>
                                                </div>
                                                <div className="post-content">
                                                    <a className="post-cat" href="#">Gadget</a>
                                                    <h2 className="post-title title-large">
                                                        <Link {...linkProps}>
                                                            {item?.item_title || ''}
                                                        </Link>
                                                    </h2>
                                                    <span className="post-date">{formatDate(item?.item_date)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>

                            <div className="col-md-6 pad-r-small">
                                <Slider {...defaultSettings}>
                                    {items.bottom.map((item, index) => {
                                        const linkProps = getLinkProps(item);
                                        return (
                                            <div key={index}
                                                 className={`${getPostOverlayClasses(item)} hot-post-bottom`}>
                                                <div className="post-thumb">
                                                    <Link {...linkProps}>
                                                        <img className="img-fluid"
                                                                     src={item?.item_image || ''}
                                                             alt=""/>
                                                    </Link>
                                                </div>
                                                <div className="post-content">
                                                    <a className="post-cat" href="#">Travel</a>
                                                    <h2 className="post-title title-medium">
                                                        <Link {...linkProps}>
                                                            {item?.item_title || ''}
                                                        </Link>
                                                    </h2>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>

                            <div className="col-md-6 pad-l-small">
                                <Slider {...defaultSettings}>
                                    {items.bottom2.map((item, index) => {
                                        return (
                                            <div key={index}
                                                 className={`${getPostOverlayClasses(item)} hot-post-bottom`}>
                                                <div className="post-thumb">
                                                    <a href="#"><img className="img-fluid"
                                                                     src={item?.item_image || ''}
                                                                     alt=""/></a>
                                                </div>
                                                <div className="post-content">
                                                    <a className="post-cat" href="#">Health</a>
                                                    <h2 className="post-title title-medium">
                                                        <a href="#">{item?.item_title || ''}</a>
                                                    </h2>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
};

TileDisplay.category = 'listings';
TileDisplay.templateId = 'tileDisplay';

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(TileDisplay);
