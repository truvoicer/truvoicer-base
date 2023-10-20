import React, {useContext} from 'react';
import FeedsListingsBlock from "./types/FeedsListingsBlock";
import SearchListingsBlock from "./types/SearchListingsBlock";
import ListingsBlockContainer
    from "../../ListingsBlockContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import PostsBlockContainer from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/PostsBlockContainer";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/sources/fetcher-api/ListingsSortBar";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";

const PostsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const filtersPosition = props.data?.filters_position || "right";

    const getListingsBlock = () => {
        return (
            <>
                {searchContext?.searchList?.length > 0 && searchContext?.searchStatus === SEARCH_REQUEST_COMPLETED ?
                    <>
                        <ListingsSortBar/>
                        {listingsContext?.listingsData?.load_more_type === "pagination" &&
                            <Paginate/>
                        }
                        {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                            <ListingsInfiniteScroll/>
                        }
                    </>
                    :
                    <LoaderComponent key={"loader"}/>
                }
            </>
        );
    }


    function defaultLayout() {
        return (
            <PostsBlockContainer data={props.data}>
                <div className={"listings-container"}>
                    {isNotEmpty(listingsContext?.listingsData?.heading) &&
                        <div className={"listings-heading"}>
                            <h3>{listingsContext.listingsData.heading}</h3>
                        </div>
                    }
                    <div>
                        {props.data?.show_listings_sidebar
                            ?
                            <>
                                {filtersPosition === 'left' &&
                                    <div>
                                        <ListingsLeftSidebar/>
                                    </div>
                                }
                                <div>
                                    <div className={"listings-block"}>
                                        {getListingsBlock()}
                                    </div>
                                </div>

                                {filtersPosition === 'right' &&
                                    <div>
                                        <ListingsLeftSidebar/>
                                    </div>
                                }
                            </>
                            :
                            <div className={"listings-block"}>
                                {getListingsBlock()}
                            </div>
                        }
                    </div>
                </div>
            </PostsBlockContainer>
        )
    }


    function getLayout() {
        let buildProps = {...props};
        buildProps.getListingsBlock = getListingsBlock;
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'postsBlock',
            defaultComponent: defaultLayout(),
            props: buildProps
        });
    }

    return getLayout();
};

export default PostsBlock;