import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {NEW_SEARCH_REQUEST} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsFilterTextItem = (props) => {
    const [query, setQuery] = useState();

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const formChangeHandler = (e) => {
        setQuery(e.target.value)
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(props.data.name, e.target.value)
    }

    return (
        <div className="single_field">
            <label className="widget-title">{props.data.label}</label>
            <input
                type={"text"}
                name={"query"}
                value={query}
                className={"form-control rounded"}
                onChange={formChangeHandler}
            />
        </div>
    )
}

export default connect(
    null,
    null
)(ListingsFilterTextItem);
