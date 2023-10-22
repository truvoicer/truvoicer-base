import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const TopbarSearch = (props) => {
    const [query, setQuery] = useState("");

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const formSubmitHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString(fetcherApiConfig.queryKey, query, true)
        listingsManager.runSearch('TopbarSearch');
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
    }

    const formChangeHandler = (e) => {
        e.preventDefault()
        setQuery(e.target.value);
    }

    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'topbarSearch',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            formSubmitHandler: formSubmitHandler,
            formChangeHandler: formChangeHandler,
            query,
            setQuery,
            ...props
        }
    })
}

export default connect(
    null,
    null
)(TopbarSearch);
