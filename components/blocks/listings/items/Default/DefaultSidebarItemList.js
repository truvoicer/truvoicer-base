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

    const linkProps = listingsManager.getListingsEngine().getListingsItemLinkProps({
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
    console.log(listingsContext)
    return (
        <>
            <div className="post-block-style post-float-half clearfix">
                <div className="post-thumb">
                    <Link {...linkProps}>
                        <img  className="img-fluid"
                             src={props.data.default_image ? props.data.default_image : "/img/pticon.png"} alt=""/>
                    </Link>
                </div>
                {props.data.provider && (
                    <Link className="post-cat" {...linkProps}>{props.data.provider}</Link>
                )}
                <div className="post-content">
                    <h2 className="post-title">
                        <Link {...linkProps}>{props.data.job_title}</Link>
                    </h2>
                    <div className="post-meta">
                        <span className="post-author"><a href="#">John Doe</a></span>
                        <span className="post-date">{formatDate(props.data.date_expires)}</span>
                    </div>
                    <SavedItemToggle
                        provider={props.data.provider}
                        category={props.searchCategory}
                        item_id={itemId}
                        user_id={props.user[SESSION_USER_ID]}
                        savedItem={savedItem}
                    />
                    <p>{props.data.job_description}</p>
                </div>
            </div>

            <div className="gap-30"></div>

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
