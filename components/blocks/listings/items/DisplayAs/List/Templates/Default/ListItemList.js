import React, { useContext } from "react";
import { formatDate } from "@/truvoicer-base/library/utils";
import {
    SESSION_USER, SESSION_USER_EMAIL,
    SESSION_USER_ID
} from "@/truvoicer-base/redux/constants/session-constants";
import { connect } from "react-redux";
import Link from "next/link";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import SavedItemToggle from "@/truvoicer-base/components/blocks/listings/widgets/SavedItemToggle";
import ItemRatings from "@/truvoicer-base/components/blocks/listings/widgets/ItemRatings";
import { DISPLAY_AS } from "@/truvoicer-base/redux/constants/general_constants";
import Thumbnail from "@/truvoicer-base/components/blocks/listings/components/Thumbnail";

const ListItemList = (props) => {
    const { data, } = props;
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const itemId = listingsManager.listingsEngine.extractItemId(props.data);
    
    const linkProps = listingsManager.getLinkProps({
        data: data,
        searchCategory: props.searchCategory,
        userId: props.user[SESSION_USER_ID],
        userEmail: props.user[SESSION_USER_EMAIL],
        showInfoCallback: props?.showInfoCallback,
        otherTrackData: {
            dataLayerName: "defaultListItemClick",
        }
    });
    const date = listingsManager.getDataKeyValue(data, 'date_key');

    const thumbnailData = listingsManager.getThumbnail(data);
    return (
        <>
            <div className="post-block-style post-float-half clearfix">
                <Thumbnail
                    data={data}
                    type={thumbnailData?.type}
                    value={thumbnailData?.value}
                    linkProps={linkProps}
                />
                <div className="post-content">
                    <h2 className="post-title">
                        <Link {...linkProps}>{listingsManager.getDataKeyValue(data, 'title_key')}</Link>
                    </h2>
                    <div className="post-meta">
                        <span className="post-author"><a href="#">{data.provider}</a></span>
                        <span className="post-date">{date && formatDate(date)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <SavedItemToggle
                            provider={props.data.provider}
                            category={props.searchCategory}
                            item_id={itemId}
                            user_id={props.user[SESSION_USER_ID]}
                            savedItem={data?.is_saved || false}
                        />
                        <ItemRatings
                            provider={props.data.provider}
                            category={props.searchCategory}
                            item_id={itemId}
                            user_id={props.user[SESSION_USER_ID]}
                            ratingsData={{
                                rating: data?.rating?.overall_rating || 0,
                                total_users_rated: data?.rating?.total_users_rated || 0
                            }}
                        />
                    </div>
                    <p>{listingsManager.getDataKeyValue(data, 'excerpt_key')}</p>
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

ListItemList.category = 'listings';
ListItemList.templateId = 'listItemList';
export default connect(
    mapStateToProps,
    null
)(ListItemList);
