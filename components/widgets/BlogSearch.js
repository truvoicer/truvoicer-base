import React, {useState} from "react";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../redux/middleware/listings-middleware";
import {setSearchRequestOperationMiddleware} from "../../redux/middleware/search-middleware";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";

const BlogSearch = (props) => {
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
        <aside className="single_sidebar_widget search_widget">
            <form method="post" onSubmit={formClickHandler}>
                <div className="form-group">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control"
                               placeholder='Search Keyword'
                               value={query}
                               onChange={formChangeHandler}
                        />
                        <div className="input-group-append">
                            <button className="btn"
                                    type="button"
                                    onClick={formClickHandler}
                            >
                                <i className="ti-search"/>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </aside>
    )
}

export default connect(
    null,
    {
        addListingsQueryDataString,
        setSearchRequestOperationMiddleware
    }
)(BlogSearch);
