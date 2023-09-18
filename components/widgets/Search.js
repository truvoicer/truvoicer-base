import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const Search = (props) => {
    const [ query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const formClickHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
        listingsManager.runSearch();
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

export default connect(
    null,
  null
)(Search);
