import React, {useContext} from "react";
import {connect} from "react-redux";
import ListingsBlockContainer
    from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import ComparisonsSidebar from "@/truvoicer-base/components/Sidebars/ComparisonsSidebar";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ComparisonsListingsBlock = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getListingsBlock = () => {
        return (
            <>
                {searchContext?.searchList.length > 0 && searchContext?.searchStatus === SEARCH_REQUEST_COMPLETED ?
                    <>
                        <GridItems/>
                    </>
                    :
                    <LoaderComponent key={"loader"}/>
                }
            </>
        );
    }
    function defaultView() {
        return (

            <ListingsBlockContainer data={props.data}>
                <div className="listings_container pt-5">
                    <div className="container">
                        {!props.data.show_filters &&
                            <div className="row align-items-center">
                                <div className="col-lg-12">
                                    <div className="section_title">
                                        <h3>{listingsContext?.listingsData.listings_block_heading}</h3>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className={"row"}>
                            {props.data.show_filters
                                ?
                                <>
                                    <div className="col-12 col-lg-8">
                                        <div className={"listings-block job_lists mt-0"}>
                                            {getListingsBlock()}
                                        </div>
                                    </div>
                                    <div
                                        className="col-12 col-sm-9 col-md-6 col-lg-4 blog_right_sidebar d-none d-lg-block">
                                        <ComparisonsSidebar/>
                                    </div>
                                </>
                                :
                                <div className={"listings-block listings"}>
                                    {getListingsBlock()}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </ListingsBlockContainer>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'post_listings',
        templateId: 'listingsSortBar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getListingsBlock: getListingsBlock,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ComparisonsListingsBlock);
