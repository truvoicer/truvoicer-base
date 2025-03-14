import React, { Suspense, useContext } from 'react';
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/components/ListingsSortBar";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import { isNotEmpty } from "@/truvoicer-base/library/utils";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import { connect } from "react-redux";
import ListingsFilterInterface from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsFilterInterface";
import ListingsItemsLoader from '../../../../../ListingsItemsLoader';
import ListingsPaginate from '@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate';

const ListDisplay = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const filtersPosition = props.data?.filters_position || "right";

    const getListingsBlock = () => {
        return (
            <div className="block category-listing">
                <div className="row">
                    <div className="col-md-12">
                        {searchContext?.searchList?.length > 0 ?
                            <>
                                {templateManager.render(<ListingsSortBar />)}
                                <Suspense>
                                    {listingsContext?.listingsData?.load_more_type === "pagination" &&
                                        templateManager.render(
                                            <ListingsPaginate>
                                                <ListingsItemsLoader />
                                            </ListingsPaginate>
                                        )
                                    }
                                </Suspense>
                                {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                                    templateManager.render(
                                        <ListingsInfiniteScroll>
                                            <ListingsItemsLoader />
                                        </ListingsInfiniteScroll>
                                    )
                                }
                            </>
                            :
                            templateManager.render(<LoaderComponent key={"loader"} />)
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    {listingsManager.listingsEngine.showSidebar()
                        ?
                        <>
                            {filtersPosition === 'left' &&
                                <div className="col-md-3 col-sm-12">
                                    <div className="sidebar">
                                        {templateManager.render(<ListingsFilterInterface />)}
                                    </div>
                                </div>
                            }
                            <div className="col-md-8 col-sm-12">
                                {getListingsBlock()}
                            </div>

                            {filtersPosition === 'right' &&
                                <div className="col-md-3 col-sm-12">
                                    <div className="sidebar">
                                        {templateManager.render(<ListingsFilterInterface />)}
                                    </div>
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

ListDisplay.category = 'listings';
ListDisplay.templateId = 'listDisplay';

export default connect(
    state => {
        return {
            page: state.page
        }
    }
)(ListDisplay);
