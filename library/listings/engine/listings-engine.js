import {siteConfig} from "@/config/site-config";
import {LISTINGS_GRID_COMPACT} from "@/truvoicer-base/redux/constants/listings-constants";
import store from "@/truvoicer-base/redux/store";
import {
    setCategory,
    setListingsData,
    setListingsDataProviders,
    setListingsError, setListingsGrid, setListingsQueryData, setListingsScrollTop
} from "@/truvoicer-base/redux/reducers/listings-reducer";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS
} from "@/truvoicer-base/redux/constants/general_constants";
import {addQueryDataObjectAction, getListingsInitialLoad} from "@/truvoicer-base/redux/actions/listings-actions";
import {isSet, isEmpty, isNotEmpty, isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import {getListingsProviders, getProvidersCallback} from "@/truvoicer-base/redux/middleware/listings-middleware";
import {setSearchError, setSearchOperation} from "@/truvoicer-base/redux/reducers/search-reducer";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {getSearchLimit, setPageControlItemAction} from "@/truvoicer-base/redux/actions/pagination-actions";
import {
    NEW_SEARCH_REQUEST,
    PAGE_CONTROL_PAGE_SIZE,
    SEARCH_REQUEST_COMPLETED
} from "@/truvoicer-base/redux/constants/search-constants";
import {
    initialSearch,
    runSearch,
    setSearchCategoryAction,
    setSearchListDataAction, setSearchProviderAction, setSearchRequestServiceAction, setSearchRequestStatusAction
} from "@/truvoicer-base/redux/actions/search-actions";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import {getUserItemsListAction} from "@/truvoicer-base/redux/actions/user-stored-items-actions";
import {fetcherApiConfig} from "@/truvoicer-base/config/fetcher-api-config";
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import {ItemEngine} from "@/truvoicer-base/library/listings/engine/item-engine";
import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";
import {th} from "date-fns/locale";

export class ListingsEngine {
    constructor(context) {
        this.setListingsContext(context);
    }

    setListingsContext(context) {
        this.listingsContext = context;
    }


    updateContext({key, value}) {
        this.listingsContext.updateData({key, value})
    }
    updateContextNestedObjectData({object, key, value}) {
        this.listingsContext.updateNestedObjectData({object, key, value})
    }

    updateListingsData({key, value}) {
        this.updateContextNestedObjectData({object: "listingsData", key, value})
    }

    addError(error) {
        this.updateContext({key: "error", value: error})
    }

    getListingsProviders({api_listings_category, select_providers, providers_list}, endpoint = "providers", callback) {
        if (isSet(select_providers) && select_providers && Array.isArray(providers_list)) {
            fetchData("list", [api_listings_category, endpoint], {provider: providers_list}, callback);
        } else {
            fetchData("list", [api_listings_category, endpoint], {}, callback);
        }
    }

    addArrayItem(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        const object = Object.assign({}, listingsQueryData, {
            [key]: (isSet(listingsQueryData[key])) ? listingsQueryData[key].concat(value) : [value]
        });

        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
    }

    removeArrayItem(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        let index = listingsQueryData[key].indexOf(value);
        const newArray = [...listingsQueryData[key]]
        newArray.splice(index, 1)
        if (index === -1) return;

        const object = Object.assign({}, listingsQueryData, {
            [key]: newArray
        });
        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
        // return function (dispatch) {
        //     let listingsQueryData = {...store.getState().listings.listingsQueryData}
        //     let index = listingsQueryData[key].indexOf(value);
        //     const newArray = [...listingsQueryData[key]]
        //     newArray.splice(index, 1)
        //     if (index === -1) return;
        //
        //     const object = Object.assign({}, listingsQueryData, {
        //         [key]: newArray
        //     });
        //     dispatch(setListingsQueryData(object))
        //     if (search) {
        //         this.searchEngine.runSearch();
        //     }
        // }
    }

    addListingsQueryDataString(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
    }

    addQueryDataObjectMiddleware(queryData, search = false) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);
        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
        // return function (dispatch) {
        //     let listingsQueryData = {...store.getState().listings.listingsQueryData}
        //     let newQueryData = {};
        //     Object.keys(queryData).map(value => {
        //         newQueryData[value] = queryData[value];
        //
        //     });
        //     const object = Object.assign({}, listingsQueryData, newQueryData);
        //
        //     dispatch(setListingsQueryData(object))
        //     if (search) {
        //         this.searchEngine.runSearch();
        //     }
        // }
    }

    setListingsGridMiddleware(listingsGrid) {
        this.updateContext({key: "listingsGrid", value: listingsGrid})
        // return function (dispatch) {
        //     dispatch(setListingsGrid(listingsGrid))
        // }
    }

    addQueryDataString(key, value, search = false) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
    }

    addQueryDataObjectAction(queryData, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);

        this.updateContext({key: "listingsQueryData", value: object})
        // if (search) {
        //     this.searchEngine.runSearch();
        // }
    }

    setListingsGridAction(listingsGrid) {
        this.updateContext({key: "listingsGrid", value: listingsGrid})
    }

    setListingsScrollTopAction(show) {
        this.updateContext({key: "listingsScrollTop", value: show})
    }


}
