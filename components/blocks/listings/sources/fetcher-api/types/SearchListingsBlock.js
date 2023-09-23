import React, {useContext} from "react";
import {connect} from "react-redux";
import LoaderComponent from "../../../../../widgets/Loader";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import LeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/sources/fetcher-api/ListingsSortBar";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {isFunction} from "underscore";
import {buildComponent} from "@/truvoicer-base/library/helpers/component-helpers";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";

const SearchListingsBlock = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext))
    // props.data.show_filters
    const defaultHeadingButtonLabel = "Browse More Jobs";
    const defaultHeadingButtonUrl = "Browse More Jobs";
    const headerButtonLabel = getExtraDataValue("header_button_label", listingsContext?.listingsData?.extra_data);
    const headerButtonUrl = getExtraDataValue("header_button_url", listingsContext?.listingsData?.extra_data);
    const filtersPosition = props.data?.filters_position || "right";

    const getListingsBlock = () => {
        return (
            <>
                {searchContext?.searchList?.length > 0 && searchContext?.searchStatus === SEARCH_REQUEST_COMPLETED ?
                    <>
                        <ListingsSortBar/>
                        {listingsContext?.listingsData?.load_more_type === "pagination" &&
                            templateManager.getTemplateComponent({
                                category: 'listings',
                                templateId: 'paginationComponent',
                                defaultComponent: <Paginate />
                            })
                        }
                        {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                            templateManager.getTemplateComponent({
                                category: 'listings',
                                templateId: 'infiniteScrollComponent',
                                defaultComponent: <ListingsInfiniteScroll />
                            })
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
                    {props.data?.show_filters_toggle
                        ?
                        <>
                            {filtersPosition === 'left' &&
                                <div>
                                    <LeftSidebar/>
                                </div>
                            }
                            <div>
                                <div className={"listings-block"}>
                                    {getListingsBlock()}
                                </div>
                            </div>

                            {filtersPosition === 'right' &&
                                <div>
                                    <LeftSidebar/>
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
