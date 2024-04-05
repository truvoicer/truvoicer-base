import React, {useContext} from "react";
import {formatDate, isNotEmpty, isSet} from "@/truvoicer-base/library/utils";
import {
    SESSION_USER,
    SESSION_USER_EMAIL,
    SESSION_USER_ID
} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import Link from "next/link";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {faClock, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import SavedItemToggle from "@/truvoicer-base/components/blocks/listings/widgets/SavedItemToggle";
import Image from "next/image";

const DefaultItemList = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const itemId = listingsManager.listingsEngine.extractItemId(props.data);

    const savedItem = listingsManager.searchEngine.isSavedItemAction(
        itemId,
        props?.data?.provider,
        props.searchCategory,
        props.user[SESSION_USER_ID]
    );

    // const ratingsData = listingsManager.searchEngine.getItemRatingDataAction(
    //     itemId,
    //     props?.data?.provider,
    //     props.searchCategory,
    //     props.user[SESSION_USER_ID]
    // );

    const linkProps = listingsManager.getListingsEngine().getItemLinkProps({
        displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
        category: props.searchCategory,
        item: props.data,
        showInfoCallback: props.showInfoCallback,
        trackData: {
            dataLayerName: "listItemClick",
            dataLayer: {
                provider: props.data.provider,
                category: props.searchCategory,
                item_id: props.data.item_id,
                user_id: props.user[SESSION_USER_ID] || "unregistered",
                user_email: props.user[SESSION_USER_EMAIL] || "unregistered",
            },
        }
    })

    return (
        <>
            {/*<div className="post-block-style post-float-half clearfix">*/}
            {/*    <div className="post-thumb">*/}
            {/*        <Link {...linkProps}>*/}
            {/*            <img  className="img-fluid"*/}
            {/*                 src={props.data.default_image ? props.data.default_image : "/img/pticon.png"} alt=""/>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*    <Link className="post-cat" {...linkProps}>Video</Link>*/}
            {/*    <div className="post-content">*/}
            {/*        <h2 className="post-title">*/}
            {/*            <Link {...linkProps}>{props.data.job_title}</Link>*/}
            {/*        </h2>*/}
            {/*        <div className="post-meta">*/}
            {/*            <span className="post-author"><a href="#">John Doe</a></span>*/}
            {/*            <span className="post-date">{formatDate(props.data.date_expires)}</span>*/}
            {/*        </div>*/}
            {/*        <SavedItemToggle*/}
            {/*            provider={props.data.provider}*/}
            {/*            category={props.searchCategory}*/}
            {/*            item_id={itemId}*/}
            {/*            user_id={props.user[SESSION_USER_ID]}*/}
            {/*            savedItem={savedItem}*/}
            {/*        />*/}
            {/*        <p>{props.data.job_description}</p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className="gap-30"></div>*/}
            <section className="featured-post-area no-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-12 pad-r">
                            <div id="featured-slider" className="owl-carousel owl-theme featured-slider">
                                <div className="item" style="background-image:url(images/news/lifestyle/health5.jpg)">
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

                                <div className="item" style="background-image:url(images/news/tech/gadget2.jpg)">
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

                                <div className="item" style="background-image:url(images/news/lifestyle/travel5.jpg)">
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
        </>
    );
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(DefaultItemList);
