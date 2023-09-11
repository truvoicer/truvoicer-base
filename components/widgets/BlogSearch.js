import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ItemContext} from "@/truvoicer-base/components/blocks/listings/contexts/ItemContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const BlogSearch = (props) => {
    const [query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemContext = useContext(ItemContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext, itemContext);

    const formClickHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
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
    null
)(BlogSearch);
