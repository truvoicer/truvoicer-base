import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const BlogSearch = (props) => {
    const [query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const formClickHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
    }

    const formChangeHandler = (e) => {
        setQuery(e.target.value);
    }

    useEffect(() => {
        if (
            isNotEmpty(query) &&
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST
        ) {
            listingsManager.runSearch();
        }
    }, [searchContext?.searchOperation, query]);

    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'blogSearch',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            query,
            setQuery,
            formClickHandler,
            formChangeHandler,
            ...props
        }
    })
}

export default connect(
    null,
    null
)(BlogSearch);
