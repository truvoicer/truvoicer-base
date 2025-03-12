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
import {getPostCategoryUrl, getPostItemUrl} from "@/truvoicer-base/library/helpers/posts";

const DefaultSidebarPostItem = (props) => {
    const {data, nextPost, prevPost, postIndex} = props;
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    function getCategory() {
        if (Array.isArray(data?.categories) && data?.categories?.length > 0) {
            return data.categories[0]
        }
        return null
    }

    const category = getCategory();
    const linkProps = listingsManager.getListingsEngine().getListingsItemLinkProps({
        displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
        category: category?.slug,
        item: props.data,
    })

    return (
        <div className="post-block-style post-float clearfix">
            <div className="post-thumb">
                <Link {...linkProps}>
                    <img
                        className="img-fluid"
                        src={props.data.featured_image ? props.data.featured_image : "/img/pticon.png"}
                        alt=""
                    />
                </Link>
                {isNotEmpty(category) &&
                    <Link className="post-cat" {...linkProps}>{category?.slug || ''}</Link>
                }
            </div>


            <div className="post-content">
                <h2 className="post-title title-small">

                    <Link {...linkProps}>
                        {props?.data?.post_title || ""}
                    </Link>
                </h2>
                <div className="post-meta">
                    <span
                        className="post-date">
                        {isNotEmpty(props?.data?.post_modified) ? formatDate(props.data.post_modified) : ""}
                    </span>
                </div>
            </div>
        </div>
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
)(DefaultSidebarPostItem);
