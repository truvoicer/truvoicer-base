import React, {Suspense, useContext, useEffect} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {SEARCH_STATUS_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/components/ListingsSortBar";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {connect} from "react-redux";
import {tr} from "date-fns/locale";

const ComparisonDisplay = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const filtersPosition = props.data?.filters_position || "right";

    const getListingsBlock = () => {
        return (
            <div className="block category-listing">
                {isNotEmpty(listingsContext?.listingsData?.heading) &&
                    <h3 className="block-title"><span>{listingsContext.listingsData.heading}</span></h3>
                }

                <div className="row">
                    <div className="col-md-12">
                        {searchContext?.searchList?.length > 0 && searchContext?.searchStatus === SEARCH_STATUS_COMPLETED ?
                            <>
                                {templateManager.render(<ListingsSortBar/>)}
                                <Suspense>
                                    {listingsContext?.listingsData?.load_more_type === "pagination" &&
                                        templateManager.render(<Paginate/>)
                                    }
                                </Suspense>
                                {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                                    templateManager.render(<ListingsInfiniteScroll/>)
                                }
                            </>
                            :
                            templateManager.render(<LoaderComponent key={"loader"}/>)
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="block-wrapper">
            <div className="container section-block">
                <div className="row">
                    {listingsManager.listingsEngine.showSidebar()
                        ?
                        <>
                            {filtersPosition === 'left' &&
                                <div className="col-lg-4 col-sm-12">
                                    {templateManager.render(<ListingsLeftSidebar/>)}
                                </div>
                            }
                            <div className="col-lg-8 col-md-12">
                                {getListingsBlock()}
                            </div>

                            {filtersPosition === 'right' &&
                                <div className="col-lg-4 col-sm-12">
                                    {templateManager.render(<ListingsLeftSidebar/>)}
                                </div>
                            }
                        </>
                        :
                        <div className="col-12">
                            {getListingsBlock()}
                        </div>
                    }

                </div>
            </div>
        </section>
    )
};

ComparisonDisplay.category = 'listings';
ComparisonDisplay.templateId = 'comparisonDisplay';

export default connect(
    state => {
        return {
            page: state.page
        }
    }
)(ComparisonDisplay);
