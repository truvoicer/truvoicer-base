import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ItemContext} from "@/truvoicer-base/components/blocks/listings/contexts/ItemContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const TopbarSearch = (props) => {
    const [query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemContext = useContext(ItemContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
        listingsManager.runSearch();
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
    }

    const formChangeHandler = (e) => {
        e.preventDefault()
        setQuery(e.target.value);
    }
    return (
        <div className="top-search-area">
            <form onSubmit={formSubmitHandler}>
                <input
                    type="search"
                    name="top-search"
                    id="topSearch"
                    placeholder="Search"
                    value={query}
                    onChange={formChangeHandler}
                />
                <button type="submit" className="btn">
                    <i className="fa fa-search"/>
                </button>
            </form>
        </div>
    )
}

export default connect(
    null,
    null
)(TopbarSearch);
