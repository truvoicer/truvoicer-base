import React, {useState} from "react";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../redux/middleware/listings-middleware";
import {setSearchRequestOperationMiddleware} from "../../redux/middleware/search-middleware";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";

const TopbarSearch = (props) => {
    const [query, setQuery] = useState("");

    const formClickHandler = (e) => {
        e.preventDefault();
        props.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        props.addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
    }

    const formChangeHandler = (e) => {
        setQuery(e.target.value);
    }
    return (
        <div className="top-search-area">
            <form action="#" method="post">
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
    {
        addListingsQueryDataString,
        setSearchRequestOperationMiddleware
    }
)(TopbarSearch);