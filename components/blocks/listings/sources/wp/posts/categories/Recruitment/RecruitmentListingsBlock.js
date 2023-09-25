import React, {useContext} from "react";
import {connect} from "react-redux";
import LeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsBlockContainer
    from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {SEARCH_REQUEST_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import LoaderComponent from "../../../../../../../widgets/Loader";
import GridItems from "../../../../../items/GridItems";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const RecruitmentListingsBlock = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    // props.data.show_filters
    const defaultHeadingButtonLabel = "Browse More Jobs";
    const defaultHeadingButtonUrl = "Browse More Jobs";
    const headerButtonLabel = getExtraDataValue("header_button_label", listingsContext?.listingsData?.extra_data);
    const headerButtonUrl = getExtraDataValue("header_button_url", listingsContext?.listingsData?.extra_data);

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
                <div className="job_listing_area pt-5">
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
                                    <div className="col-12 col-sm-9 col-md-6 col-lg-3 d-none d-lg-block">
                                        <LeftSidebar/>
                                    </div>
                                    <div className="col-12 col-lg-9">
                                        <div className={"listings-block job_lists mt-0"}>
                                            {getListingsBlock()}
                                        </div>
                                    </div>
                                </>
                                :
                                <div className={"listings-block job_lists"}>
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
        templateId: 'recruitmentListingsBlock',
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
)(RecruitmentListingsBlock);
