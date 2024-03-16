import React, {useContext, useEffect} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
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
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const PostsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const filtersPosition = props.data?.filters_position || "right";

    useEffect(() => {
        if (!listingsContext.loaded) {
            return;
        }
        listingsManager.runSearch();
    }, [listingsContext.loaded]);
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

    //console.log({props, listingsContext, searchContext})

    function defaultLayout() {
        return (
            <ListingsBlockContainer data={props.data}>
                <section className="blog_area section-padding">
                    <div className="container">
                        <div className={"row"}>
                            {isNotEmpty(listingsContext?.listingsData?.heading) &&
                                <div className={"listings-heading"}>
                                    <h3>{listingsContext.listingsData.heading}</h3>
                                </div>
                            }

                                {props.data?.show_sidebar
                                    ?
                                    <>
                                        {filtersPosition === 'left' &&

                                            <div className="col-12 col-sm-9 col-md-6 col-lg-3 d-none d-lg-block">
                                                <ListingsLeftSidebar sidebarName={props.data?.select_sidebar} />
                                            </div>
                                        }

                                        <div className="col-12 col-lg-9">
                                            <div className="blog_left_sidebar">
                                                {getListingsBlock()}
                                            </div>
                                        </div>

                                        {filtersPosition === 'right' &&
                                            <div className="col-12 col-sm-9 col-md-6 col-lg-3 d-none d-lg-block">
                                                <ListingsLeftSidebar sidebarName={props.data?.select_sidebar} />
                                            </div>
                                        }
                                    </>
                                    :
                                    <div className="blog_left_sidebar">
                                        {getListingsBlock()}
                                    </div>
                                }
                        </div>
                    </div>
                </section>
            </ListingsBlockContainer>
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
