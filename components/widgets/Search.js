import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {SEARCH_REQUEST_NEW} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const Search = (props) => {
    const [query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const formClickHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        listingsManager.getSearchEngine().addStringToQuery(fetcherApiConfig.queryKey, query, true)
    }

    const formChangeHandler = (e) => {
        setQuery(e.target.value);
    }


        return (
            <form method="post" onSubmit={formClickHandler}>
                <input type="text"
                       placeholder="Search"
                       value={query}
                       onChange={formChangeHandler}/>
                <span className={"search-icon"} onClick={formClickHandler}/>
            </form>
        )
}
Search.category = 'widgets';
Search.templateId = 'search';
export default connect(
    null,
    null
)(Search);
