import React, {Suspense, useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {SESSION_USER} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";

const Container = ({children}) => {

    return (
        <ul className={'list-post'}>
            {children}
        </ul>
    )
}
const ContainerItem = ({children}) => {
    return (
        <li className={'clearfix'}>
            {children}
        </li>
    )
}
const SidebarDisplay = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    return (
        <>
            {searchContext?.searchList?.length > 0 ?
                <div className="list-post-block sidebar">
                    <>
                        <Suspense>
                            {listingsContext?.listingsData?.load_more_type === "pagination" &&
                                templateManager.render(
                                    <Paginate
                                        containerComponent={Container}
                                        containerItemComponent={ContainerItem}
                                        showIndicator={false}
                                    />
                                )
                            }
                        </Suspense>
                        {listingsContext?.listingsData?.load_more_type === "infinite_scroll" &&
                            templateManager.render(<ListingsInfiniteScroll/>)
                        }
                    </>
                </div>
                :
                templateManager.render(<LoaderComponent key={"loader"}/>)
            }
        </>
    );
};

SidebarDisplay.category = 'listings';
SidebarDisplay.templateId = 'sidebarDisplay';

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(SidebarDisplay);
