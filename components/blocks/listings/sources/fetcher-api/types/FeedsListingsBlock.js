import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {BlogContext} from "@/truvoicer-base/config/contexts/BlogContext";
import JobNewsItemView from "../../../../../../../views/Components/Blocks/Listings/ListingsItems/Items/JobNews/JobNewsItemView";
import FeedsSidebar from "@/truvoicer-base/components/Sidebars/FeedsSidebar";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";

const FeedsListingsBlock = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    // const router = useRouter();
    const itemLinkClickHandler = (data, showItemView, e) => {
        // e.preventDefault();
        const nameKey = data.item_title.replace(" ", "_").toLowerCase();
        setItemViewData(data)
        setShowItemView(showItemView)
        setShowListing(!showItemView)

    }
    const [blogContextData, setBlogContextData] = useState({
        itemLinkClickHandler: itemLinkClickHandler
    });
    const defaultHeadingButtonLabel = "Browse More Jobs";
    const defaultHeadingButtonUrl = "Browse More Jobs";
    const headerButtonLabel = getExtraDataValue("header_button_label", listingsContext?.listingsData?.extra_data);
    const headerButtonUrl = getExtraDataValue("header_button_url", listingsContext?.listingsData?.extra_data);
    const [showListing, setShowListing] = useState(true);
    const [showItemView, setShowItemView] = useState(false);
    const [itemViewData, setItemViewData] = useState({});


    const getListingsBlock = () => {
        return (
            <>
                {showListing &&
                <>
                    {searchContext?.searchList.length > 0 && searchContext?.searchStatus === SEARCH_REQUEST_COMPLETED ?
                        <>
                            {/*<ListingsSortBar/>*/}
                            {listingsContext?.listingsData.load_more_type === "pagination" &&
                            <Paginate/>
                            }
                            {listingsContext?.listingsData.load_more_type === "infinite_scroll" &&
                            <ListingsInfiniteScroll/>
                            }
                        </>
                        :
                        <LoaderComponent key={"loader"}/>
                    }
                </>
                }
                {showItemView &&
                    <JobNewsItemView data={itemViewData}/>
                }
            </>
        );
    }
    return (
        <BlogContext.Provider value={blogContextData}>
            <section className="blog_area section-padding">
                <div className="container">
                    {!props.data.show_filters &&
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="section_title">
                                <h3>{listingsContext?.listingsData.listings_block_heading}</h3>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="brouse_job text-right">
                                <a
                                    href={isNotEmpty(headerButtonUrl) ? headerButtonUrl : defaultHeadingButtonUrl}
                                    className="boxed-btn4">
                                    {isNotEmpty(headerButtonLabel) ? headerButtonLabel : defaultHeadingButtonLabel}
                                </a>
                            </div>
                        </div>
                    </div>
                    }
                    <div className={"row"}>
                        {props.data.show_filters
                            ?
                            <>
                                <div className="col-lg-8 mb-5 mb-lg-0">
                                    <div className="blog_left_sidebar">
                                        {getListingsBlock()}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="blog_right_sidebar">
                                        <FeedsSidebar/>
                                    </div>
                                </div>
                            </>
                            :
                            <div className="blog_left_sidebar">
                                {getListingsBlock()}
                            </div>
                        }
                    </div>
                </div>
            </section>
        </BlogContext.Provider>
    )
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(FeedsListingsBlock);
