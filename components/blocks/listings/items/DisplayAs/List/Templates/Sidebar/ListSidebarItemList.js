import React, {useContext} from "react";
import {formatDate, isNotEmpty} from "@/truvoicer-base/library/utils";
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
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import SavedItemToggle from "@/truvoicer-base/components/blocks/listings/widgets/SavedItemToggle";
import ItemRatings from "@/truvoicer-base/components/blocks/listings/widgets/ItemRatings";

const ListSidebarItemList = (props) => {
    const {data} = props;
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
            dataLayerName: "defaultSidebarListItemClick",
        }
    });
    
    const date = listingsManager.getDataKeyValue(data, 'date_key');

    const thumbnailData = listingsManager.getThumbnail(data);
    return (
        <div className="post-block-style clearfix d-flex gap-3 justify-content-start align-items-center">
            {thumbnailData?.type === 'data_key' &&
                    <div className="post-thumb">
                        <Link {...linkProps}>
                            <img className="img-fluid"
                                style={listingsManager.getThumbnailImgStyle(data)}
                                src={thumbnailData?.value ? thumbnailData.value : "/img/pticon.png"} alt=""/>
                        </Link>
                    </div>
                }
                {thumbnailData?.type === 'bg' &&
                    // <div>
                        <Link {...linkProps} 
                            className="post-thumb" 
                            style={{
                                ...listingsManager.getThumbnailImgStyle(data),
                                backgroundColor: thumbnailData?.value || '#eeeeee'
                            }}>
                                
                        </Link>
                    // </div>
                }
                {thumbnailData?.type === 'image' &&
                    <div className="post-thumb">
                        <Link {...linkProps}>
                            <img className="img-fluid"
                                style={listingsManager.getThumbnailImgStyle(data)}
                                src={thumbnailData?.value ? thumbnailData.value : "/img/pticon.png"} alt=""/>
                        </Link>
                    </div>
                }


            <div className="post-content">
                <h2 className="post-title title-small">

                    <Link {...linkProps}>
                        {listingsManager.getDataKeyValue(data, 'title_key') || ""}
                    </Link>
                </h2>
                <div className="post-meta d-flex align-items-center gap-1">
                        <span
                            className="me-0 pe-0 post-date">{isNotEmpty(date) ? formatDate(date) : ""}</span>
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
                        showUserCount={false}
                    />
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

ListSidebarItemList.category = 'listings';
ListSidebarItemList.templateId = 'listSidebarItemList';

export default connect(
    mapStateToProps,
    null
)(ListSidebarItemList);
