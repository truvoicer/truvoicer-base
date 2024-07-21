import React, {useContext, useEffect} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {formatDate, isNotEmpty, isObjectEmpty} from "@/truvoicer-base/library/utils";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import Slider from "react-slick";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {SESSION_USER, SESSION_USER_EMAIL, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import Link from "next/link";
import {connect} from "react-redux";
import {getPostCategoryUrl, getPostItemUrl} from "@/truvoicer-base/library/helpers/posts";
import {SEARCH_STATUS_COMPLETED} from "@/truvoicer-base/redux/constants/search-constants";
import ListingsSortBar from "@/truvoicer-base/components/blocks/listings/components/ListingsSortBar";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import ListingsInfiniteScroll from "@/truvoicer-base/components/blocks/listings/pagination/ListingsInfiniteScroll";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import ListingsItemsLoader from "@/truvoicer-base/components/blocks/listings/items/ListingsItemsLoader";

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
            {searchContext?.searchList?.length > 0 && searchContext?.searchStatus === SEARCH_STATUS_COMPLETED ?
                <div className="list-post-block sidebar">
                    {templateManager.render(
                        <ListingsItemsLoader
                            containerComponent={Container}
                            containerItemComponent={ContainerItem}
                        />
                    )}
                </div>
                :
                templateManager.render(<LoaderComponent key={"loader"}/>)
            }
        </>
    )
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
