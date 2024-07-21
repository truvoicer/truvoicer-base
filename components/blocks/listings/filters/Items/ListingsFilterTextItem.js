import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterTextItem = (props) => {
    const [query, setQuery] = useState();

    const {listingsContextGroup} = props;

    const listingsContext = listingsContextGroup?.listingsContext;
    const searchContext = listingsContextGroup?.searchContext;
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const formChangeHandler = (e) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterTextItem');
        setQuery(e.target.value)
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        listingsManager.getSearchEngine().addStringToQuery(props.data.name, e.target.value)
    }

    // useEffect(() => {
    //     if (
    //         searchContext?.searchStatus !== SEARCH_STATUS_STARTED &&
    //         searchContext?.searchOperation === SEARCH_REQUEST_NEW &&
    //         searchContext?.searchEntity === 'listingsFilterTextItem'
    //     ) {
    //         listingsManager.runSearch('listingsFilterTextItem');
    //     }
    // }, [searchContext?.searchOperation]);

    return (
        <>
            <input
                type={"text"}
                name={"query"}
                value={query}
                className={"form-control rounded"}
                onChange={formChangeHandler}
            />
        </>
    )
}

ListingsFilterTextItem.category = 'listings';
ListingsFilterTextItem.templateId = 'listingsFilterTextItem';
export default connect(
    null,
    null
)(ListingsFilterTextItem);
