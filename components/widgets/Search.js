import React, {useState} from "react";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../redux/middleware/listings-middleware";
import {setSearchRequestOperationMiddleware} from "../../redux/middleware/search-middleware";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {setSearchRequestServiceAction} from "../../redux/actions/search-actions";

const Search = (props) => {
    const [ query, setQuery] = useState("");

    const formClickHandler = (e) => {
        e.preventDefault();
        setSearchRequestServiceAction(fetcherApiConfig.searchOperation)
        props.setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        props.addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
    }

    const formChangeHandler = (e) => {
        setQuery(e.target.value);
    }
    return (
        <div className="single-widget-area video-widget">
            <h4 className="widget-title">{props.data.title}</h4>
            <form onSubmit={formClickHandler}>
                <input type="text"
                       placeholder="Search"
                       value={query}
                       onChange={formChangeHandler}/>
            </form>
        </div>
    )
}

export default connect(
    null,
    {
        addListingsQueryDataString,
        setSearchRequestOperationMiddleware}
)(Search);