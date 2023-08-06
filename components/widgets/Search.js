import React, {useState} from "react";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../redux/middleware/listings-middleware";
import {setSearchRequestOperationMiddleware} from "../../redux/middleware/search-middleware";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";

const Search = (props) => {
    const [ query, setQuery] = useState("");

    const formClickHandler = (e) => {
        e.preventDefault();
        props.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        props.addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
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
    {
        addListingsQueryDataString,
        setSearchRequestOperationMiddleware}
)(Search);
