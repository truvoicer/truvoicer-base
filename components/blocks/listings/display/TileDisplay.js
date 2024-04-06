import React, {useContext, useEffect} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/components/ListingsSortBar";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {
    DISPLAY_AS,
    DISPLAY_AS_COMPARISONS, DISPLAY_AS_LIST,
    DISPLAY_AS_POST_LIST, DISPLAY_AS_TILES
} from "@/truvoicer-base/redux/constants/general_constants";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import DefaultTiles from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultTiles";
import NextArrow from "@/truvoicer-base/components/blocks/carousel/arrows/NextArrow";
import PrevArrow from "@/truvoicer-base/components/blocks/carousel/arrows/PrevArrow";
import Slider from "react-slick";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";

const TileDisplay = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemsContext = useContext(ListingsItemsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const filtersPosition = props.data?.filters_position || "right";

    useEffect(() => {
        if (!listingsContext.loaded) {
            return;
        }
        listingsManager.runSearch('postsBlock');
    }, [listingsContext.loaded]);

    const defaultSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
        nextArrow: templateManager.render(<NextArrow/>),
        prevArrow: templateManager.render(<PrevArrow/>),
    };

    console.log({props, itemsContext, listingsContext, searchContext})


    return (
        <section className="featured-post-area no-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-md-12 pad-r">
                        <div id="featured-slider" className="owl-carousel owl-theme featured-slider">
                            <Slider {...defaultSettings}>
                                <div className="item"
                                     style={{backgroundImage: 'url(images/news/lifestyle/health5.jpg)'}}>
                                    <div className="featured-post">
                                        <div className="post-content">
                                            <a className="post-cat" href="#">Health</a>
                                            <h2 className="post-title title-extra-large">
                                                <a href="#">Netcix cuts out the chill with an integrated personal
                                                    trainer on running</a>
                                            </h2>
                                            <span className="post-date">March 16, 2017</span>
                                        </div>
                                    </div>

                                </div>
                                <div className="item" style={{backgroundImage: 'url(images/news/tech/gadget2.jpg)'}}>
                                    <div className="featured-post">
                                        <div className="post-content">
                                            <a className="post-cat" href="#">Gadget</a>
                                            <h2 className="post-title title-extra-large">
                                                <a href="#">Samsung Gear S3 review: A whimper, when smartwatches need a
                                                    bang</a>
                                            </h2>
                                            <span className="post-date">March 16, 2017</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="item"
                                     style={{backgroundImage: 'url(images/news/lifestyle/travel5.jpg)'}}>
                                    <div className="featured-post">
                                        <div className="post-content">
                                            <a className="post-cat" href="#">Travel</a>
                                            <h2 className="post-title title-extra-large">
                                                <a href="#">Hynopedia helps female travelers find health care in
                                                    Maldivs</a>
                                            </h2>
                                            <span className="post-date">March 16, 2017</span>
                                        </div>
                                    </div>
                                </div>
                            </Slider>

                        </div>
                    </div>

                    <div className="col-lg-5 col-md-12 pad-l">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="post-overaly-style contentTop hot-post-top clearfix">
                                    <div className="post-thumb">
                                        <a href="#"><img className="img-fluid" src="images/news/tech/gadget4.jpg"
                                                         alt=""/></a>
                                    </div>
                                    <div className="post-content">
                                        <a className="post-cat" href="#">Gadget</a>
                                        <h2 className="post-title title-large">
                                            <a href="#">Why The iPhone X Will Force Apple To Choose Between Good Or
                                                Evil</a>
                                        </h2>
                                        <span className="post-date">February 19, 2017</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 pad-r-small">
                                <div className="post-overaly-style contentTop hot-post-bottom clearfix">
                                    <div className="post-thumb">
                                        <a href="#"><img className="img-fluid"
                                                         src="images/news/lifestyle/travel2.jpg" alt=""/></a>
                                    </div>
                                    <div className="post-content">
                                        <a className="post-cat" href="#">Travel</a>
                                        <h2 className="post-title title-medium">
                                            <a href="#">Early tourists choices to the sea of Maldiv…</a>
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 pad-l-small">
                                <div className="post-overaly-style contentTop hot-post-bottom clearfix">
                                    <div className="post-thumb">
                                        <a href="#"><img className="img-fluid"
                                                         src="images/news/lifestyle/health1.jpg" alt=""/></a>
                                    </div>
                                    <div className="post-content">
                                        <a className="post-cat" href="#">Health</a>
                                        <h2 className="post-title title-medium">
                                            <a href="#">That wearable on your wrist could soon...</a>
                                        </h2>
                                    </div>
                                </div>
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

export default TileDisplay;
