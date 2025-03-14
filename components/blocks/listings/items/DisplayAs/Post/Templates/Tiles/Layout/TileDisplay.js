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

    function getPostOverlayClasses(item) {
        let overlayProps = {
            className: 'post-overaly-style contentTop hot-post-top clearfix d-flex hide-gradient',
            style: { width: '100%', height: '100%' }
        };

        const thumbnailData = listingsManager.getThumbnail(item);
        if (!isNotEmpty(thumbnailData) || !isNotEmpty(thumbnailData?.type)) {
            overlayProps.className = overlayProps.className + ' no-image'
            return overlayProps;
        }
        switch (thumbnailData.type) {
            case 'bg':
                overlayProps.className = overlayProps.className + ' with-image';
                overlayProps.style = {
                    ...overlayProps.style,
                    backgroundColor: thumbnailData.value
                };
                return overlayProps;
        }

        overlayProps.className = overlayProps.className + ' no-image'
        return overlayProps;
    }

    
    function getLinkProps(item) {
        return listingsManager.getLinkProps({
            data: item,
            searchCategory: props.searchCategory,
            userId: props.user[SESSION_USER_ID],
            userEmail: props.user[SESSION_USER_EMAIL],
            showInfoCallback: props?.showInfoCallback,
            otherTrackData: {
                dataLayerName: "defaultTileListItemClick",
            }
        });
    }
    function getContainer(type, containerProps, eles) {
        switch (type) {
            case 'bg':
                return (
                    <div {...containerProps}>
                        {eles}
                    </div>
                )
            default:
                return (
                    <>
                        {eles}
                    </>
                )

        }
    }
    function renderPostContent(item, linkProps) {
        const thumbnailData = listingsManager.getThumbnail(item);
        let imageSrc;
        let style = {};

        switch (thumbnailData?.type) {
            case 'bg':
                style = {
                    ...style,
                    width: '100%',
                    backgroundColor: thumbnailData?.value
                }
                break;
            case 'image':
            case 'data_key':
                imageSrc = thumbnailData?.value;
                break;
        }
        return getContainer(
            thumbnailData?.type,
            { style },
            (
                <>
                    {imageSrc &&
                        <div className="post-thumb">
                            <Link {...linkProps}>
                                <img className="img-fluid"
                                    src={imageSrc}
                                    alt="" />
                            </Link>
                        </div>
                    }
                    <div className="post-content">
                        {item?.provider &&
                            <a className="post-cat" href="#">{item.provider}</a>
                        }
                        <h2 className="post-title title-extra-large">
                            <Link {...getLinkProps(item)}>
                                {item?.title || ''}
                            </Link>
                        </h2>
                        <span
                            className="post-date">{formatDate(item?.date_published)}</span>
                    </div>
                </>
            )
        );
    }

    const items = getItems();
    return (
        <section className="featured-post-area">
            <div className="container section-block">
                <div className="row">
                    <div className="col-lg-7 col-md-12 pad-r">
                        <div id="featured-slider" className="owl-carousel owl-theme featured-slider h-100">
                            <Slider {...defaultSettings}>
                                {items.featured.map((item, index) => {
                                    const linkProps = getLinkProps(item);
                                    return (
                                        <div key={index} className='post-overaly-style contentTop hot-post-top clearfix d-flex h-100'>
                                            {renderPostContent(item, linkProps)}
                                        </div>
                                    );
                                })}
                            </Slider>

                        </div>
                    </div>

                    <div className="col-lg-5 col-md-12 pad-l d-none d-lg-block">
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...defaultSettings}>
                                    {items.hot.map((item, index) => {
                                        const linkProps = getLinkProps(item);
                                        return (
                                            <div key={index} className='post-overaly-style contentTop hot-post-top clearfix d-flex mb-1'>
                                                {renderPostContent(item, linkProps)}
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>

                            <div className="col-md-6 pad-r-small d-none d-lg-block">
                                <Slider {...defaultSettings}>
                                    {items.bottom.map((item, index) => {
                                        const linkProps = getLinkProps(item);
                                        return (
                                            // <div key={index}
                                            //     className={`${getPostOverlayClasses(item).className} hot-post-bottom`}>
                                            //     <div className='featured-post-bg-image' style={getPostOverlayClasses(item).style}>
                                            //         {renderPostContent(item, linkProps)}
                                            //     </div>
                                            // </div>
                                            <div key={index} className='post-overaly-style contentTop hot-post-top clearfix d-flex'>
                                                {renderPostContent(item, linkProps)}
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>

                            <div className="col-md-6 pad-l-small d-none d-lg-block">
                                <Slider {...defaultSettings}>
                                    {items.bottom2.map((item, index) => {
                                        const linkProps = getLinkProps(item);
                                        return (
                                            <div key={index} className='post-overaly-style contentTop hot-post-top clearfix d-flex'>
                                                {renderPostContent(item, linkProps)}
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
    );
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
