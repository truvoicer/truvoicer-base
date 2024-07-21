import {connect} from "react-redux";
import React, {useContext, useEffect, useState} from "react";
import {SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED} from "@/truvoicer-base/redux/constants/search-constants";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";


const ListingsSortBar = (props) => {
    const [limit, setLimit] = useState(10);
    const [layout, setLayout] = useState(LISTINGS_GRID_LIST);
    const [limitOptions, setLimitOptions] = useState([
        {value: 10, label: 10},
        {value: 50, label: 50},
        {value: 100, label: 100},
    ]);
    const [layoutOptions, setLayoutOptions] = useState([
        {value: LISTINGS_GRID_LIST, label: 'List'},
        {value: LISTINGS_GRID_COMPACT, label: 'Compact'},
        {value: LISTINGS_GRID_DETAILED, label: 'Detailed'},
    ]);

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function getLimitOptionsSelect() {
        return limitOptions.map((item, index) => {
            if (index > 0) {
                return item;
            }
            let pageSize = listingsManager?.searchEngine?.searchContext?.query?.[fetcherApiConfig.searchLimitKey];
            if (isNotEmpty(pageSize)) {
                item.value = parseInt(pageSize);
                item.label = parseInt(pageSize);
            }
            return item;
        });
    }
    const layoutChangeHandler = (e) => {
        if (!isNotEmpty(e.target.value)) {
            return;
        }
        if (e.target.name === "limit") {
            setLimit(e.target.value)
        }
        listingsManager.listingsEngine.updateContext({
            key: "listingsGrid",
            value: e.target.value
        })
    }
    const limitChangeHandler = (e) => {
        if (!isNotEmpty(e.target.value)) {
            return;
        }
        if (e.target.name === "limit") {
            setLimit(e.target.value)
        }
        listingsManager.getSearchEngine().setSearchEntity('listingsSortBar');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        listingsManager.getSearchEngine().addStringToQuery(fetcherApiConfig.searchLimitKey, e.target.value, true)
    }

    // useEffect(() => {
    //     if (
    //         isNotEmpty(limit) &&
    //         listingsManager.canRunSearch(SEARCH_REQUEST_NEW) &&
    //         searchContext?.searchEntity === 'listingsSortBar'
    //     ) {
    //         listingsManager.runSearch('ListingsSortBar');
    //         listingsManager.getListingsEngine().setListingsScrollTopAction(true);
    //     }
    // }, [searchContext?.searchOperation, limit]);


        return (
            <div className="listings--sortbar white-bg mb-3">
                <div className="container">
                    <div className="row cat_search">
                        <div className="col-lg-3 col-md-4">
                            <div className="single_input">
                                <select
                                    className="wide form-control rounded nice-select"
                                    name="limit"
                                    placeholder={'Limit'}
                                    value={listingsManager.getListingsPostsPerPage()}
                                    onChange={limitChangeHandler}>
                                    {getLimitOptionsSelect().map((item, index) => (
                                        <option key={index} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                            <div className="single_input">
                                <select
                                    className="wide form-control rounded nice-select"
                                    name="layout"
                                    defaultValue={layout}
                                    onChange={layoutChangeHandler}>
                                    {layoutOptions && layoutOptions.map((item, index) => (
                                        <option
                                            key={index}
                                            value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}
ListingsSortBar.category = 'listings';
ListingsSortBar.templateId = 'listingsSortBar';
export default connect(
    null,
   null
)(ListingsSortBar);
