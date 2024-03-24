import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import LoaderComponent from "../../../../../loaders/Loader";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/sources/fetcher-api/ListingsSortBar";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {isFunction} from "underscore";
import {buildComponent} from "@/truvoicer-base/library/helpers/component-helpers";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const SearchListingsBlock = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext))
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    // props.data.show_filters
    const defaultHeadingButtonLabel = "Browse More Jobs";
    const defaultHeadingButtonUrl = "Browse More Jobs";
    const headerButtonLabel = getExtraDataValue("header_button_label", listingsContext?.listingsData?.extra_data);
    const headerButtonUrl = getExtraDataValue("header_button_url", listingsContext?.listingsData?.extra_data);
    const filtersPosition = props.data?.filters_position || "right";

    useEffect(() => {
        if (!listingsContext.loaded) {
            return;
        }
        listingsManager.runSearch('SearchListingsBlock');
    }, [listingsContext.loaded]);

    const getListingsBlock = () => {
        // console.log(searchContext?.searchStatus, searchContext?.searchList?.length)
        return (
            <>
                {searchContext?.searchList?.length > 0 && searchContext?.searchStatus === SEARCH_REQUEST_COMPLETED ?
                    <>
                        <ListingsSortBar/>
                        {listingsContext?.listingsData?.load_more_type === "pagination" &&
                            <Paginate />
                        }
                        {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                            <ListingsInfiniteScroll />
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
            <div className={"listings-container"}>
                {isNotEmpty(listingsContext?.listingsData?.heading) &&
                    <div className={"listings-heading"}>
                        <h3>{listingsContext.listingsData.heading}</h3>
                    </div>
                }
                <div>
                    {props.data?.show_sidebar
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
        )
    }


    function getLayout() {
        let buildProps = {...props};
        buildProps.getListingsBlock = getListingsBlock;
        return templateManager.getTemplateComponent({
            category: 'listings',
            templateId: 'layoutComponent',
            defaultComponent: defaultLayout(),
            props: buildProps
        });
    }

    return getLayout();
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(SearchListingsBlock);
